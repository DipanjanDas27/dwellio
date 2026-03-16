import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { getUserLimiter } from "../middlewares/rateLimiter.js";
import { getCurrentUser, updateProfile, updateProfileImage, deleteAccount, getUserDetails } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", verifyAuth, getCurrentUser);
router.get("/:userId/details", verifyAuth, requireRole("tenant", "owner"), getUserDetails);
router.patch("/me/updateprofile", verifyAuth, updateProfile);
router.patch("/me/image", verifyAuth, upload.single("profileImage"), updateProfileImage);
router.get("/:userId", verifyAuth, requireRole("owner", "tenant"), getUserLimiter, getCurrentUser);
router.delete("/:userId", verifyAuth, deleteAccount);

export default router;