import { verifyAccessToken } from "../utils/token.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { getUserById } from "../models/user.model.js";

export const verifyAuth = asyncHandler(async (req, res, next) => {

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    throw new ApiError(401, "Unauthorized request");

  const decoded = verifyAccessToken(token);

  const user = await getUserById(decoded.id);

  if (!user)
    throw new ApiError(401, "Invalid token");

  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  next();
});