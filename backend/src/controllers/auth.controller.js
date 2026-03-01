import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../services/auth.service.js";

const accessOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000,
};

const refreshOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 20 * 24 * 60 * 60 * 1000,
};

export const register = asyncHandler(async (req, res) => {

  const {
    full_name,
    email,
    phone,
    password,
    role,
  } = req.body;
  if([full_name, email, phone, password, role].some((field) => !field || field?.trim() === ""))
    throw new ApiError(400, "All fields are required");

  const file = req.file;

  const result = await registerUser({
    full_name,
    email,
    phone,
    password,
    role,
    file,
  });

  return res
    .status(201)
    .cookie("accessToken", result.accessToken, accessOptions)
    .cookie("refreshToken", result.refreshToken, refreshOptions)
    .json(
      new ApiResponse(
        201,
        result.user,
        "User registered successfully"
      )
    );
});

export const login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password)
    throw new ApiError(400, "Email and password required");

  const result = await loginUser({ email, password });

  return res
    .status(200)
    .cookie("accessToken", result.accessToken, accessOptions)
    .cookie("refreshToken", result.refreshToken, refreshOptions)
    .json(
      new ApiResponse(200, {}, "Login successful")
    );
});

export const refreshToken = asyncHandler(async (req, res) => {

  const token =
    req.cookies?.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    throw new ApiError(401, "Refresh token missing");

  const result = await refreshAccessToken(token);

  return res
    .status(200)
    .cookie("accessToken", result.accessToken, accessOptions)
    .cookie("refreshToken", result.refreshToken, refreshOptions)
    .json(
      new ApiResponse(200, {}, "Token refreshed successfully")
    );
});

export const logout = asyncHandler(async (req, res) => {

  await logoutUser(req.user.id);

  return res
    .status(200)
    .clearCookie("accessToken", accessOptions)
    .clearCookie("refreshToken", refreshOptions)
    .json(
      new ApiResponse(200, {}, "Logged out successfully")
    );
});