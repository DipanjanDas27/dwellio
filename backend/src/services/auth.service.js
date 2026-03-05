import {
  createUser,
  getUserByEmail,
  getUserById,
  updateRefreshToken,
} from "../models/user.model.js";

import { hashPassword, comparePassword } from "../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";

import { uploadOnCloudinary } from "../config/cloudinary.js";
import sendMail from "./mail.service.js";
import { ApiError } from "../utils/apiError.js";
import { registerTemplate, loginTemplate } from "../templates/authMail.template.js";

export const registerUser = async ({
  full_name,
  email,
  phone,
  password,
  role,
  file,
}) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  const password_hash = await hashPassword(password);

  let profile_image_url = null;

  if (file && file?.path) {
    const uploadResult = await uploadOnCloudinary(
      file.path,
      "dwellio/profile-images"
    );
    profile_image_url = uploadResult.secure_url;
  }

  const user = await createUser({
    full_name,
    email,
    phone,
    password_hash,
    role,
    profile_image_url,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await updateRefreshToken(user.id, refreshToken);

  await sendMail({
    to: user.email,
    subject: "Welcome to Dwellio",
    html: registerTemplate(user.full_name),
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await updateRefreshToken(user.id, refreshToken);

  await sendMail({
    to: user.email,
    subject: "New Login to Your Dwellio Account",
    html: loginTemplate(),
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const decoded = verifyRefreshToken(incomingRefreshToken);

  const user = await getUserById(decoded.id);
  
  if (!user || !user.refresh_token_hash) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (user.refresh_token_hash !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);

  await updateRefreshToken(user.id, newRefreshToken);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (userId) => {
  if (!userId) {
    throw new ApiError(400, "User id required");
  }

  await updateRefreshToken(userId, null);

  return { message: "Logged out successfully" };
};