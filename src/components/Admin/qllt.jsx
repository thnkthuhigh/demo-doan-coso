import { useState, useEffect } from "react";
import axios from "axios";

export default function ManageScheduleAdmin() {
  const [scheduledClassesState, setScheduledClassesState] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [creatingClass, setCreatingClass] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const servicesOptions = [
    "FITNESS",
    "DANCE COVER",
    "ZUMBA",
    "PERSONAL TRAINER",
    "YOGA",
    "MUAY THAI",
    "BOXING",
    "CYCLING",
  ];

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/schedules")
      .then((res) => {
        setScheduledClassesState(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu lịch:", err);
        setIsLoading(false);
      });
  }, []);

  const handleAddClass = () => {
    setCreatingClass({
      className: "",
      service: "",
      startTime: "",
      endTime: "",
      date: "",
      instructor: "",
      price: "",
    });
    setEditingClass(null);

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
      showNotification("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

    const newClass = {
      ...creatingClass,
      date: new Date(creatingClass.date),
      price: Number(creatingClass.price),
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/schedules",
        newClass
      );
      setScheduledClassesState((prevState) => [...prevState, res.data]);
      setCreatingClass(null);
      showNotification("Thêm lịch tập mới thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm lớp:", error);
      showNotification("Không thể thêm lịch tập, vui lòng thử lại!", "error");
    }
  };

  const handleChangeClass = (index) => {
    const classData = { ...scheduledClassesState[index] };
    setEditingClass({
      ...classData,
      date: new Date(classData.date).toISOString().split("T")[0],
    });
    setCreatingClass(null);

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSaveEdit = async (updatedClass) => {
    if (
      !updatedClass.className ||
      !updatedClass.service ||
      !updatedClass.startTime ||
      !updatedClass.endTime ||
      !updatedClass.date ||
      !updatedClass.price
    ) {
      showNotification("Vui lòng điền đầy đủ thông tin!", "error");
      return;
    }

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
      showNotification("Cập nhật lịch tập thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu chỉnh sửa:", error);
      showNotification(
        "Không thể cập nhật lịch tập, vui lòng thử lại!",
        "error"
      );
    }
  };

  const handleCancelClass = async (index) => {
    const classToDelete = scheduledClassesState[index];
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa lịch "${classToDelete.className}" không?`
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/schedules/${classToDelete._id}`
      );
      setScheduledClassesState((prevState) =>
        prevState.filter((_, idx) => idx !== index)
      );
      showNotification("Đã xóa lịch tập thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa lớp:", error);
      showNotification("Không thể xóa lịch tập, vui lòng thử lại!", "error");
    }
  };

  // Function to show notification
  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out z-50 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
  };

  const renderForm = (data, isEditing) => {
    const handleInputChange = (field, value) => {
      if (isEditing) {
        setEditingClass({ ...editingClass, [field]: value });
      } else {
        setCreatingClass({ ...creatingClass, [field]: value });
      }
    };

    return (
      <div className="bg-white p-8 rounded-xl shadow-md mb-10">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          {isEditing ? "Chỉnh sửa lịch tập" : "Thêm lịch tập mới"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên lớp
            </label>
            <input
              type="text"
              value={data.className}
              onChange={(e) => handleInputChange("className", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập tên lớp"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dịch vụ
            </label>
            <select
              value={data.service}
              onChange={(e) => handleInputChange("service", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Chọn dịch vụ</option>
              {servicesOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giờ bắt đầu
            </label>
            <input
              type="time"
              value={data.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giờ kết thúc
            </label>
            <input
              type="time"
              value={data.endTime}
              onChange={(e) => handleInputChange("endTime", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày
            </label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá tiền (VND)
            </label>
            <input
              type="number"
              value={data.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập giá tiền"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Huấn luyện viên
            </label>
            <input
              type="text"
              value={data.instructor}
              onChange={(e) => handleInputChange("instructor", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Nhập tên huấn luyện viên"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={
              isEditing ? () => handleSaveEdit(data) : handleSaveNewClass
            }
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
          >
            {isEditing ? "Cập nhật" : "Thêm lịch"}
          </button>

          <button
            onClick={() =>
              isEditing ? setEditingClass(null) : setCreatingClass(null)
            }
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all"
          >
            Hủy
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Quản Lý Lịch Tập
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Thêm, chỉnh sửa và quản lý các lịch tập
            </p>
          </div>

          {!creatingClass && !editingClass && (
            <button
              onClick={handleAddClass}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-sm flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Thêm lịch mới
            </button>
          )}
        </div>

        {creatingClass && renderForm(creatingClass, false)}
        {editingClass && renderForm(editingClass, true)}

        {scheduledClassesState.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scheduledClassesState.map((cls, idx) => (
              <div
                key={cls._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-blue-600">
                    {cls.className}
                  </h2>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {cls.service}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{`${formatTime(cls.startTime)} - ${formatTime(
                      cls.endTime
                    )}`}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatDate(cls.date)}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span className="font-medium text-green-600">
                      {cls.price?.toLocaleString()} VND
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>{cls.instructor || "Chưa có HLV"}</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleChangeClass(idx)}
                    className="flex-1 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-md hover:bg-yellow-100 transition-colors flex justify-center items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Sửa
                  </button>

                  <button
                    onClick={() => handleCancelClass(idx)}
                    className="flex-1 bg-red-50 text-red-700 px-4 py-2 rounded-md hover:bg-red-100 transition-colors flex justify-center items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-4 text-xl font-medium text-gray-500">
              Chưa có lịch tập nào được tạo
            </p>
            {!creatingClass && (
              <button
                onClick={handleAddClass}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
              >
                Thêm lịch tập đầu tiên
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
