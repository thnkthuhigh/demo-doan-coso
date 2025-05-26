import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function UserClasses() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceReport, setAttendanceReport] = useState(null);

  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "active", label: "Đang học" },
    { value: "completed", label: "Hoàn thành" },
    { value: "paused", label: "Tạm dừng" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const id = parsedUser._id || parsedUser.id;
      if (id) {
        setUserId(id);
        fetchUserClasses(id);
      }
    }
  }, []);

  const fetchUserClasses = async (uid) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/classes/user/${uid}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEnrollments(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy lớp học của user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceReport = async (enrollment) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/attendance/user/${userId}/class/${enrollment.class._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAttendanceReport(response.data);
      setSelectedEnrollment(enrollment);
      setShowAttendanceModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy báo cáo điểm danh:", error);
      alert("Không thể tải báo cáo điểm danh");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Đang học";
      case "completed":
        return "Hoàn thành";
      case "paused":
        return "Tạm dừng";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const formatSchedule = (schedule) => {
    if (!schedule || schedule.length === 0) return "Liên hệ để biết thêm chi tiết";

    const daysOfWeek = [
      { value: 0, label: "CN" },
      { value: 1, label: "T2" },
      { value: 2, label: "T3" },
      { value: 3, label: "T4" },
      { value: 4, label: "T5" },
      { value: 5, label: "T6" },
      { value: 6, label: "T7" },
    ];

    return schedule
      .map((slot) => {
        const day = daysOfWeek.find((d) => d.value === slot.dayOfWeek);
        return `${day?.label}: ${slot.startTime}-${slot.endTime}`;
      })
      .join(", ");
  };

  const calculateProgress = (enrollment) => {
    const totalSessions = enrollment.class.totalSessions;
    const attendedSessions = enrollment.attendanceRecord?.filter(record => record.attended).length || 0;
    return totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    return !filterStatus || enrollment.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Đang tải lớp học của bạn...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lớp học của tôi</h1>
          <p className="text-gray-600">Theo dõi tiến độ và điểm danh các lớp học bạn đã đăng ký</p>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">
              Tổng: {filteredEnrollments.length} lớp học
            </span>
          </div>
        </div>

        {/* Classes List */}
        {filteredEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEnrollments.map((enrollment) => (
              <motion.div
                key={enrollment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {enrollment.class.className}
                      </h3>
                      <p className="text-sm text-gray-600">{enrollment.class.serviceName}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        enrollment.status
                      )}`}
                    >
                      {getStatusText(enrollment.status)}
                    </span>
                  </div>

                  {/* Class Info */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{enrollment.class.instructorName || "Đang cập nhật"}</span>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{enrollment.class.location}</span>
                    </div>

                    <div className="flex items-start">
                      <svg className="w-4 h-4 mr-2 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs leading-relaxed">
                        {formatSchedule(enrollment.class.schedule)}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {new Date(enrollment.class.startDate).toLocaleDateString("vi-VN")} -{" "}
                        {new Date(enrollment.class.endDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Tiến độ học tập</span>
                      <span className="text-sm text-gray-600">
                        {enrollment.attendanceRecord?.filter(r => r.attended).length || 0}/{enrollment.class.totalSessions} buổi
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${calculateProgress(enrollment)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {calculateProgress(enrollment).toFixed(1)}% hoàn thành
                    </div>
                  </div>

                  {/* Remaining Sessions */}
                  {enrollment.remainingSessions !== undefined && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium text-blue-800">
                          Còn lại: {enrollment.remainingSessions} buổi
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchAttendanceReport(enrollment)}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Xem điểm danh
                    </button>
                    {enrollment.status === "active" && (
                      <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                        Tạm dừng
                      </button>
                    )}
                  </div>

                  {/* Enrollment Date */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Đăng ký ngày: {new Date(enrollment.enrollmentDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lớp học nào</h3>
            <p className="text-gray-500 mb-4">
              {filterStatus
                ? `Không có lớp học nào với trạng thái "${statusOptions.find(o => o.value === filterStatus)?.label}"`
                : "Bạn chưa đăng ký lớp học nào"}
            </p>
            <a
              href="/classes"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Khám phá lớp học
            </a>
          </motion.div>
        )}

        {/* Attendance Modal */}
        <AnimatePresence>
          {showAttendanceModal && selectedEnrollment && attendanceReport && (
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
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Báo cáo điểm danh</h2>
                    <p className="text-gray-600">{selectedEnrollment.class.className}</p>
                  </div>
                  <button
                    onClick={() => setShowAttendanceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{attendanceReport.totalAttended}</div>
                    <div className="text-sm text-gray-600">Đã tham gia</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{attendanceReport.totalSessions}</div>
                    <div className="text-sm text-gray-600">Tổng buổi</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{attendanceReport.attendanceRate}%</div>
                    <div className="text-sm text-gray-600">Tỷ lệ tham gia</div>
                  </div>
                </div>

                {/* Attendance Record */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Lịch sử điểm danh</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {attendanceReport.attendanceRecord.length > 0 ? (
                      attendanceReport.attendanceRecord.map((record, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center p-3 rounded-lg ${
                            record.attended ? "bg-green-50" : "bg-red-50"
                          }`}
                        >
                          <div>
                            <span className="font-medium">Buổi {record.sessionNumber}</span>
                            <span className="ml-2 text-sm text-gray-600">
                              {new Date(record.date).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {record.attended ? (
                              <div className="flex items-center text-green-600">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Có mặt</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-600">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">Vắng mặt</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Chưa có buổi học nào được ghi nhận
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowAttendanceModal(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}