import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import {
  createRentalService,
  getTenantRentalsService,
  getOwnerRentalsService,
  getRentalByIdService,
  updateRentalStatusService,
  deleteRentalService,
  terminateRentalService,
} from "../services/rental.service.js";

export const createRental = asyncHandler(async (req, res) => {

  const {
    property_id,
    start_date,
    end_date,
    notice_period,
    monthly_rent,
    idempotency_key,
    paymentMode,
  } = req.body;

  if (
    !property_id ||
    !start_date ||
    !end_date ||
    monthly_rent === undefined ||
    !idempotency_key
  ) {
    throw new ApiError(400, "Required fields missing");
  }

  const rental = await createRentalService({
    property_id,
    tenant_id: req.user.id,
    start_date,
    end_date,
    notice_period,
    monthly_rent: Number(monthly_rent),
    file: req.file,
    idempotency_key,
    paymentMode,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        rental,
        "Rental processed successfully"
      )
    );
});

export const getTenantRentals = asyncHandler(async (req, res) => {

  const rentals = await getTenantRentalsService(
    req.user.id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        rentals,
        "Tenant rentals fetched successfully"
      )
    );
});

export const getOwnerRentals = asyncHandler(async (req, res) => {

  const rentals = await getOwnerRentalsService(
    req.user.id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        rentals,
        "Owner rentals fetched successfully"
      )
    );
});

export const getRentalById = asyncHandler(async (req, res) => {

  const { rentalId } = req.params;

  if (!rentalId)
    throw new ApiError(400, "Rental id required");

  const rental = await getRentalByIdService(
    rentalId
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        rental,
        "Rental fetched successfully"
      )
    );
});

export const updateRentalStatus = asyncHandler(async (req, res) => {

  const { rentalId } = req.params;
  const { status } = req.body;

  if (!rentalId || !status)
    throw new ApiError(400, "Rental id and status required");

  const updated = await updateRentalStatusService({
    rentalId,
    ownerId: req.user.id,
    status,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updated,
        "Rental status updated successfully"
      )
    );
});

export const deleteRental = asyncHandler(async (req, res) => {

  const { rentalId } = req.params;

  if (!rentalId)
    throw new ApiError(400, "Rental id required");

  const result = await deleteRentalService({
    rentalId,
    userId: req.user.id,
  });

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

export const terminateRental = asyncHandler(async (req, res) => {

  const { rentalId } = req.params;

  if (!rentalId)
    throw new ApiError(400, "Rental id required");

  const result = await terminateRentalService({
    rentalId,
  });

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