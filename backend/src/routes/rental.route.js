import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { strictLimiter } from "../middlewares/rateLimiter.js";

import {
  createRental,
  getTenantRentals,
  getOwnerRentals,
  getRentalById,
  cancelRental,
  terminateRental,
  renewRental,
  bulkTerminateExpiredRentals,
  deleteRental,
} from "../controllers/rental.controller.js";

const router = express.Router();

router.post("/:propertyId", verifyAuth, requireRole("tenant"), strictLimiter, upload.single("agreement"), createRental);
router.get("/tenant/me", verifyAuth, requireRole("tenant"), getTenantRentals);
router.get("/owner/me", verifyAuth, requireRole("owner"), getOwnerRentals);
router.get("/:rentalId", verifyAuth, requireRole("tenant", "owner"), getRentalById);
router.patch("/:rentalId/cancel", verifyAuth, requireRole("tenant"), strictLimiter, cancelRental);
router.patch("/:rentalId/terminate", verifyAuth, requireRole("owner"), strictLimiter, terminateRental);
router.patch("/:rentalId/renew", verifyAuth, requireRole("tenant"), strictLimiter, renewRental);
router.post("/bulk/terminate-expired", verifyAuth, requireRole("owner"), bulkTerminateExpiredRentals);
router.delete("/:rentalId", verifyAuth, requireRole("owner"), deleteRental);

export default router;