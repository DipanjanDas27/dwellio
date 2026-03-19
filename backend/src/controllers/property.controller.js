import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import {
  createPropertyService,
  getPropertyService,
  getOwnerPropertiesService,
  getFilteredPropertiesService,
  updatePropertyService,
  updatePropertyImageService,
  deletePropertyService,
} from "../services/property.service.js";

export const createProperty = asyncHandler(async (req, res) => {

  const {
    title,
    description,
    bhk,
    furnishing,
    address,
    city,
    state,
    pincode,
    rent_amount,
    notice_period_days,
    security_deposit,
    total_rooms,
    available_rooms,
    is_shared,
    max_tenants,
  } = req.body;

  if (
    !title ||
    !description ||
    !bhk ||
    !furnishing ||
    !address ||
    !city ||
    !state ||
    !pincode ||
    rent_amount === undefined ||
    security_deposit === undefined ||
    notice_period_days === undefined ||
    total_rooms === undefined ||
    available_rooms === undefined
  ) {
    throw new ApiError(400, "Required fields missing");
  }

  if (Number(rent_amount) <= 0)
    throw new ApiError(400, "Rent amount must be greater than 0");

  if (Number(security_deposit) < 0)
    throw new ApiError(400, "Security deposit cannot be negative");

  if (Number(notice_period_days) < 0)
    throw new ApiError(400, "Notice Period cannot be negative");

  if (Number(total_rooms) <= 0)
    throw new ApiError(400, "Total rooms must be greater than 0");

  if (Number(available_rooms) < 0)
    throw new ApiError(400, "Available rooms cannot be negative");

  if (Number(available_rooms) > Number(total_rooms))
    throw new ApiError(400, "Available rooms cannot exceed total rooms");

  const property = await createPropertyService({
    ownerId: req.user.id,
    propertyData: {
      title,
      description,
      bhk,
      furnishing,
      address,
      city,
      state,
      pincode,
      rent_amount: Number(rent_amount),
      notice_period_days: Number(notice_period_days),
      security_deposit: Number(security_deposit),
      total_rooms: Number(total_rooms),
      available_rooms: Number(available_rooms),
      is_available: Number(available_rooms) > 0,
      is_shared: is_shared === true || is_shared === "true" || false,
      max_tenants: max_tenants ? Number(max_tenants) : 1,
      current_tenants: 0,
    },
    file: req.file,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        property,
        "Property created successfully"
      )
    );
});

export const getProperty = asyncHandler(async (req, res) => {

  const { propertyId } = req.params;

  if (!propertyId)
    throw new ApiError(400, "Property id required");

  const property = await getPropertyService(propertyId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        property,
        "Property fetched successfully"
      )
    );
});

export const getOwnerProperties = asyncHandler(async (req, res) => {

  const properties = await getOwnerPropertiesService(
    req.user.id
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        properties,
        "Owner properties fetched successfully"
      )
    );
});

export const getFilteredProperties = asyncHandler(async (req, res) => {

  const { minPrice, maxPrice, search } = req.query;

  const properties = await getFilteredPropertiesService({
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    search,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        properties,
        "Filtered properties fetched successfully"
      )
    );
});
export const updateProperty = asyncHandler(async (req, res) => {

  const { propertyId } = req.params;

  if (!propertyId)
    throw new ApiError(400, "Property id required");

  const updated = await updatePropertyService({
    propertyId,
    ownerId: req.user.id,
    updateData: req.body,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updated,
        "Property updated successfully"
      )
    );
});

export const updatePropertyImage = asyncHandler(async (req, res) => {

  const { propertyId } = req.params;
  const file = req.file;

  if (!propertyId)
    throw new ApiError(400, "Property id required");

  const updated = await updatePropertyImageService({
    propertyId,
    ownerId: req.user.id,
    file,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updated,
        "Property image updated successfully"
      )
    );
});

export const deleteProperty = asyncHandler(async (req, res) => {

  const { propertyId } = req.params;

  if (!propertyId)
    throw new ApiError(400, "Property id required");

  const result = await deletePropertyService({
    propertyId,
    ownerId: req.user.id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Property deleted successfully"
      )
    );
});