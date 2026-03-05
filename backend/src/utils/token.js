import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};
export const generateResetToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      purpose: "password_reset",
    },
    process.env.RESET_TOKEN_SECRET,
    { expiresIn: process.env.RESET_TOKEN_EXPIRY }
  );
};


export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
export const verifyResetToken = (token) => {
  return jwt.verify(token, process.env.RESET_TOKEN_SECRET);
};