import { useState, useEffect } from "react";
import axios from "axios";

export default function ManageScheduleAdmin() {
  const [scheduledClassesState, setScheduledClassesState] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [creatingClass, setCreatingClass] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/schedules")
      .then((res) => setScheduledClassesState(res.data))
      .catch((err) => console.error("Lỗi khi lấy dữ liệu lịch:", err));
  }, []);

  const handleAddClass = () => {
    setCreatingClass({
      className: "",
      service: "",
      startTime: "",
      endTime: "",
      date: "",
      instructor: "",
      price: "", // 👉 thêm field price
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d)) return "Ngày không hợp lệ";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time) => {
    if (!time || typeof time !== "string" || !time.includes(":"))
      return time || "";
    const [hour, minute] = time.split(":");
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  const handleSaveNewClass = async () => {
    if (
      !creatingClass.className ||
      !creatingClass.service ||
      !creatingClass.startTime ||
      !creatingClass.endTime ||
      !creatingClass.date ||
      !creatingClass.price
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const newClass = {
      ...creatingClass,
      date: new Date(creatingClass.date),
      price: Number(creatingClass.price), // 👉 ép giá về số
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/schedules",
        newClass
      );
      setScheduledClassesState((prevState) => [...prevState, res.data]);
      setCreatingClass(null);
    } catch (error) {
      console.error("Lỗi khi thêm lớp:", error);
    }
  };

  const handleChangeClass = (index) => {
    const classData = { ...scheduledClassesState[index] };
    setEditingClass({
      ...classData,
      date: new Date(classData.date).toISOString().split("T")[0],
    });
  };

  const handleSaveEdit = async (updatedClass) => {
    const updatedData = {
      ...updatedClass,
      date: new Date(updatedClass.date),
      price: Number(updatedClass.price),
    };

    try {
      const res = await axios.put(
        `http://localhost:5000/api/schedules/${updatedClass._id}`,
        updatedData
      );
      const updated = scheduledClassesState.map((c) =>
        c._id === updatedClass._id ? res.data : c
      );
      setScheduledClassesState(updated);
      setEditingClass(null);
    } catch (error) {
      console.error("Lỗi khi lưu chỉnh sửa:", error);
    }
  };

  const handleCancelClass = async (index) => {
    const classToDelete = scheduledClassesState[index];
    try {
      await axios.delete(
        `http://localhost:5000/api/schedules/${classToDelete._id}`
      );
      setScheduledClassesState((prevState) =>
        prevState.filter((_, idx) => idx !== index)
      );
      alert("Đã xóa lịch thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa lớp:", error);
    }
  };

  const renderInput = (
    label,
    value,
    onChange,
    type = "text",
    placeholder = ""
  ) => (
    <div className="flex flex-col gap-1">
      <label className="font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="form-input rounded-lg border-gray-300"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quản Lý Lịch Tập</h1>
        <button
          onClick={handleAddClass}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition-all"
        >
          Thêm lịch
        </button>
      </div>

      {creatingClass && (
        <div className="mt-10 bg-white border p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold mb-6">Thêm lịch mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput("Tên lớp", creatingClass.className, (e) =>
              setCreatingClass({ ...creatingClass, className: e.target.value })
            )}
            {renderInput("Dịch vụ", creatingClass.service, (e) =>
              setCreatingClass({ ...creatingClass, service: e.target.value })
            )}
            {renderInput(
              "Giờ bắt đầu",
              creatingClass.startTime,
              (e) =>
                setCreatingClass({
                  ...creatingClass,
                  startTime: e.target.value,
                }),
              "time"
            )}
            {renderInput(
              "Giờ kết thúc",
              creatingClass.endTime,
              (e) =>
                setCreatingClass({ ...creatingClass, endTime: e.target.value }),
              "time"
            )}
            {renderInput(
              "Ngày",
              creatingClass.date,
              (e) =>
                setCreatingClass({ ...creatingClass, date: e.target.value }),
              "date"
            )}
            {renderInput(
              "Giá tiền",
              creatingClass.price,
              (e) =>
                setCreatingClass({ ...creatingClass, price: e.target.value }),
              "number",
              "VND"
            )}
            {renderInput("Tên huấn luyện viên", creatingClass.instructor, (e) =>
              setCreatingClass({ ...creatingClass, instructor: e.target.value })
            )}
          </div>
          <div className="flex gap-6 mt-6">
            <button
              onClick={handleSaveNewClass}
              className="bg-green-600 text-white px-8 py-3 rounded-lg"
            >
              Lưu
            </button>
            <button
              onClick={() => setCreatingClass(null)}
              className="bg-gray-400 text-white px-8 py-3 rounded-lg"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {scheduledClassesState.map((cls, idx) => (
          <div
            key={cls._id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-blue-600">
              {cls.className}
            </h2>
            <p>
              <strong>Dịch vụ:</strong> {cls.service}
            </p>
            <p>
              <strong>Thời gian:</strong>{" "}
              {`${formatTime(cls.startTime)} - ${formatTime(cls.endTime)}`}
            </p>
            <p>
              <strong>Ngày:</strong> {formatDate(cls.date)}
            </p>
            <p>
              <strong>Giá:</strong> {cls.price?.toLocaleString()} VND
            </p>
            <p>
              <strong>Huấn luyện viên:</strong> {cls.instructor}
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleChangeClass(idx)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md"
              >
                Sửa
              </button>
              <button
                onClick={() => handleCancelClass(idx)}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingClass && (
        <div className="mt-10 bg-white p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold mb-6">Chỉnh sửa lịch</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderInput("Tên lớp", editingClass.className, (e) =>
              setEditingClass({ ...editingClass, className: e.target.value })
            )}
            {renderInput("Dịch vụ", editingClass.service, (e) =>
              setEditingClass({ ...editingClass, service: e.target.value })
            )}
            {renderInput(
              "Giờ bắt đầu",
              editingClass.startTime,
              (e) =>
                setEditingClass({ ...editingClass, startTime: e.target.value }),
              "time"
            )}
            {renderInput(
              "Giờ kết thúc",
              editingClass.endTime,
              (e) =>
                setEditingClass({ ...editingClass, endTime: e.target.value }),
              "time"
            )}
            {renderInput(
              "Ngày",
              editingClass.date,
              (e) => setEditingClass({ ...editingClass, date: e.target.value }),
              "date"
            )}
            {renderInput(
              "Giá tiền",
              editingClass.price,
              (e) =>
                setEditingClass({ ...editingClass, price: e.target.value }),
              "number",
              "VND"
            )}
            {renderInput("Tên huấn luyện viên", editingClass.instructor, (e) =>
              setEditingClass({ ...editingClass, instructor: e.target.value })
            )}
          </div>
          <div className="flex gap-6 mt-6">
            <button
              onClick={() => handleSaveEdit(editingClass)}
              className="bg-green-600 text-white px-8 py-3 rounded-lg"
            >
              Lưu
            </button>
            <button
              onClick={() => setEditingClass(null)}
              className="bg-gray-400 text-white px-8 py-3 rounded-lg"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
