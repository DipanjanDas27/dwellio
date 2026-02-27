import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

import {
  sendOtpService,
  verifyOtpService,
  sendForgotPasswordOtpService,
  verifyForgotPasswordOtpService,
} from "../services/otp.service.js";

export const sendOtp = asyncHandler(async (req, res) => {

  await sendOtpService(req.user);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "OTP sent successfully"
      )
    );
});

export const verifyOtp = asyncHandler(async (req, res) => {

  const { otp } = req.body;

  if (!otp)
    throw new ApiError(400, "OTP is required");

  await verifyOtpService(req.user, otp);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "OTP verified successfully"
      )
    );
});

export const sendForgotPasswordOtp = asyncHandler(async (req, res) => {

  const { email } = req.body;

  if (!email)
    throw new ApiError(400, "Email is required");

  const resetToken = await sendForgotPasswordOtpService(email);

  return res
    .status(200)
    .cookie("tempToken", resetToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 5 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        200,
        {},
        "OTP sent successfully"
      )
    );
});

export const verifyForgotPasswordOtp = asyncHandler(async (req, res) => {

  const { otp } = req.body;

  if (!otp)
    throw new ApiError(400, "OTP is required");

  const token =
    req.cookies?.tempToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    throw new ApiError(401, "Reset token missing");

  await verifyForgotPasswordOtpService(token, otp);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "OTP verified successfully"
      )
    );
});