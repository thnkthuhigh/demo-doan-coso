import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GymImageGallery from "../Club/Banner";

export default function ViewSchedule() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("");
  const [filterDay, setFilterDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success"); // success, error, warning
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const services = [
    "FITNESS",
    "DANCE COVER",
    "ZUMBA",
    "PERSONAL TRAINER",
    "YOGA",
    "MUAY THAI",
    "BOXING",
    "CYCLING",
  ];

  const days = [
    { value: "", label: "Tất cả các ngày" },
    { value: "today", label: "Hôm nay" },
    { value: "tomorrow", label: "Ngày mai" },
    { value: "thisWeek", label: "Tuần này" },
    { value: "nextWeek", label: "Tuần sau" },
  ];

  useEffect(() => {
    // Load user từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const id = parsedUser._id || parsedUser.id;
      if (id) {
        setUserId(id);
      } else {
        console.warn("Không tìm thấy user id!");
      }
    }

    const fetchClasses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/schedules");
        const data = await res.json();
        setClasses(data);
      } catch (error) {
        console.error("Lỗi load lịch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Thêm useEffect để lấy danh sách lớp học đã đăng ký của user
  useEffect(() => {
    // Chỉ fetch khi có userId
    if (!userId) return;

    const fetchUserRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `http://localhost:5000/api/registrations/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Không thể lấy danh sách đăng ký");
        }

        const data = await res.json();

        // Lưu danh sách ID các lịch đã đăng ký
        const registeredScheduleIds = data.map(
          (reg) => reg.schedule._id || reg.schedule
        );

        setUserRegistrations(registeredScheduleIds);
      } catch (error) {
        console.error("Lỗi khi lấy đăng ký của user:", error);
      }
    };

    fetchUserRegistrations();
  }, [userId]);

  const handleRegister = async (scheduleId) => {
    if (!userId) {
      showMessage("⚠️ Bạn cần đăng nhập trước khi đăng ký!", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, scheduleId }),
      });

      const result = await res.json();

      if (res.ok) {
        // Thêm schedule vừa đăng ký vào danh sách đã đăng ký
        setUserRegistrations((prev) => [...prev, scheduleId]);
        showMessage("🎉 Đăng ký thành công!", "success");
      } else {
        showMessage(`⚠️ ${result.message || "Đăng ký thất bại"}`, "error");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      showMessage("❌ Lỗi hệ thống!", "error");
    }
  };

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const isDateInRange = (dateString, range) => {
    if (!range) return true;

    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Đầu tuần này (thứ 2)
    const thisWeekStart = new Date(today);
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Đổi từ 0-6 (CN-T7) sang 1-7 (T2-CN)
    thisWeekStart.setDate(today.getDate() - diff);

    // Đầu tuần sau
    const nextWeekStart = new Date(thisWeekStart);
    nextWeekStart.setDate(thisWeekStart.getDate() + 7);

    // Cuối tuần sau
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    switch (range) {
      case "today":
        return date.getTime() === today.getTime();
      case "tomorrow":
        return date.getTime() === tomorrow.getTime();
      case "thisWeek":
        return date >= thisWeekStart && date < nextWeekStart;
      case "nextWeek":
        return date >= nextWeekStart && date <= nextWeekEnd;
      default:
        return true;
    }
  };

  // Lọc các lớp học chưa đăng ký và phù hợp với bộ lọc
  const filteredClasses = classes.filter((cls) => {
    // Kiểm tra xem người dùng đã đăng ký lớp này chưa
    const alreadyRegistered = userRegistrations.includes(cls._id);

    // Nếu đã đăng ký rồi thì không hiển thị
    if (alreadyRegistered) return false;

    // Lọc theo các tiêu chí khác
    return (
      cls.className?.toLowerCase().includes(search.toLowerCase()) &&
      (filterService === "" || cls.service === filterService) &&
      isDateInRange(cls.date, filterDay)
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = [
      "Chủ Nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    return days[date.getDay()];
  };

  const getServiceColor = (service) => {
    switch (service) {
      case "FITNESS":
        return "bg-blue-500";
      case "YOGA":
        return "bg-purple-500";
      case "ZUMBA":
        return "bg-pink-500";
      case "DANCE COVER":
        return "bg-yellow-500";
      case "BOXING":
        return "bg-red-500";
      case "MUAY THAI":
        return "bg-orange-500";
      case "CYCLING":
        return "bg-green-500";
      case "PERSONAL TRAINER":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleViewDetails = (cls) => {
    setSelectedClass(cls);
    setIsModalOpen(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">
          Đang tải lịch tập...
        </p>
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
              Lịch Tập
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 italic font-light">
              "Đặt lịch tập ngay hôm nay - Khởi đầu hành trình cho một cuộc sống
              khỏe mạnh"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên lớp
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tên lớp..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-300 pl-10 pr-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dịch vụ
              </label>
              <select
                value={filterService}
                onChange={(e) => setFilterService(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Tất cả dịch vụ</option>
                {services.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian
              </label>
              <select
                value={filterDay}
                onChange={(e) => setFilterDay(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {days.map((day, index) => (
                  <option key={index} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Thông báo cho người dùng biết đã lọc các lớp đã đăng ký */}
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
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
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
                  Lịch tập bạn đã đăng ký sẽ không hiển thị tại đây. Xem tại
                  "Lịch của tôi".
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Các Lớp Tập Hiện Có
        </h2>

        {/* Class List */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredClasses.length > 0 ? (
            filteredClasses.map((cls) => (
              <motion.div
                key={cls._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col"
              >
                <div className={`${getServiceColor(cls.service)} p-1`}></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">
                      {cls.className}
                    </h2>
                    <span
                      className={`${getServiceColor(
                        cls.service
                      )} text-white text-xs px-2 py-1 rounded-full`}
                    >
                      {cls.service}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center">
                      <span className="bg-blue-100 p-2 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-500"
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
                      </span>
                      <div>
                        <p className="text-xs text-gray-500">Ngày</p>
                        <p className="text-sm font-medium">
                          {formatDate(cls.date)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getDayOfWeek(cls.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <span className="bg-purple-100 p-2 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-purple-500"
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
                      </span>
                      <div>
                        <p className="text-xs text-gray-500">Thời gian</p>
                        <p className="text-sm font-medium">
                          {cls.startTime} - {cls.endTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <span className="bg-green-100 p-2 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-green-500"
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
                      </span>
                      <div>
                        <p className="text-xs text-gray-500">Huấn luyện viên</p>
                        <p className="text-sm font-medium">
                          {cls.instructor || "Đang cập nhật"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <span className="bg-red-100 p-2 rounded-full mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                      <div>
                        <p className="text-xs text-gray-500">Giá</p>
                        <p className="text-sm font-medium">
                          {cls.price?.toLocaleString()} VND
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(cls)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition duration-200 text-sm font-medium"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleRegister(cls._id)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 text-sm font-medium flex items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
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
                      Đăng ký
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center col-span-full text-gray-500 py-10"
            >
              {userId && userRegistrations.length > 0
                ? "Bạn đã đăng ký tất cả các lớp phù hợp hoặc không tìm thấy lớp phù hợp với bộ lọc."
                : "Không tìm thấy lớp học phù hợp."}
            </motion.p>
          )}
        </motion.div>

        {/* Pagination example - would need to be implemented with actual logic */}
        {filteredClasses.length > 0 && (
          <div className="flex justify-center mt-10">
            <nav className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="py-2 px-4 border border-gray-300 bg-white rounded-l-md hover:bg-gray-50 text-gray-500 text-sm"
              >
                Trước
              </a>
              <a
                href="#"
                className="py-2 px-4 border-t border-b border-gray-300 bg-blue-50 text-blue-600 text-sm font-medium"
              >
                1
              </a>
              <a
                href="#"
                className="py-2 px-4 border border-gray-300 bg-white rounded-r-md hover:bg-gray-50 text-gray-500 text-sm"
              >
                Sau
              </a>
            </nav>
          </div>
        )}
      </div>

      {/* Class Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedClass && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`${getServiceColor(
                  selectedClass.service
                )} h-2 w-full`}
              ></div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {selectedClass.className}
                  </h3>
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
                      ></path>
                    </svg>
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex items-center">
                    <span className="bg-blue-100 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500"
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
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Ngày</p>
                      <p className="font-medium">
                        {formatDate(selectedClass.date)} (
                        {getDayOfWeek(selectedClass.date)})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="bg-purple-100 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-500"
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
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Thời gian</p>
                      <p className="font-medium">
                        {selectedClass.startTime} - {selectedClass.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="bg-green-100 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-green-500"
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
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Huấn luyện viên</p>
                      <p className="font-medium">
                        {selectedClass.instructor || "Đang cập nhật"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span
                      className={`${getServiceColor(
                        selectedClass.service
                      )} p-2 rounded-full mr-3`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Dịch vụ</p>
                      <p className="font-medium">{selectedClass.service}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <span className="bg-red-100 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm text-gray-500">Giá</p>
                      <p className="font-bold text-lg">
                        {selectedClass.price?.toLocaleString()} VND
                      </p>
                    </div>
                  </div>

                  {selectedClass.description && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Mô tả lớp học
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {selectedClass.description ||
                          "Không có thông tin chi tiết."}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => {
                      handleRegister(selectedClass._id);
                      setIsModalOpen(false);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition duration-200 font-semibold flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
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
                    Đăng Ký Lớp Này
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
