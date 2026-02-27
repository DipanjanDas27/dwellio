import sendMail from "./mail.service.js";
import generateOtp from "../utils/otpGenerator.js";

import { redisClient } from "../config/redis.js";
import { getUserByEmail } from "../models/user.model.js";

import { generateResetToken, verifyResetToken } from "../utils/token.js";
import { ApiError } from "../utils/apiError.js";

export const sendOtpService = async (user) => {
    if (!user?.email) {
        throw new ApiError(400, "User not authenticated");
    }

    const otp = generateOtp();

    await redisClient.set(
        `otp:${user.email}`,
        otp,
        { EX: 120 }
    );

    await sendMail({
        to: user.email,
        subject: "Dwellio OTP Verification",
        html: `<h3>Your OTP is: ${otp}</h3>`,
    });

    return true;
};

export const verifyOtpService = async (user, otp) => {
    if (!user) throw new ApiError(400, "User not authenticated");
    if (!otp) throw new ApiError(400, "OTP is required");

    const storedOtp = await redisClient.get(
        `otp:${user.email}`
    );

    if (!storedOtp)
        throw new ApiError(404, "OTP expired");

    if (storedOtp !== otp)
        throw new ApiError(401, "Invalid OTP");

    await redisClient.del(`otp:${user.email}`);

    return true;
};

export const sendForgotPasswordOtpService = async (email) => {
    if (!email)
        throw new ApiError(400, "Email is required");

    const user = await getUserByEmail(email);

    if (!user)
        throw new ApiError(404, "User not found");

    const otp = generateOtp();

    await redisClient.set(
        `otp:${email}`,
        otp,
        { EX: 120 }
    );

    const resetToken = generateResetToken(user);
    
    await sendMail({
        to: email,
        subject: "Dwellio Password Reset OTP",
        html: `<h3>Your OTP is: ${otp}</h3>`,
    });

    return resetToken;
};

export const verifyForgotPasswordOtpService = async (
    token,
    otp
) => {
    if (!otp)
        throw new ApiError(400, "OTP is required");
    if (!token)        
        throw new ApiError(400, "Reset token is required");
    
    const decoded = verifyResetToken(token);

    if (decoded.purpose !== "password_reset")
        throw new ApiError(401, "Invalid token");

    const user = await getUserByEmail(decoded.email);

    const storedOtp = await redisClient.get(
        `otp:${user.email}`
    );

    if (!storedOtp || storedOtp !== otp)
        throw new ApiError(401, "Invalid or expired OTP");

    await redisClient.del(`otp:${user.email}`);

    return true;
};