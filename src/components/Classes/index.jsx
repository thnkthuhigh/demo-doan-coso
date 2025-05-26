import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Star,
  User,
  DollarSign,
  BookOpen,
  Target,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
} from "lucide-react";
import GymImageGallery from "../Club/Banner";

export default function ViewClasses() {
  const [classes, setClasses] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [userEnrollments, setUserEnrollments] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = [
    { value: "", label: "Tất cả trạng thái" },
    { value: "upcoming", label: "Sắp diễn ra" },
    { value: "ongoing", label: "Đang diễn ra" },
    { value: "available", label: "Còn chỗ trống" },
  ];

  useEffect(() => {
    // Load user từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const id = parsedUser._id || parsedUser.id;
      if (id) {
        setUserId(id);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserEnrollments();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classesRes, servicesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/classes"),
        axios.get("http://localhost:5000/api/services"),
      ]);

      // Chỉ hiển thị lớp có thể đăng ký
      const availableClasses = classesRes.data.filter(
        (cls) => cls.status === "upcoming" || cls.status === "ongoing"
      );

      setClasses(availableClasses);
      setServices(servicesRes.data);
    } catch (error) {
      console.error("Lỗi load dữ liệu:", error);
      showMessage("❌ Không thể tải dữ liệu lớp học", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserEnrollments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `http://localhost:5000/api/classes/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const enrolledClassIds = response.data.map(
        (enrollment) => enrollment.class._id
      );
      setUserEnrollments(enrolledClassIds);
    } catch (error) {
      console.error("Lỗi khi lấy đăng ký của user:", error);
    }
  };

  const handleEnroll = async (classId) => {
    if (!userId) {
      showMessage("⚠️ Bạn cần đăng nhập trước khi đăng ký!", "warning");
      return;
    }

    try {
      setEnrolling(classId);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/classes/enroll",
        {
          classId,
          userId: user._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showMessage("🎉 Đăng ký lớp học thành công!", "success");
      fetchData(); // Refresh để cập nhật số lượng thành viên
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      const errorMessage = error.response?.data?.message || "Đăng ký thất bại";
      showMessage(`⚠️ ${errorMessage}`, "error");
    } finally {
      setEnrolling(null);
    }
  };

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const formatSchedule = (schedule) => {
    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return schedule
      .map((slot) => {
        return `${daysOfWeek[slot.dayOfWeek]}: ${slot.startTime}-${
          slot.endTime
        }`;
      })
      .join(", ");
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.instructorName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = !serviceFilter || cls.serviceName === serviceFilter;
    const matchesStatus = !statusFilter || cls.status === statusFilter;

    return matchesSearch && matchesService && matchesStatus;
  });

  const getServiceColor = (serviceName) => {
    const colors = {
      FITNESS: "bg-blue-500",
      YOGA: "bg-purple-500",
      ZUMBA: "bg-pink-500",
      "DANCE COVER": "bg-yellow-500",
      BOXING: "bg-red-500",
      "MUAY THAI": "bg-orange-500",
      CYCLING: "bg-green-500",
      "PERSONAL TRAINER": "bg-indigo-500",
    };
    return colors[serviceName] || "bg-gray-500";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getUniqueServices = () => {
    return [...new Set(classes.map((cls) => cls.serviceName))].filter(Boolean);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Đang tải lớp học...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Banner */}
      <div className="relative h-[40vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 z-10"></div>
        <div className="absolute inset-0">
          <GymImageGallery />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <motion.div
            className="text-center max-w-4xl px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white uppercase tracking-wide mb-4 drop-shadow-lg">
              Lớp Học
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 italic font-light">
              "Tham gia lớp học ngay hôm nay - Khởi đầu hành trình cho một cuộc
              sống khỏe mạnh"
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 -mt-10">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg shadow-md ${
                messageType === "success"
                  ? "bg-green-100 text-green-800 border-l-4 border-green-500"
                  : messageType === "warning"
                  ? "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500"
                  : "bg-red-100 text-red-800 border-l-4 border-red-500"
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-4">Tìm Kiếm & Lọc</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm lớp học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả dịch vụ</option>
              {services.map((service) => (
                <option key={service._id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="ongoing">Đang diễn ra</option>
            </select>
          </div>
        </motion.div>

        {/* Info về đăng ký */}
        {userId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-lg"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Lớp học bạn đã đăng ký sẽ không hiển thị tại đây. Xem tại "Lớp
                  học của tôi".
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Các Lớp Học Hiện Có ({filteredClasses.length})
        </h2>

        {/* Classes Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls) => (
              <motion.div
                key={cls._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
              >
                <div
                  className={`${getServiceColor(cls.serviceName)} p-1`}
                ></div>

                {/* Class Image */}
                {cls.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={cls.image}
                      alt={cls.className}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                      {cls.className}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        cls.status
                      )}`}
                    >
                      {getStatusText(cls.status)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <span
                        className={`${getServiceColor(
                          cls.serviceName
                        )} w-3 h-3 rounded-full mr-2`}
                      ></span>
                      <span className="font-medium">{cls.serviceName}</span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>{cls.instructorName || "Đang cập nhật"}</span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span>
                        {cls.currentMembers}/{cls.maxMembers} thành viên
                      </span>
                      {cls.currentMembers >= cls.maxMembers && (
                        <span className="ml-2 text-red-500 text-xs font-medium">
                          (Đầy)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{cls.totalSessions} buổi</span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span className="font-semibold text-green-600">
                        {cls.price?.toLocaleString()} VND
                      </span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{cls.location}</span>
                    </div>

                    <div className="flex items-start">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-xs leading-relaxed">
                        {formatSchedule(cls.schedule)}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {new Date(cls.startDate).toLocaleDateString("vi-VN")} -{" "}
                        {new Date(cls.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  {cls.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {cls.description}
                    </p>
                  )}

                  {/* Enroll Button */}
                  <button
                    onClick={() => handleEnroll(cls._id)}
                    disabled={
                      cls.currentMembers >= cls.maxMembers ||
                      cls.status === "completed" ||
                      cls.status === "cancelled"
                    }
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      cls.currentMembers >= cls.maxMembers ||
                      cls.status === "completed" ||
                      cls.status === "cancelled"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {cls.currentMembers >= cls.maxMembers
                      ? "Đã đầy"
                      : cls.status === "completed"
                      ? "Đã kết thúc"
                      : cls.status === "cancelled"
                      ? "Đã hủy"
                      : "Đăng ký"}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-24 w-24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146.832-5.678 2.172M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có lớp học nào
              </h3>
              <p className="text-gray-500">
                {search || filterService || filterStatus
                  ? "Không tìm thấy lớp học phù hợp với bộ lọc của bạn"
                  : "Hiện tại chưa có lớp học nào được mở"}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Class Detail Modal */}
        <AnimatePresence>
          {isModalOpen && selectedClass && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedClass.className}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {selectedClass.image && (
                  <div className="mb-4">
                    <img
                      src={selectedClass.image}
                      alt={selectedClass.className}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Thông tin cơ bản
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Dịch vụ:</span>
                        <span className="ml-2 font-medium">
                          {selectedClass.serviceName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Huấn luyện viên:</span>
                        <span className="ml-2 font-medium">
                          {selectedClass.instructorName || "Đang cập nhật"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Số lượng:</span>
                        <span className="ml-2 font-medium">
                          {selectedClass.currentMembers}/
                          {selectedClass.maxMembers} thành viên
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tổng buổi:</span>
                        <span className="ml-2 font-medium">
                          {selectedClass.totalSessions} buổi
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Giá:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {selectedClass.price?.toLocaleString()} VND
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Địa điểm:</span>
                        <span className="ml-2 font-medium">
                          {selectedClass.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Thời gian
                    </h3>
                    <div className="text-sm">
                      <p>
                        <span className="text-gray-600">
                          Thời gian khóa học:
                        </span>
                        <span className="ml-2">
                          {new Date(selectedClass.startDate).toLocaleDateString(
                            "vi-VN"
                          )}{" "}
                          -{" "}
                          {new Date(selectedClass.endDate).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </p>
                      <p className="mt-1">
                        <span className="text-gray-600">Lịch tập:</span>
                        <span className="ml-2">
                          {formatSchedule(selectedClass.schedule)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {selectedClass.description && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Mô tả
                      </h3>
                      <p className="text-sm text-gray-700">
                        {selectedClass.description}
                      </p>
                    </div>
                  )}

                  {selectedClass.requirements && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Yêu cầu
                      </h3>
                      <p className="text-sm text-gray-700">
                        {selectedClass.requirements}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Đóng
                    </button>
                    <button
                      onClick={() => {
                        handleEnroll(selectedClass._id);
                        setIsModalOpen(false);
                      }}
                      disabled={
                        selectedClass.currentMembers >=
                          selectedClass.maxMembers ||
                        selectedClass.status === "completed" ||
                        selectedClass.status === "cancelled"
                      }
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                        selectedClass.currentMembers >=
                          selectedClass.maxMembers ||
                        selectedClass.status === "completed" ||
                        selectedClass.status === "cancelled"
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {selectedClass.currentMembers >= selectedClass.maxMembers
                        ? "Đã đầy"
                        : selectedClass.status === "completed"
                        ? "Đã kết thúc"
                        : selectedClass.status === "cancelled"
                        ? "Đã hủy"
                        : "Đăng ký ngay"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
