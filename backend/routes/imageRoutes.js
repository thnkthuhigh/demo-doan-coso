import express from "express";
import {
  uploadAvatar,
  getAllImages,
  deleteImage,
  uploadImage,
} from "../controllers/imageController.js";
import { upload } from "../config/cloudinary.js";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// User avatar routes
router.post(
  "/avatar/:userId",
  isAuthenticated,
  upload.single("avatar"),
  uploadAvatar
);

// Admin routes
router.get("/admin/all", isAuthenticated, isAdmin, getAllImages);
router.delete("/admin/:public_id", isAuthenticated, isAdmin, deleteImage);
router.post(
  "/admin/upload",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  uploadImage
);

export default router;
