import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1300,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
});

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1020,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
});

export const getUserLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1020,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
});