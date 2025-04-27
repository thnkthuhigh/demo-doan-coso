// routes/registrationRoutes.js
import express from "express";
import {
  registerClass,
  getUserRegistrations,
} from "../controllers/scheduleUserController.js";

const router = express.Router();

// Đăng ký lớp
router.post("/", registerClass);

// Lấy danh sách lớp đã đăng ký
router.get("/:userId", getUserRegistrations);

export default router;
