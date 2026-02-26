import {
  createPayment,
  getPaymentsByTenant,
  getPaymentsByOwner,
  updatePaymentStatus,
  deletePayment,
  getPaymentById,
  getPaymentByTransactionId,
} from "../models/payment.model.js";

import { getUserById } from "../models/user.model.js";
import sendMail from "./mail.service.js";
import { ApiError } from "../utils/apiError.js";

export const createPaymentService = async ({
  agreement_id,
  tenant_id,
  owner_id,
  amount,
  idempotency_key,
  gatewayResponse,
}, db = pool) => {

  const tenant = await getUserById(tenant_id, db);
  if (!tenant) throw new ApiError(404, "Tenant not found");

  const owner = await getUserById(owner_id, db);
  if (!owner) throw new ApiError(404, "Owner not found");

  if (tenant.role !== "tenant")
    throw new ApiError(403, "Only tenants can make payments");

  const payment = await createPayment({
    agreement_id,
    tenant_id,
    owner_id,
    amount,
    payment_status: "pending",
    idempotency_key,
  }, db);

  if (!gatewayResponse) {
    return await updatePaymentStatus(
      payment.id,
      "failed",
      null,
      db
    );
  }

  if (gatewayResponse.status === "success") {
    const result = await updatePaymentStatus(
      payment.id,
      "success",
      gatewayResponse.transaction_id,
      db
    );
    if (!result) throw new ApiError(500, "Failed to update payment status");
    sendMail({
      to: tenant.email,
      subject: "Payment Successful - Dwellio",
      html: `<p>Your payment of ₹${amount} has been received successfully.</p>`,
    });
    
    sendMail({
      to: owner.email,
      subject: "Payment Received - Dwellio",
      html: `<p>You have received a payment of ₹${amount} from ${tenant.full_name}.</p>`,
    });
    return result;
  }

  return await updatePaymentStatus(
    payment.id,
    "failed",
    gatewayResponse.transaction_id || null,
    db
  );
};

export const getTenantPaymentsService = async (tenantId) => {
  const tenant = await getUserById(tenantId);
  if (!tenant) throw new ApiError(404, "Tenant not found");

  const result = await getPaymentsByTenant(tenantId);
  if (!result || result.length === 0)
    throw new ApiError(404, "No payments found for this tenant");
  return result;
};

export const getOwnerPaymentsService = async (ownerId) => {
  const owner = await getUserById(ownerId);
  if (!owner) throw new ApiError(404, "Owner not found");

  const result = await getPaymentsByOwner(ownerId);
  if (!result || result.length === 0)
    throw new ApiError(404, "No payments found for this owner");
  return result;
};

export const getPaymentByIdService = async (paymentId) => {
  const payment = await getPaymentById(paymentId);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return payment;
};

export const getPaymentByTransactionIdService = async (transactionId) => {
  const payment = await getPaymentByTransactionId(transactionId);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return payment;
};

export const deletePaymentService = async (paymentId) => {
  const payment = await getPaymentById(paymentId);
  if (!payment) throw new ApiError(404, "Payment not found");
  if (payment.payment_status !== "failed")
    throw new ApiError(400, "Only failed payments can be deleted");

  const deleted = await deletePayment(paymentId);

  if (!deleted) throw new ApiError(404, "Payment not found");

  return { message: "Payment deleted successfully" };
};