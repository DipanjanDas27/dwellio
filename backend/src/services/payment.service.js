import {
  createPayment,
  getPaymentsByTenant,
  getPaymentsByOwner,
  updatePaymentStatus,
  deletePayment,
  getPaymentById,
  getPaymentByTransactionId,
  getPaymentsByAgreementId,
  getPaymentByIdempotencyKey
} from "../models/payment.model.js";

import { getUserById } from "../models/user.model.js";
import { getRentalById, updateRentalAfterPayment } from "../models/rental.model.js"
import { processDummyPayment, processDummyRefund } from "./dummyGateway.service.js"
import sendMail from "./mail.service.js";
import { ApiError } from "../utils/apiError.js";
import { paymentCreatedTemplate, paymentFailedTemplate, paymentSuccessTemplate, refundTemplate, ownerPaymentReceivedTemplate } from "../templates/paymentMail.template.js";

export const createPaymentService = async ({
  agreement_id,
  tenant_id,
  owner_id,
  amount,
  idempotency_key,
}) => {
  let payment
  let gatewayResponse
  let gatewaySuccess = false

  const existingPayment = await getPaymentByIdempotencyKey(idempotency_key)
  if (existingPayment) return existingPayment

  const tenant = await getUserById(tenant_id)
  if (!tenant) throw new ApiError(404, "Tenant not found")

  const owner = await getUserById(owner_id)
  if (!owner) throw new ApiError(404, "Owner not found")

  const rental = await getRentalById(agreement_id)
  if (!rental) throw new ApiError(404, "Rental not found")

  if (rental.status === "cancelled")
    throw new ApiError(400, "Payment not allowed for this rental status")

  // ── case 1: pending rental — retry failed security deposit ────────
  if (rental.status === "pending") {
    const agreementPayments = await getPaymentsByAgreementId(agreement_id)

    const failedSecurityPayment = agreementPayments.find(
      p => p.payment_type === "security" && p.payment_status === "failed"
    )

    if (failedSecurityPayment) {
      payment = failedSecurityPayment
    } else {
      payment = await createPayment({
        agreement_id,
        tenant_id,
        owner_id,
        amount,
        payment_status: "pending",
        payment_type: "security",
        idempotency_key,
      })
    }
  }
  // ── case 2: active rental — check for cron-created monthly payment ─
  else {
    const now = new Date()
    const monthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    const cronIdempotencyKey = `monthly-${agreement_id}-${monthYear}`

    const existingMonthlyPayment = await getPaymentByIdempotencyKey(cronIdempotencyKey)

    if (
      existingMonthlyPayment &&
      (existingMonthlyPayment.payment_status === "pending" ||
        existingMonthlyPayment.payment_status === "failed")
    ) {
      await updatePaymentStatus(existingMonthlyPayment.id, "pending", null)
      payment = { ...existingMonthlyPayment, payment_status: "pending" }
    } else {
      payment = await createPayment({
        agreement_id,
        tenant_id,
        owner_id,
        amount,
        payment_status: "pending",
        payment_type: "monthly",
        idempotency_key,
      })
    }
  }

  await sendMail({
    to: tenant.email,
    subject: "Payment Initiated - Dwellio",
    html: paymentCreatedTemplate(amount),
  })

  try {
    gatewayResponse = await processDummyPayment({ amount, mode: "auto" })

    if (!gatewayResponse || gatewayResponse.status !== "success") {
      const failed = await updatePaymentStatus(payment.id, "failed", null)
      await sendMail({ to: tenant.email, subject: "Payment Failed - Dwellio", html: paymentFailedTemplate(amount) })
      return failed
    }

    gatewaySuccess = true


    const result = await updatePaymentStatus(
      payment.id,
      "success",
      gatewayResponse.transaction_id
    )


    if (rental.status === "pending") {
      await updateRentalAfterPayment(agreement_id)
    }

    await sendMail({ to: tenant.email, subject: "Payment Successful - Dwellio", html: paymentSuccessTemplate(amount) })
    await sendMail({ to: owner.email, subject: "Payment Received - Dwellio", html: ownerPaymentReceivedTemplate(tenant.full_name, amount) })

    return result

  } catch (error) {
    console.error("createPaymentService error:", error.message)

    if (gatewaySuccess && gatewayResponse?.transaction_id) {
      await processDummyRefund({ transaction_id: gatewayResponse.transaction_id })
      if (payment?.id) {
        await updatePaymentStatus(payment.id, "refunded", gatewayResponse.transaction_id)
      }
      await sendMail({ to: tenant.email, subject: "Refund Processed - Dwellio", html: refundTemplate(amount) })
    }

    throw new ApiError(500, "Payment processing failed. Refund initiated if applicable.")
  }
}

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

export const getPaymentByIdService = async (paymentId, userId) => {
  const payment = await getPaymentById(paymentId);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (
    payment.tenant_id !== userId &&
    payment.owner_id !== userId
  ) {
    throw new ApiError(403, "Forbidden: Access denied");
  }

  return payment;
};

export const getPaymentsByAgreementService = async (agreementId, userId) => {
  if (!agreementId) throw new ApiError(400, "Agreement ID required")

  const payments = await getPaymentsByAgreementId(agreementId)

  if (!payments.length) return []

  const first = payments[0]
  if (
    String(first.tenant_id) !== String(userId) &&
    String(first.owner_id) !== String(userId)
  ) {
    throw new ApiError(403, "Forbidden: Access denied")
  }

  return payments
}

export const getPaymentByTransactionIdService = async (transactionId, userId) => {
  const payment = await getPaymentByTransactionId(transactionId);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  if (
    payment.tenant_id !== userId &&
    payment.owner_id !== userId
  ) {
    throw new ApiError(403, "Forbidden: Access denied");
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