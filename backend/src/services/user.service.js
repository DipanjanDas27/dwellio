import {
  getUserById,
  updateUser,
  updateProfileImage,
  updateRefreshToken,
  updateUserPassword,
  deleteUser,
} from "../models/user.model.js";

import { hashPassword, comparePassword } from "../utils/hash.js";
import { verifyResetToken } from "../utils/token.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import sendMail from "./mail.service.js";
import { ApiError } from "../utils/apiError.js";
import { passwordUpdatedTemplate, accountDeletedTemplate, passwordResetSuccessTemplate } from "../templates/userMail.template.js";


export const getCurrentUserService = async (userId) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};



export const updateProfileDetailsService = async ({
  userId,
  full_name,
  email,
  phone,
}) => {
  const existingUser = await getUserById(userId);
  if (!existingUser) throw new ApiError(404, "User not found");

  const updatedUser = await updateUser(userId, {
    full_name,
    email,
    phone,
  });

  return updatedUser;
};



export const updateUserProfileImageService = async ({ userId, file }) => {
  const existingUser = await getUserById(userId);
  if (!existingUser) throw new ApiError(404, "User not found");

  if (!file || !file.path)
    throw new ApiError(400, "Profile image file is required");

  const uploadResult = await uploadOnCloudinary(
    file.path,
    "dwellio/profile-images"
  );

  const updated = await updateProfileImage(
    userId,
    uploadResult.secure_url
  );

  return updated;
};



export const changePasswordService = async ({
  userId,
  oldPassword,
  newPassword,
}) => {
  if (!newPassword)
    throw new ApiError(400, "New password is required");

  const user = await getUserById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const isMatch = await comparePassword(
    oldPassword,
    user.password_hash
  );

  if (!isMatch)
    throw new ApiError(401, "Old password is incorrect");

  const newHashed = await hashPassword(newPassword);

  await updateUserPassword(userId, newHashed);

  await sendMail({
    to: user.email,
    subject: "Your Dwellio Password Was Updated",
    html: passwordUpdatedTemplate(),
  });

  return { message: "Password updated successfully" };
};

export const resetPasswordService = async ({
  token,
  newPassword,
}) => {
  if (!newPassword)
    throw new ApiError(400, "New password is required");

  const decoded = verifyResetToken(token);

  const user = await getUserById(decoded.id);
  if (!user) throw new ApiError(404, "User not found");

  const newHashed = await hashPassword(newPassword);

  await updateUserPassword(user.id, newHashed);

  await updateRefreshToken(user.id, null);

  await sendMail({
    to: user.email,
    subject: "Password Reset Successful - Dwellio",
    html: passwordResetSuccessTemplate(),
  });

  return { message: "Password reset successfully" };
};

export const deleteUserService = async (userId) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(404, "User not found");

  await updateRefreshToken(userId, null);

  await deleteUser(userId);
  await sendMail({
    to: user.email,
    subject: "Account Deleted - Dwellio",
    html: accountDeletedTemplate(),
  });
   return { message: "Account deleted successfully" };
};