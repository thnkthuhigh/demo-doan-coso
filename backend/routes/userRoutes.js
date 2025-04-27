import express from "express";
import { getUserById } from "../controllers/userController.js"; // Import controller

const router = express.Router();

// Route lấy user theo id
router.get("/:id", getUserById);

export default router;
