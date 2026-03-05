import {
  createRental,
  getRentalsByTenant,
  getRentalsByOwner,
  updateRentalStatus,
  deleteRental,
  getRentalById,
  updateRentalAfterPayment,
  renewRentalDatesAndStatus
} from "../models/rental.model.js";

import { pool } from "../config/db.js";
import { getUserById } from "../models/user.model.js";
import { getPropertyById, updatePropertyAvailability, } from "../models/property.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import sendMail from "./mail.service.js";
import { ApiError } from "../utils/apiError.js";
import { createPayment, getPaymentByIdempotencyKey, updatePaymentStatus, getPaymentsByTenant } from "../models/payment.model.js";
import { processDummyPayment, processDummyRefund } from "./dummyGateway.service.js";
import { rentalActivatedTemplate, rentalCreatedTemplate, rentalCancelledTemplate, rentalRenewedTemplate, rentalTerminatedTemplate, ownerRentalActivatedTemplate, ownerRentalRequestTemplate, ownerRentalCancelledTemplate, ownerRentalRenewedTemplate, ownerRentalTerminatedTemplate } from "../templates/rentalMail.template.js"

import { paymentCreatedTemplate, paymentFailedTemplate, paymentSuccessTemplate, ownerPaymentReceivedTemplate } from "../templates/paymentMail.template.js";

export const createRentalService = async ({
  property_id,
  tenant_id,
  start_date,
  end_date,
  notice_period,
  monthly_rent,
  file,
  idempotency_key,
  paymentMode = "auto",
}) => {

  if (!idempotency_key)
    throw new ApiError(400, "Idempotency key required");

  const existingPayment = await getPaymentByIdempotencyKey(idempotency_key);

  if (existingPayment) {
    return {
      rental_status:
        existingPayment.payment_status === "success"
          ? "active"
          : "pending",
      payment: existingPayment,
    };
  }

  const tenant = await getUserById(tenant_id);
  if (!tenant) throw new ApiError(404, "Tenant not found");
  if (tenant.role !== "tenant")
    throw new ApiError(403, "Only tenants can create rental");

  const property = await getPropertyById(property_id);
  if (!property) throw new ApiError(404, "Property not found");

  const owner = await getUserById(property.owner_id);
  if (!owner) throw new ApiError(404, "Owner not found");

  const client = await pool.connect();

  let rental;
  let payment;

  try {
    await client.query("BEGIN");

    const lockedProperty = await getPropertyById(property_id, client, true);

    if (lockedProperty.available_rooms <= 0)
      throw new ApiError(400, "No rooms available");

    let agreement_document_url = null;

    if (file?.path) {
      const upload = await uploadOnCloudinary(
        file.path,
        "dwellio/rental-agreements"
      );
      agreement_document_url = upload.secure_url;
    }

    rental = await createRental(
      {
        property_id,
        tenant_id,
        owner_id: lockedProperty.owner_id,
        start_date,
        end_date,
        notice_period,
        monthly_rent,
        agreement_document_url,
        status: "pending",
        security_paid: false,
      },
      client
    );

    payment = await createPayment(
      {
        agreement_id: rental.id,
        tenant_id,
        owner_id: lockedProperty.owner_id,
        amount: lockedProperty.security_deposit,
        payment_status: "pending",
        idempotency_key,
      },
      client
    );

    await client.query("COMMIT");

    await sendMail({
      to: tenant.email,
      subject: "Rental Request Submitted - Dwellio",
      html: rentalCreatedTemplate(),
    });

    await sendMail({
      to: owner.email,
      subject: "New Rental Request - Dwellio",
      html: ownerRentalRequestTemplate(lockedProperty.title, tenant.full_name),
    });

    await sendMail({
      to: tenant.email,
      subject: "Payment Initiated - Dwellio",
      html: paymentCreatedTemplate(lockedProperty.security_deposit),
    });

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const gatewayResponse = await processDummyPayment({
    amount: property.security_deposit,
    mode: paymentMode,
  });

  const updateClient = await pool.connect();

  try {
    await updateClient.query("BEGIN");

    if (!gatewayResponse || gatewayResponse.status !== "success") {

      await updatePaymentStatus(
        payment.id,
        "failed",
        null,
        updateClient
      );

      await updateClient.query("COMMIT");

      await sendMail({
        to: tenant.email,
        subject: "Payment Failed - Dwellio",
        html: paymentFailedTemplate(property.security_deposit),
      });

      return {
        rental_status: "pending",
        payment_status: "failed",
        rental,
      };
    }

    await updatePaymentStatus(
      payment.id,
      "success",
      gatewayResponse.transaction_id,
      updateClient
    );

    const lockedProperty = await getPropertyById(
      property_id,
      updateClient,
      true
    );

    if (lockedProperty.available_rooms <= 0)
      throw new ApiError(400, "No rooms available");

    await updateRentalAfterPayment(rental.id, updateClient);

    const updatedRooms = lockedProperty.available_rooms - 1;

    await updatePropertyAvailability(
      lockedProperty.id,
      updatedRooms,
      updatedRooms > 0,
      updateClient
    );

    await updateClient.query("COMMIT");

   await sendMail({
      to: tenant.email,
      subject: "Payment Successful - Dwellio",
      html: paymentSuccessTemplate(property.security_deposit),
    });

    await sendMail({
      to: owner.email,
      subject: "Payment Received - Dwellio",
      html: ownerPaymentReceivedTemplate(
        tenant.full_name,
        property.security_deposit
      ),
    });
 
    await sendMail({
      to: tenant.email,
      subject: "Rental Activated - Dwellio",
      html: rentalActivatedTemplate(),
    });

    await sendMail({
      to: owner.email,
      subject: "Your Property Is Now Rented - Dwellio",
      html: ownerRentalActivatedTemplate(property.title),
    });

    return {
      rental_status: "active",
      rental,
      transaction_id: gatewayResponse.transaction_id,
    };

  } catch (error) {

    await updateClient.query("ROLLBACK");

    if (gatewayResponse?.status === "success") {

      await processDummyRefund({
        transaction_id: gatewayResponse.transaction_id,
      });

      await updatePaymentStatus(payment.id, "refunded");

      await sendMail({
        to: tenant.email,
        subject: "Refund Processed - Dwellio",
        html: refundTemplate(property.security_deposit),
      });
    }

    throw new ApiError(
      500,
      "Rental activation failed. Refund initiated."
    );

  } finally {
    updateClient.release();
  }
};


export const getTenantRentalsService = async (tenantId) => {
  const tenant = await getUserById(tenantId);
  if (!tenant) throw new ApiError(404, "Tenant not found");

  const result = await getRentalsByTenant(tenantId);
  if (!result) throw new ApiError(404, "No rentals found for this tenant");
  return result;
};

export const getOwnerRentalsService = async (ownerId) => {
  const owner = await getUserById(ownerId);
  if (!owner) throw new ApiError(404, "Owner not found");

  const result = await getRentalsByOwner(ownerId);
  if (!result) throw new ApiError(404, "No rentals found for this owner");

  return result;
};

export const getRentalByIdService = async (rentalId) => {

  const rental = await getRentalById(rentalId);

  if (!rental) {
    throw new ApiError(404, "Rental agreement not found");
  }

  if (
    rental.tenant_id !== userId &&
    rental.owner_id !== userId
  ) {
    throw new ApiError(403, "Forbidden: Access denied");
  }

  return rental;
};

export const terminateRentalService = async ({
  rentalId,
}) => {

  const rental = await getRentalById(rentalId);

  if (!rental)
    throw new ApiError(404, "Rental not found");

  if (rental.status !== "active")
    throw new ApiError(400, "Only active rentals can be terminated");

  const today = new Date();
  const effectiveDate = new Date(today);
  effectiveDate.setDate(
    today.getDate() + (rental.notice_period || 0)
  );

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      UPDATE rental_agreements
      SET
        termination_requested_at = CURRENT_TIMESTAMP,
        termination_effective_date = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [effectiveDate, rentalId]);

    await client.query("COMMIT");

    return {
      message: "Termination scheduled",
      effective_date: effectiveDate,
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const terminateExpiredRentalsService = async () => {

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(`
      SELECT *
      FROM rental_agreements
      WHERE status = 'active'
      AND termination_effective_date IS NOT NULL
      AND termination_effective_date <= CURRENT_DATE
      FOR UPDATE;
    `);

    for (const rental of rows) {

      const property = await getPropertyById(
        rental.property_id,
        client,
        true
      );

      const updatedRooms = property.available_rooms + 1;

      await updatePropertyAvailability(
        property.id,
        updatedRooms,
        true,
        client
      );

      await updateRentalStatus(
        rental.id,
        "terminated",
        client
      );
      const tenant = await getUserById(rental.tenant_id, client);
      const owner = await getUserById(rental.owner_id, client);

      await sendMail({
        to: tenant.email,
        subject: "Rental Terminated - Dwellio",
        html: rentalTerminatedTemplate(),
      });

      await sendMail({
        to: owner.email,
        subject: "Rental Agreement Terminated - Dwellio",
        html: ownerRentalTerminatedTemplate(property.title),
      });
    }

    await client.query("COMMIT");

    return {
      terminated_count: rows.length,
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const cancelRentalService = async ({
  rentalId,
}) => {

  const rental = await getRentalById(rentalId);

  if (!rental)
    throw new ApiError(404, "Rental not found");

  const today = new Date().toISOString().split("T")[0];

  if (rental.status === "pending") {

    await updateRentalStatus(
      rentalId,
      "cancelled"
    );

    return { message: "Rental cancelled successfully" };
  }

  if (
    rental.status === "active" &&
    rental.start_date > today
  ) {

    const payments = await getPaymentsByTenant(
      rental.tenant_id
    );

    const payment = payments?.find(
      (p) =>
        p.agreement_id === rentalId &&
        p.payment_status === "success"
    );

    if (payment) {

      await processDummyRefund({
        transaction_id: payment.transaction_id,
      });

      await updatePaymentStatus(
        payment.id,
        "refunded"
      );
    }

    await updateRentalStatus(
      rentalId,
      "cancelled"
    );

    await sendMail({
      to: tenant.email,
      subject: "Rental Cancelled - Dwellio",
      html: rentalCancelledTemplate(),
    });

    await sendMail({
      to: owner.email,
      subject: "Rental Cancelled by Tenant - Dwellio",
      html: ownerRentalCancelledTemplate(property.title),
    });
    return {
      message:
        "Rental cancelled and payment refunded successfully",
    };
  }

  throw new ApiError(
    400,
    "Rental cannot be cancelled at this stage"
  );
};

export const deleteRentalService = async (rentalId, userId) => {
  const rental = await getRentalById(rentalId);

  if (rental?.status !== "cancelled" && rental?.status !== "terminated")
    throw new ApiError(404, "Only cancelled or terminated rentals can be deleted");

  if (rental.owner_id !== userId)
    throw new ApiError(403, "Unauthorized to delete this rental");

  const deleted = await deleteRental(rentalId);

  if (!deleted)
    throw new ApiError(404, "Rental not found");

  return { message: "Rental deleted successfully" };
}

export const renewRentalService = async ({
  rentalId,
  start_date,
  end_date,
  idempotency_key,
  paymentMode = "auto",
}) => {

  if (!rentalId || !start_date || !end_date || !idempotency_key)
    throw new ApiError(400, "Required fields missing");

  const existingPayment = await getPaymentByIdempotencyKey(idempotency_key);

  if (existingPayment) {
    return {
      rental_status:
        existingPayment.payment_status === "success"
          ? "active"
          : "pending",
      payment: existingPayment,
    };
  }

  const rental = await getRentalById(rentalId);
  if (!rental)
    throw new ApiError(404, "Rental not found");

  if (rental.status !== "terminated")
    throw new ApiError(400, "Only terminated rentals can be renewed");

  const tenant = await getUserById(rental.tenant_id);
  const owner = await getUserById(rental.owner_id);
  const property = await getPropertyById(rental.property_id);

  const client = await pool.connect();

  let payment;

  try {
    await client.query("BEGIN");

    payment = await createPayment(
      {
        agreement_id: rentalId,
        tenant_id: rental.tenant_id,
        owner_id: rental.owner_id,
        amount: property.security_deposit,
        payment_status: "pending",
        idempotency_key,
      },
      client
    );

    await client.query("COMMIT");

    await sendMail({
      to: tenant.email,
      subject: "Payment Initiated - Dwellio",
      html: paymentCreatedTemplate(property.security_deposit),
    });

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  const gatewayResponse = await processDummyPayment({
    amount: property.security_deposit,
    mode: paymentMode,
  });

  const updateClient = await pool.connect();

  try {
    await updateClient.query("BEGIN");

    if (!gatewayResponse || gatewayResponse.status !== "success") {

      await updatePaymentStatus(
        payment.id,
        "failed",
        null,
        updateClient
      );

      await updateClient.query("COMMIT");

      await sendMail({
        to: tenant.email,
        subject: "Payment Failed - Dwellio",
        html: paymentFailedTemplate(property.security_deposit),
      });

      return {
        rental_status: "terminated",
        payment_status: "failed",
      };
    }

    await updatePaymentStatus(
      payment.id,
      "success",
      gatewayResponse.transaction_id,
      updateClient
    );

    const lockedProperty = await getPropertyById(
      rental.property_id,
      updateClient,
      true
    );

    if (lockedProperty.available_rooms <= 0)
      throw new ApiError(400, "No rooms available");

    await renewRentalDatesAndStatus(
      rentalId,
      start_date,
      end_date,
      "active",
      updateClient
    );

    const updatedRooms = lockedProperty.available_rooms - 1;

    await updatePropertyAvailability(
      lockedProperty.id,
      updatedRooms,
      updatedRooms > 0,
      updateClient
    );

    await updateClient.query("COMMIT");

    await sendMail({
      to: tenant.email,
      subject: "Payment Successful - Dwellio",
      html: paymentSuccessTemplate(property.security_deposit),
    });

    await sendMail({
      to: owner.email,
      subject: "Payment Received - Dwellio",
      html: ownerPaymentReceivedTemplate(
        tenant.full_name,
        property.security_deposit
      ),
    });

    await sendMail({
      to: tenant.email,
      subject: "Rental Renewed Successfully - Dwellio",
      html: rentalRenewedTemplate(),
    });

    await sendMail({
      to: owner.email,
      subject: "Rental Renewed - Dwellio",
      html: ownerRentalRenewedTemplate(property.title),
    });

    return {
      rental_status: "active",
      transaction_id: gatewayResponse.transaction_id,
    };

  } catch (error) {

    await updateClient.query("ROLLBACK");

    if (gatewayResponse?.status === "success") {

      await processDummyRefund({
        transaction_id: gatewayResponse.transaction_id,
      });

      await updatePaymentStatus(payment.id, "refunded");

      await sendMail({
        to: tenant.email,
        subject: "Refund Processed - Dwellio",
        html: refundTemplate(property.security_deposit),
      });
    }

    throw new ApiError(
      500,
      "Rental renewal failed. Refund initiated."
    );

  } finally {
    updateClient.release();
  }
};