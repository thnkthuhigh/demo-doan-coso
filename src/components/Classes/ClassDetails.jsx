import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  DollarSign,
  User,
  ArrowLeft,
  CheckCircle,
  BookOpen,
  Target,
  Award,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";

export default function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchClassDetails();
  }, [id]);

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/classes/${id}/details`
      );
      setClassData(response.data);
    } catch (error) {
      console.error("Error fetching class details:", error);
      toast.error("Không thể tải thông tin lớp học");
      navigate("/my-classes");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đăng ký lớp học");
      navigate("/login");
      return;
    }

    try {
      setEnrolling(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/classes/enroll",
        {
          classId: id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Đăng ký lớp học thành công!");
      navigate("/my-classes");
    } catch (error) {
      console.error("Error enrolling:", error);
      const errorMessage =
        error.response?.data?.message || "Không thể đăng ký lớp học";
      toast.error(errorMessage);
    } finally {
      setEnrolling(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "upcoming":
        return {
          color: "blue",
          text: "Sắp diễn ra",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
        };
      case "ongoing":
        return {
          color: "green",
          text: "Đang diễn ra",
          bgColor: "bg-green-100",
          textColor: "text-green-800",
        };
      case "completed":
        return {
          color: "gray",
          text: "Hoàn thành",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        };
      case "cancelled":
        return {
          color: "red",
          text: "Đã hủy",
          bgColor: "bg-red-100",
          textColor: "text-red-800",
        };
      default:
        return {
          color: "gray",
          text: "Không xác định",
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
        };
    }
  };

  const formatSchedule = (schedule) => {
    if (!schedule || schedule.length === 0) return "Chưa có lịch";

    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return schedule
      .map((slot) => {
        const day = daysOfWeek[slot.dayOfWeek] || "N/A";
        return `${day}: ${slot.startTime}-${slot.endTime}`;
      })
      .join(", ");
  };

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

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Không tìm thấy lớp học
            </h2>
            <button
              onClick={() => navigate("/my-classes")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách lớp học
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(classData.status);
  const canEnroll =
    classData.status === "upcoming" &&
    classData.currentMembers < classData.maxMembers;
  const progressPercent =
    classData.totalSessions > 0
      ? ((classData.currentSession || 0) / classData.totalSessions) * 100
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/my-classes")}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách lớp học
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {classData.className}
              </h1>
              <p className="text-lg text-gray-600">{classData.serviceName}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}
            >
              {statusInfo.text}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Image */}
            {classData.service?.image && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={classData.service.image}
                  alt={classData.serviceName}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* Description */}
            {classData.description && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Mô tả lớp học
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {classData.description}
                </p>
              </div>
            )}

            {/* Service Benefits */}
            {classData.service?.benefits &&
              classData.service.benefits.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-yellow-500" />
                    Lợi ích
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {classData.service.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Requirements */}
            {classData.requirements && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-red-500" />
                  Yêu cầu
                </h2>
                <p className="text-gray-600">{classData.requirements}</p>
              </div>
            )}

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Lịch học
              </h2>
              <p className="text-gray-600">
                {formatSchedule(classData.schedule)}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Thông tin cơ bản
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Huấn luyện viên</p>
                    <p className="font-medium">
                      {classData.instructorName || "Chưa có"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Địa điểm</p>
                    <p className="font-medium">{classData.location}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Học viên</p>
                    <p className="font-medium">
                      {classData.currentMembers || 0}/{classData.maxMembers}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Tổng buổi học</p>
                    <p className="font-medium">
                      {classData.totalSessions} buổi
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Thời gian</p>
                    <p className="font-medium">
                      {new Date(classData.startDate).toLocaleDateString(
                        "vi-VN"
                      )}{" "}
                      -{" "}
                      {new Date(classData.endDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Học phí</p>
                    <p className="font-bold text-lg text-green-600">
                      {classData.price?.toLocaleString() || 0}đ
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Tiến độ lớp học
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Buổi học đã diễn ra</span>
                  <span className="font-medium">
                    {classData.currentSession || 0}/{classData.totalSessions}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <p className="text-xs text-gray-500">
                  {progressPercent.toFixed(1)}% hoàn thành
                </p>
              </div>
            </div>

            {/* Enrollment Stats */}
            {classData.enrollmentStats && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Thống kê đăng ký
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng đăng ký:</span>
                    <span className="font-medium">
                      {classData.enrollmentStats.totalEnrollments}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Đã thanh toán:</span>
                    <span className="font-medium text-green-600">
                      {classData.enrollmentStats.paidEnrollments}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chờ thanh toán:</span>
                    <span className="font-medium text-amber-600">
                      {classData.enrollmentStats.pendingPayments}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Enrollment Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              {canEnroll ? (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {enrolling ? "Đang đăng ký..." : "Đăng ký ngay"}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-2">
                    {classData.status === "completed"
                      ? "Lớp học đã kết thúc"
                      : classData.status === "ongoing"
                      ? "Lớp học đang diễn ra"
                      : classData.status === "cancelled"
                      ? "Lớp học đã bị hủy"
                      : classData.currentMembers >= classData.maxMembers
                      ? "Lớp học đã đầy"
                      : "Không thể đăng ký"}
                  </p>
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg cursor-not-allowed font-medium"
                  >
                    Không thể đăng ký
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
