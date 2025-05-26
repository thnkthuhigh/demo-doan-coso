import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  BookOpen,
  CheckCircle,
  XCircle,
  Eye,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Users,
  Filter,
  Search,
  RefreshCw,
  BarChart3,
  Target,
  Award,
} from "lucide-react";
import { toast } from "react-toastify";

export default function UserClasses() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState({});

  const statusOptions = [
    { value: "all", label: "Tất cả" },
    { value: "paid", label: "Đã thanh toán" },
    { value: "pending", label: "Chờ thanh toán" },
    { value: "upcoming", label: "Sắp diễn ra" },
    { value: "ongoing", label: "Đang học" },
    { value: "completed", label: "Hoàn thành" },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const id = parsedUser._id || parsedUser.id;
        if (id) {
          setUserId(id);
          fetchUserClasses(id);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserClasses = async (uid, showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/classes/user/${uid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEnrollments(response.data || []);

      // Fetch attendance data for each class
      if (response.data && response.data.length > 0) {
        fetchAttendanceData(uid);
      }
    } catch (error) {
      console.error("Lỗi khi lấy lớp học của user:", error);
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn");
        navigate("/login");
      } else {
        toast.error("Không thể tải danh sách lớp học");
      }
      setEnrollments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchAttendanceData = async (uid) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/attendance/user/${uid}/report`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Group attendance by class
      const attendanceByClass = {};
      response.data.attendanceRecords?.forEach((record) => {
        const classId = record.classId?._id || record.classId;
        if (!attendanceByClass[classId]) {
          attendanceByClass[classId] = {
            total: 0,
            attended: 0,
            missed: 0,
          };
        }
        attendanceByClass[classId].total++;
        if (record.isPresent) {
          attendanceByClass[classId].attended++;
        } else {
          attendanceByClass[classId].missed++;
        }
      });

      setAttendanceData(attendanceByClass);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu điểm danh:", error);
    }
  };

  const handleRefresh = () => {
    if (userId) {
      fetchUserClasses(userId, false);
    }
  };

  const getStatusInfo = (enrollment) => {
    const classStatus = enrollment.class?.status;
    const paymentStatus = enrollment.paymentStatus;

    if (!paymentStatus) {
      return {
        color: "amber",
        icon: AlertTriangle,
        text: "Chờ thanh toán",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
      };
    }

    switch (classStatus) {
      case "upcoming":
        return {
          color: "blue",
          icon: Clock,
          text: "Sắp diễn ra",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-700",
        };
      case "ongoing":
        return {
          color: "green",
          icon: CheckCircle,
          text: "Đang diễn ra",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-700",
        };
      case "completed":
        return {
          color: "gray",
          icon: Award,
          text: "Hoàn thành",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-700",
        };
      default:
        return {
          color: "gray",
          icon: XCircle,
          text: "Không xác định",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
          textColor: "text-gray-700",
        };
    }
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

  const getAttendanceStats = (classId) => {
    const data = attendanceData[classId];
    if (!data || data.total === 0) {
      return { rate: 0, attended: 0, total: 0 };
    }
    return {
      rate: Math.round((data.attended / data.total) * 100),
      attended: data.attended,
      total: data.total,
    };
  };

  const getProgressPercent = (enrollment) => {
    const currentSession = enrollment.class?.currentSession || 0;
    const totalSessions = enrollment.class?.totalSessions || 0;
    return totalSessions > 0 ? (currentSession / totalSessions) * 100 : 0;
  };

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.class?.className
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enrollment.class?.serviceName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      enrollment.class?.instructorName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterStatus === "all") return true;
    if (filterStatus === "paid") return enrollment.paymentStatus;
    if (filterStatus === "pending") return !enrollment.paymentStatus;
    if (filterStatus === "ongoing")
      return enrollment.class?.status === "ongoing";
    if (filterStatus === "completed")
      return enrollment.class?.status === "completed";
    if (filterStatus === "upcoming")
      return enrollment.class?.status === "upcoming";

    return true;
  });

  // Statistics
  const stats = {
    total: enrollments.length,
    paid: enrollments.filter((e) => e.paymentStatus).length,
    pending: enrollments.filter((e) => !e.paymentStatus).length,
    ongoing: enrollments.filter((e) => e.class?.status === "ongoing").length,
    completed: enrollments.filter((e) => e.class?.status === "completed")
      .length,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Lớp học của tôi
              </h1>
              <p className="text-gray-600 max-w-3xl">
                Theo dõi tiến độ và quản lý các lớp học bạn đã đăng ký
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Làm mới
              </button>
              <button
                onClick={() => navigate("/classes")}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Đăng ký thêm
              </button>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-gray-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </div>
                <div className="text-sm text-gray-600">Tổng lớp học</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.paid}
                </div>
                <div className="text-sm text-gray-600">Đã thanh toán</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-amber-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {stats.pending}
                </div>
                <div className="text-sm text-gray-600">Chờ thanh toán</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.ongoing}
                </div>
                <div className="text-sm text-gray-600">Đang học</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.completed}
                </div>
                <div className="text-sm text-gray-600">Hoàn thành</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm lớp học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Classes Grid */}
        {filteredEnrollments.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-10 text-center"
          >
            <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              {enrollments.length === 0
                ? "Bạn chưa đăng ký lớp học nào"
                : "Không tìm thấy lớp học"}
            </h2>
            <p className="text-gray-600 mb-6">
              {enrollments.length === 0
                ? "Khám phá các lớp học của chúng tôi và bắt đầu hành trình fitness của bạn."
                : "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."}
            </p>
            <button
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              onClick={() => navigate("/classes")}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Đăng ký ngay
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => {
              const statusInfo = getStatusInfo(enrollment);
              const attendanceStats = getAttendanceStats(enrollment.class?._id);
              const progressPercent = getProgressPercent(enrollment);
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={enrollment._id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-white rounded-xl shadow-sm border-2 ${statusInfo.borderColor} overflow-hidden hover:shadow-md transition-all duration-200`}
                >
                  {/* Header */}
                  <div
                    className={`${statusInfo.bgColor} px-5 py-3 border-b ${statusInfo.borderColor}`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {enrollment.class?.className || "Lớp học"}
                      </h3>
                      <div
                        className={`flex items-center px-2 py-1 rounded-full ${statusInfo.textColor} bg-white/50`}
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {enrollment.class?.serviceName || "N/A"}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="space-y-3">
                      {/* Instructor */}
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">
                            Huấn luyện viên
                          </p>
                          <p className="font-medium text-gray-800">
                            {enrollment.class?.instructorName || "Chưa có"}
                          </p>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className="flex items-start">
                        <Clock className="h-4 w-4 text-gray-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500">Lịch học</p>
                          <p className="font-medium text-gray-800 text-sm">
                            {formatSchedule(enrollment.class?.schedule)}
                          </p>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-xs text-gray-500">Địa điểm</p>
                          <p className="font-medium text-gray-800">
                            {enrollment.class?.location || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-gray-400 mr-3" />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-gray-500">Tiến độ học</p>
                            <span className="text-xs font-medium text-gray-700">
                              {enrollment.class?.currentSession || 0}/
                              {enrollment.class?.totalSessions || 0}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Attendance */}
                      {attendanceStats.total > 0 && (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-gray-400 mr-3" />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-xs text-gray-500">Điểm danh</p>
                              <span className="text-xs font-medium text-gray-700">
                                {attendanceStats.rate}% (
                                {attendanceStats.attended}/
                                {attendanceStats.total})
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${attendanceStats.rate}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Remaining Sessions */}
                      {enrollment.remainingSessions !== undefined && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center">
                            <Target className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm font-medium text-blue-800">
                              Còn lại: {enrollment.remainingSessions} buổi
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-4 border-t border-gray-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() =>
                            navigate(
                              `/classes/${enrollment.class?._id}/details`
                            )
                          }
                          className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Xem chi tiết
                        </button>

                        <button
                          onClick={() => {
                            setSelectedEnrollment(enrollment);
                            setShowDetailModal(true);
                          }}
                          className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Thống kê
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {!enrollment.paymentStatus && (
                          <button
                            onClick={() => navigate("/payment")}
                            className="flex items-center px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                          >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Thanh toán
                          </button>
                        )}

                        <span className="text-xs text-gray-500">
                          Đăng ký:{" "}
                          {new Date(
                            enrollment.enrollmentDate
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Detail Modal */}
        <AnimatePresence>
          {showDetailModal && selectedEnrollment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowDetailModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedEnrollment.class?.className}
                      </h2>
                      <p className="text-gray-600">
                        {selectedEnrollment.class?.serviceName}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">
                        {selectedEnrollment.class?.currentSession || 0}
                      </div>
                      <div className="text-xs text-gray-600">Buổi đã học</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-600">
                        {selectedEnrollment.class?.totalSessions || 0}
                      </div>
                      <div className="text-xs text-gray-600">Tổng buổi</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">
                        {
                          getAttendanceStats(selectedEnrollment.class?._id)
                            .attended
                        }
                      </div>
                      <div className="text-xs text-gray-600">Đã tham gia</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">
                        {getAttendanceStats(selectedEnrollment.class?._id).rate}
                        %
                      </div>
                      <div className="text-xs text-gray-600">
                        Tỷ lệ tham gia
                      </div>
                    </div>
                  </div>

                  {/* Class Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Thông tin lớp học
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">
                            Huấn luyện viên:
                          </span>
                          <span className="ml-2 font-medium">
                            {selectedEnrollment.class?.instructorName || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Địa điểm:</span>
                          <span className="ml-2 font-medium">
                            {selectedEnrollment.class?.location || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Học phí:</span>
                          <span className="ml-2 font-bold text-green-600">
                            {selectedEnrollment.class?.price?.toLocaleString() ||
                              0}
                            đ
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            Trạng thái thanh toán:
                          </span>
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              selectedEnrollment.paymentStatus
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {selectedEnrollment.paymentStatus
                              ? "Đã thanh toán"
                              : "Chờ thanh toán"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Lịch học
                      </h3>
                      <p className="text-gray-600">
                        {formatSchedule(selectedEnrollment.class?.schedule)}
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Tiến độ học tập
                      </h3>
                      <div className="bg-gray-100 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span>Buổi học đã hoàn thành</span>
                          <span className="font-bold">
                            {selectedEnrollment.class?.currentSession || 0}/
                            {selectedEnrollment.class?.totalSessions || 0}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                            style={{
                              width: `${getProgressPercent(
                                selectedEnrollment
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {getProgressPercent(selectedEnrollment).toFixed(1)}%
                          hoàn thành
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    {!selectedEnrollment.paymentStatus && (
                      <button
                        onClick={() => navigate("/payment")}
                        className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Thanh toán ngay
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
