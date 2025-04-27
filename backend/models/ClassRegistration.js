import mongoose from "mongoose";

const classRegistrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
  paymentStatus: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
});

const ClassRegistration =
  mongoose.models.ClassRegistration ||
  mongoose.model("ClassRegistration", classRegistrationSchema);

export default ClassRegistration;
