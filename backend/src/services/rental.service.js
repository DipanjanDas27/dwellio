import {
  createRental,
  getRentalsByTenant,
  getRentalsByOwner,
  updateRentalStatus,
  deleteRental,
  getRentalById,
  updateRentalAfterPayment,
} from "../models/rental.model.js";

import { pool } from "../config/db.js";
import { getUserById } from "../models/user.model.js";
import { getPropertyById, updatePropertyAvailability, } from "../models/property.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import sendMail from "./mail.service.js";
import { ApiError } from "../utils/apiError.js";
import { createPaymentService } from "./payment.service.js";
import { getPaymentByIdempotencyKey } from "../models/payment.model.js";
import { processDummyPayment, processDummyRefund } from "./dummyGateway.service.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

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

  const existingPayment = await getPaymentByIdempotencyKey(
    idempotency_key
  );

  if (existingPayment) {
    return {
      rental_status:
        existingPayment.payment_status === "success"
          ? "active"
          : "failed",
      payment: existingPayment,
    };
  }

  const tenant = await getUserById(tenant_id);
  if (!tenant) throw new ApiError(404, "Tenant not found");
  if (tenant.role !== "tenant")
    throw new ApiError(403, "Only tenants can create rental");

  const property = await getPropertyById(property_id);
  if (!property) throw new ApiError(404, "Property not found");

  const gatewayResponse = await processDummyPayment({
    amount: property.security_deposit,
    mode: paymentMode,
  });

  if (gatewayResponse?.status !== "success") {
    return {
      payment_status: "failed",
      reason: gatewayResponse?.reason || "Payment failed",
    };
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const lockedProperty = await getPropertyById(
      property_id,
      client,
      true
    );

    if (lockedProperty?.available_rooms <= 0)
      throw new ApiError(400, "No rooms available");

    let agreement_document_url = null;

    if (file?.path) {
      const upload = await uploadOnCloudinary(
        file.path,
        "dwellio/rental-agreements"
      );
      agreement_document_url = upload.secure_url;
    }

    const rental = await createRental(
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

    const payment = await createPaymentService(
      {
        agreement_id: rental.id,
        tenant_id,
        owner_id: lockedProperty.owner_id,
        amount: lockedProperty.security_deposit,
        idempotency_key,
        gatewayResponse,
      },
      client
    );

    if (payment?.payment_status !== "success") {
      await client.query("COMMIT");
      return { rental, payment_status: "failed" };
    }

    await updateRentalAfterPayment(rental.id, client);

    const updatedRooms = lockedProperty?.available_rooms - 1;

    await updatePropertyAvailability(
      lockedProperty.id,
      updatedRooms,
      updatedRooms > 0,
      client
    );

    await client.query("COMMIT");

    sendMail({
      to: tenant.email,
      subject: "Rental Activated - Dwellio",
      html: `<p>Your rental has been activated successfully.</p>`,
    });

    return {
      rental_status: "active",
      rental,
      payment,
      transaction_id: gatewayResponse.transaction_id,
    };

  } catch (error) {

    await client.query("ROLLBACK");

    await processDummyRefund({
      transaction_id: gatewayResponse.transaction_id,
    });

    throw new ApiError(
      500,
      "Rental failed after payment. Refund initiated."
    );

  } finally {
    client.release();
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

  return rental;
};

export const updateRentalStatusService = async ({
  rentalId,
  ownerId,
  status,
}) => {
  const rental = await getRentalById(rentalId);

  if (!rental) {
    throw new ApiError(404, "Rental agreement not found");
  }

  if (rental.owner_id !== ownerId) {
    throw new ApiError(403, "Unauthorized to update this rental");
  }

  const allowedStatuses = ["pending", "active", "terminated", "cancelled"];
  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid rental status");
  }

  const updatedRental = await updateRentalStatus(rentalId, status);

  const tenant = await getUserById(updatedRental.tenant_id);

  sendMail({
    to: tenant.email,
    subject: "Rental Status Updated - Dwellio",
    html: `<p>Your rental agreement status has been updated to <b>${status}</b>.</p>`,
  });

  return updatedRental;
};

export const terminateRentalService = async ({
  rentalId,
}) => {
  const rental = await getRentalById(rentalId);

  if (!rental)
    throw new ApiError(404, "Rental not found");

  const today = new Date().toISOString().split("T")[0];

  if (rental.status !== "terminated" && rental.end_date < today) {
    await updateRentalStatus(rentalId, "terminated");
  }

  return { message: "Rental terminated successfully" };
};

export const deleteRentalService = async (rentalId,userId) => {
  const rental = await getRentalById(rentalId);

  if (rental?.status !== "cancelled" && rental?.status !== "terminated")
    throw new ApiError(404, "Only cancelled or terminated rentals can be deleted");

  if(rental.owner_id !==  userId)
    throw new ApiError(403, "Unauthorized to delete this rental");

  const deleted = await deleteRental(rentalId);

  if (!deleted)
    throw new ApiError(404, "Rental not found");

  return { message: "Rental deleted successfully" };
}