import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  className: { type: String, required: true },
  service: { type: String, required: true },
  instructor: { type: String },
  date: { type: Date, required: true }, // "Ngày học"
  startTime: { type: String, required: true }, // "Giờ bắt đầu" - định dạng "HH:mm"
  endTime: { type: String, required: true }, // "Giờ kết thúc" - định dạng "HH:mm"
  price: { type: Number, required: true }, // ✅ thêm giá tiền
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
