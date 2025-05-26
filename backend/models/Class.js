import mongoose from "mongoose";

const classScheduleSchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number, // 0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7
    required: true,
  },
  startTime: {
    type: String, // "HH:mm"
    required: true,
  },
  endTime: {
    type: String, // "HH:mm"
    required: true,
  },
});

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    instructorName: {
      type: String,
    },
    description: {
      type: String,
    },
    maxMembers: {
      type: Number,
      required: true,
      default: 20,
    },
    currentMembers: {
      type: Number,
      default: 0,
    },
    totalSessions: {
      type: Number,
      required: true, // Tổng số buổi tập trong khóa học
    },
    currentSession: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true, // Ngày bắt đầu khóa học
    },
    endDate: {
      type: Date,
      required: true, // Ngày kết thúc khóa học
    },
    schedule: [classScheduleSchema], // Lịch tập hàng tuần
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    image: {
      type: String,
    },
    location: {
      type: String,
      default: "Phòng tập chính",
    },
    requirements: {
      type: String, // Yêu cầu đặc biệt (nếu có)
    },
  },
  {
    timestamps: true,
  }
);

// Virtual để tính số thành viên còn lại
classSchema.virtual("availableSlots").get(function () {
  return this.maxMembers - this.currentMembers;
});

// Index để tìm kiếm nhanh
classSchema.index({ serviceName: 1, status: 1 });
classSchema.index({ startDate: 1, endDate: 1 });

const Class = mongoose.model("Class", classSchema);
export default Class;
