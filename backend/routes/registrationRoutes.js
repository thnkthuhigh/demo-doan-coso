import express from "express";
import {
  registerClass,
  getRegistrationsByUser,
} from "../controllers/registrationController.js";

const router = express.Router();
router.post("/", registerClass);
router.get("/user/:userId", getRegistrationsByUser);
export default router;
