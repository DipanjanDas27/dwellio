import bcrypt from "bcrypt";
import {ApiError} from "./apiError.js";

const SALT_ROUNDS = 12; 


export const hashPassword = async (plainPassword) => {
  if (!plainPassword) {
    throw new ApiError(400,"Password is required for hashing");
  }

  const hashed = await bcrypt.hash(plainPassword, SALT_ROUNDS);
  return hashed;
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    throw new ApiError(400,"Both passwords are required for comparison");
  }

  return await bcrypt.compare(plainPassword, hashedPassword);
};