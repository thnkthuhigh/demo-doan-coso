// models/ClassRegistration.js
import mongoose from "mongoose";

const ClassRegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // hoặc ref 'users' tùy theo collection
      required: true,
    },
    scheduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule", // lịch tập
      required: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // thêm createdAt, updatedAt
  }
);

const ClassRegistration = mongoose.model(
  "ClassRegistration",
  ClassRegistrationSchema
);
export default ClassRegistration;
