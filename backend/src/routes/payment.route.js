import express from "express";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { strictLimiter } from "../middlewares/rateLimiter.js";

import {
  createPayment,
  getTenantPayments,
  getOwnerPayments,
  getPaymentById,
  getPaymentsByAgreement,
  getPaymentByTransactionId,
  deletePayment,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/", verifyAuth, requireRole("tenant"), strictLimiter, createPayment);
router.get("/tenant/me", verifyAuth, requireRole("tenant"), getTenantPayments);
router.get("/owner/me", verifyAuth, requireRole("owner"), getOwnerPayments);
router.get("/:paymentId", verifyAuth, requireRole("tenant", "owner"), getPaymentById);
router.get("/agreement/:agreementId", verifyAuth, getPaymentsByAgreement)
router.get("/transaction/:transactionId", verifyAuth, requireRole("tenant", "owner"), getPaymentByTransactionId);
router.delete("/:paymentId", verifyAuth, requireRole("tenant"), deletePayment);

export default router;