import {
  getUserById,
  getUserByEmail,
  updateUser,
  updateProfileImage,
  updateRefreshToken,
  updateUserPassword,
} from "../models/user.model.js";

import { hashPassword, comparePassword } from "../utils/hash.js";
import { verifyAccessToken } from "../utils/token.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import sendMail from "./mail.service.js";
import { ApiError } from "../utils/apiError.js";



export const getProfile = async (userId) => {
  const user = await getUserById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};



export const updateProfileDetails = async ({
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

  sendMail({
    to: existingUser.email,
    subject: "Profile Updated - Rentora",
    html: `<p>Hello ${updatedUser.full_name}, your profile details were updated.</p>`,
  });

  return updatedUser;
};



export const updateUserProfileImage = async ({ userId, file }) => {
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



export const changePassword = async ({
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

  sendMail({
    to: user.email,
    subject: "Password Changed - Rentora",
    html: `<p>Hello ${user.full_name}, your password has been changed successfully.</p>`,
  });

  return { message: "Password updated successfully" };
};



export const forgotPassword = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) throw new ApiError(404, "User not found");

  const resetToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  sendMail({
    to: user.email,
    subject: "Password Reset - Rentora",
    html: `<p>Click below to reset password:</p>
           <p>http://yourfrontend.com/reset-password?token=${resetToken}</p>`,
  });

  return { message: "Password reset email sent" };
};



export const resetPassword = async ({
  token,
  newPassword,
}) => {
  if (!newPassword)
    throw new ApiError(400, "New password is required");

  const decoded = verifyAccessToken(token);

  const user = await getUserById(decoded.id);
  if (!user) throw new ApiError(404, "User not found");

  const newHashed = await hashPassword(newPassword);

  await updateUserPassword(user.id, newHashed);

  await updateRefreshToken(user.id, null);

  sendMail({
    to: user.email,
    subject: "Password Reset Successful - Rentora",
    html: `<p>Hello ${user.full_name}, your password has been reset successfully.</p>`,
  });

  return { message: "Password reset successfully" };
};