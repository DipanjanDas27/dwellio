import {
  createProperty,
  getPropertyById,
  getPropertiesByOwner,
  getPropertiesByFilter,
  updateProperty,
  updatePropertyImage,
  deleteProperty,
} from "../models/property.model.js";

import { getUserById } from "../models/user.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import sendMail from "./mail.service.js";
import { ApiError } from "../utils/apiError.js";
import { propertyCreatedTemplate } from "../templates/propertyMail.template.js"


export const createPropertyService = async ({
  ownerId,
  propertyData,
  file,
}) => {
  const owner = await getUserById(ownerId);
  if (!owner) throw new ApiError(404, "Owner not found");

  if (owner.role !== "owner")
    throw new ApiError(403, "Only owners can create properties");

  let image_url = null;

  if (file && file.path) {
    const uploadResult = await uploadOnCloudinary(
      file.path,
      "dwellio/properties"
    );
    image_url = uploadResult.secure_url;
  }

  const property = await createProperty({
    ...propertyData,
    owner_id: ownerId,
    image_url,
  });

  if (!property) throw new ApiError(500, "Failed to create property");

  await sendMail({
    to: owner.email,
    subject: "Property Listed - Dwellio",
    html: propertyCreatedTemplate(property.title),
  });

  return property;
};


export const getPropertyService = async (propertyId) => {
  const property = await getPropertyById(propertyId);
  if (!property) throw new ApiError(404, "Property not found");
  return property;
};


export const getOwnerPropertiesService = async (ownerId) => {
  const owner = await getUserById(ownerId);
  if (!owner) throw new ApiError(404, "Owner not found");

  const result = await getPropertiesByOwner(ownerId);
  if (!result || result.length === 0)
    throw new ApiError(404, "No properties found for this owner");
  return result;
};


export const getFilteredPropertiesService = async ({
  minPrice,
  maxPrice,
  city,
}) => {
  if (!minPrice || !maxPrice || !city)
    throw new ApiError(400, "Price range and city are required");

  const result = await getPropertiesByFilter({
    minPrice,
    maxPrice,
    city,
  });
  if (!result || result.length === 0)
    throw new ApiError(404, "No properties found matching the criteria");
  return result;
};


export const updatePropertyService = async ({
  propertyId,
  ownerId,
  updateData,
}) => {
  const property = await getPropertyById(propertyId);
  if (!property) throw new ApiError(404, "Property not found");

  if (property.owner_id !== ownerId)
    throw new ApiError(403, "Unauthorized to update this property");

  const updated = await updateProperty(propertyId, updateData);
  if (!updated) throw new ApiError(500, "Failed to update property");

  return updated;
};


export const updatePropertyImageService = async ({
  propertyId,
  ownerId,
  file,
}) => {
  const property = await getPropertyById(propertyId);
  if (!property) throw new ApiError(404, "Property not found");

  if (property.owner_id !== ownerId)
    throw new ApiError(403, "Unauthorized to update this property");

  if (!file || !file.path)
    throw new ApiError(400, "Image file is required");

  const uploadResult = await uploadOnCloudinary(
    file.path,
    "dwellio/properties"
  );

  const updated = await updatePropertyImage(
    propertyId,
    uploadResult.secure_url
  );
  if (!updated) throw new ApiError(500, "Failed to update property image");
  return updated;
};


export const deletePropertyService = async ({
  propertyId,
  ownerId,
}) => {
  const property = await getPropertyById(propertyId);
  if (!property) throw new ApiError(404, "Property not found");

  if (property.owner_id !== ownerId)
    throw new ApiError(403, "Unauthorized to delete this property");

  await deleteProperty(propertyId);

  return { message: "Property deleted successfully" };
};