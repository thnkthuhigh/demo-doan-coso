import express from "express";
import {
  registerClass,
  getRegistrationsByUser,
  deleteRegistration,
} from "../controllers/registrationController.js";

const router = express.Router();
router.post("/", registerClass);
router.get("/user/:userId", getRegistrationsByUser);
router.delete("/:id", deleteRegistration);
export default router;
