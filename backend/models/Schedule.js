import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  className: { type: String, required: true },
  service: { type: String, required: true },
  instructor: { type: String },
  date: { type: Date, required: true }, // Đổi từ 'day' sang 'date'
  startTime: { type: String, required: true }, // "HH:mm" format
  endTime: { type: String, required: true }, // "HH:mm" format
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
