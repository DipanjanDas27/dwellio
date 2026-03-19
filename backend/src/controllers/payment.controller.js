import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import {
  createPaymentService,
  getTenantPaymentsService,
  getOwnerPaymentsService,
  getPaymentByIdService,
  getPaymentsByAgreementService,
  getPaymentByTransactionIdService,
  deletePaymentService,
} from "../services/payment.service.js";

export const createPayment = asyncHandler(async (req, res) => {

  const {
    agreement_id,
    owner_id,
    amount,
    idempotency_key,
  } = req.body;

  if (
    !agreement_id ||
    !owner_id ||
    amount === undefined ||
    !idempotency_key
  ) {
    throw new ApiError(400, "Required fields missing");
  }

  const payment = await createPaymentService({
    agreement_id,
    tenant_id: req.user.id,
    owner_id,
    amount: Number(amount),
    idempotency_key,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        payment,
        "Payment processed successfully"
      )
    );
});

export const getTenantPayments = asyncHandler(async (req, res) => {

  const payments = await getTenantPaymentsService(
    req.user.id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        payments,
        "Tenant payments fetched successfully"
      )
    );
});

export const getOwnerPayments = asyncHandler(async (req, res) => {

  const payments = await getOwnerPaymentsService(
    req.user.id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        payments,
        "Owner payments fetched successfully"
      )
    );
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const { paymentId } = req.params

  if (!paymentId) throw new ApiError(400, "Payment id required")

  const payment = await getPaymentByIdService(paymentId, req.user.id)

  return res.status(200).json(new ApiResponse(200, payment, "Payment fetched successfully"))
})

export const getPaymentsByAgreement = asyncHandler(async (req, res) => {
  const { agreementId } = req.params

  const payments = await getPaymentsByAgreementService(
    agreementId,
    req.user.id
  )

  return res
    .status(200)
    .json(new ApiResponse(200, payments, "Payments fetched successfully"))
})

export const getPaymentByTransactionId = asyncHandler(async (req, res) => {

  const { transactionId } = req.params;

  if (!transactionId)
    throw new ApiError(400, "Transaction id required");

  const payment = await getPaymentByTransactionIdService(
    transactionId
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        payment,
        "Payment fetched successfully"
      )
    );
});

export const deletePayment = asyncHandler(async (req, res) => {

  const { paymentId } = req.params;

  if (!paymentId)
    throw new ApiError(400, "Payment id required");

  const result = await deletePaymentService(
    paymentId
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        result.message
      )
    );
});