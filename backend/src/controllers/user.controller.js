import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import {
  getCurrentUserService,
  updateProfileDetailsService,
  updateUserProfileImageService,
  changePasswordService,
  resetPasswordService,
  deleteUserService,
} from "../services/user.service.js";

export const getCurrentUser = asyncHandler(async (req, res) => {

  const user = await getCurrentUserService(req.user.id);

  const { password_hash, refresh_token_hash, ...safeUser } = user;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        safeUser,
        "User fetched successfully"
      )
    );
});


export const getUserDetails = asyncHandler(async (req, res) => {

  const { userId } = req.params;

  if (!userId)
    throw new ApiError(400, "User id required");

  const user = await getUserDetailsService(userId);

  const { password_hash, refresh_token_hash, ...safeUser } = user;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        safeUser,
        "User details fetched successfully"
      )
    );
});


export const updateProfile = asyncHandler(async (req, res) => {

  const updatedUser = await updateProfileDetailsService({
    userId: req.user.id,
    ...req.body,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUser,
        "Profile updated successfully"
      )
    );
});

export const updateProfileImage = asyncHandler(async (req, res) => {

  if (!req.file)
    throw new ApiError(400, "Image file required");

  const updatedUser = await updateUserProfileImageService({
    userId: req.user.id,
    file: req.file,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedUser,
        "Profile image updated successfully"
      )
    );
});

export const deleteAccount = asyncHandler(async (req, res) => {

  await deleteUserService(req.user.id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Account deleted successfully"
      )
    );
});

export const changePassword = asyncHandler(async (req, res) => {

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    throw new ApiError(400, "Old password and new password are required");

  const result = await changePasswordService({
    userId: req.user.id,
    oldPassword,
    newPassword,
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

export const resetPassword = asyncHandler(async (req, res) => {

  const { newPassword } = req.body;

  const token =
    req.cookies?.tempToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    throw new ApiError(401, "Reset token missing");

  if (!newPassword)
    throw new ApiError(400, "New password is required");

  const result = await resetPasswordService({
    token,
    newPassword,
  });

  return res
    .status(200)
    .clearCookie("tempToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json(
      new ApiResponse(
        200,
        {},
        result.message
      )
    );
});