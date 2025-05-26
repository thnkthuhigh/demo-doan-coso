import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    fetchClasses();
    fetchServices();
    loadUserData();
  }, []);

  // Load user data from localStorage
  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        if (userData._id) {
          fetchUserEnrollments(userData._id);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      showMessage("❌ Không thể tải danh sách lớp học", "error");
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/services");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchUserEnrollments = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        `http://localhost:5000/api/classes/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserEnrollments(response.data || []);
    } catch (error) {
      console.error("Error fetching user enrollments:", error);
      setUserEnrollments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (classId) => {
    if (!user) {
      showMessage("❌ Vui lòng đăng nhập để đăng ký lớp học", "error");
      return;
    }

    // Check if user is already enrolled
    const isEnrolled = userEnrollments.some(
      (enrollment) => enrollment.class?._id === classId
    );

    if (isEnrolled) {
      showMessage("ℹ️ Bạn đã đăng ký lớp học này rồi", "error");
      return;
    }

    try {
      setEnrolling(classId);
      const token = localStorage.getItem("token");

      // Debug logs
      console.log("User:", user);
      console.log("Token:", token);
      console.log("Class ID:", classId);

      if (!token) {
        showMessage("❌ Vui lòng đăng nhập lại", "error");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/classes/enroll",
        { classId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      showMessage("✅ Đăng ký lớp học thành công!");

      // Refresh data
      fetchClasses();
      if (user._id) {
        fetchUserEnrollments(user._id);
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi đăng ký";
      showMessage(`❌ ${errorMessage}`, "error");
    } finally {
      setEnrolling(null);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const formatSchedule = (schedule) => {
    if (!schedule || schedule.length === 0) return "Chưa có lịch";

    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return schedule
      .map((slot) => {
        const day = daysOfWeek[slot.dayOfWeek] || "N/A";
        return `${day}: ${slot.startTime || "N/A"}-${slot.endTime || "N/A"}`;
      })
      .join(", ");
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

  // Check if user is enrolled in a class
  const isUserEnrolled = (classId) => {
    return userEnrollments.some(
      (enrollment) => enrollment.class?._id === classId
    );
  };

  // Filter classes
  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.instructorName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || cls.status === statusFilter;
    const matchesService = !serviceFilter || cls.serviceName === serviceFilter;

    return matchesSearch && matchesStatus && matchesService;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <GymImageGallery />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Khám Phá Các Lớp Học
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tham gia các lớp học đa dạng với huấn luyện viên chuyên nghiệp. Từ
            Yoga thư giãn đến Boxing mạnh mẽ - tìm lớp học phù hợp với bạn!
          </p>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm lớp học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="upcoming">Sắp diễn ra</option>
              <option value="ongoing">Đang diễn ra</option>
              <option value="completed">Hoàn thành</option>
            </select>

            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả dịch vụ</option>
              {services.map((service) => (
                <option key={service._id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClasses.map((classItem) => (
            <motion.div
              key={classItem._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              {/* Class Header */}
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                    {classItem.className}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      classItem.status
                    )}`}
                  >
                    {getStatusText(classItem.status)}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <Star className="h-4 w-4 text-yellow-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {classItem.serviceName}
                  </span>
                </div>
              </div>

              {/* Class Info */}
              <div className="px-6 pb-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-3 text-gray-400" />
                  <span>HLV: {classItem.instructorName || "Chưa có"}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-3 text-gray-400" />
                  <span>
                    {classItem.currentMembers || 0}/{classItem.maxMembers} học
                    viên
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{classItem.location || "Phòng tập chính"}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-3 text-gray-400" />
                  <span>{formatSchedule(classItem.schedule)}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                  <span>
                    {new Date(classItem.startDate).toLocaleDateString()} -{" "}
                    {new Date(classItem.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-3 text-gray-400" />
                  <span className="font-semibold text-green-600">
                    {classItem.price?.toLocaleString()} VND
                  </span>
                </div>
              </div>

              {/* Description */}
              {classItem.description && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {classItem.description}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div className="px-6 pb-6">
                {user ? (
                  isUserEnrolled(classItem._id) ? (
                    <button
                      disabled
                      className="w-full py-3 bg-green-100 text-green-700 rounded-lg font-medium flex items-center justify-center"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Đã đăng ký
                    </button>
                  ) : classItem.status === "upcoming" ||
                    classItem.status === "ongoing" ? (
                    <button
                      onClick={() => handleEnroll(classItem._id)}
                      disabled={enrolling === classItem._id}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {enrolling === classItem._id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Đang đăng ký...
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-5 w-5 mr-2" />
                          Đăng ký ngay
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 bg-gray-100 text-gray-500 rounded-lg font-medium flex items-center justify-center"
                    >
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Không thể đăng ký
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="w-full py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <User className="h-5 w-5 mr-2" />
                    Đăng nhập để đăng ký
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClasses.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy lớp học nào
            </h3>
            <p className="text-gray-500">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
