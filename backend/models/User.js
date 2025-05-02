import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
    },
    password: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^(?:\+84|0)\d{8,10}$/, "Please enter a valid phone number."],
    },
    dob: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

// Hash password trước khi lưu
userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// So sánh password khi đăng nhập
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Tìm user bằng username hoặc phone
userSchema.statics.findByUsernameOrPhone = async function (identifier) {
  return this.findOne({
    $or: [{ username: identifier }, { phone: identifier }],
  });
};

const User = mongoose.model("User", userSchema);

export default User;
