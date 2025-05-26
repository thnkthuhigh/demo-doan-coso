import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    sessionNumber: {
      type: Number,
      required: true,
    },
    sessionDate: {
      type: Date,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    attendees: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        enrollment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ClassEnrollment",
        },
        attendedAt: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
    totalPresent: {
      type: Number,
      default: 0,
    },
    totalEnrolled: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ class: 1, sessionNumber: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
