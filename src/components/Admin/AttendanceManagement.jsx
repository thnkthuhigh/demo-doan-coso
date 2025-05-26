import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  UserX,
  Plus,
  Eye,
  Download,
  Search,
  Filter,
  ChevronRight,
  AlertCircle,
  BookOpen,
  Target,
} from "lucide-react";

export default function AttendanceManagement() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [classMembers, setClassMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [newSession, setNewSession] = useState({
    sessionNumber: 1,
    sessionDate: new Date().toISOString().split("T")[0],
    instructorId: "",
  });

  const [attendanceData, setAttendanceData] = useState({
    attendanceId: "",
    attendances: [],
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchClassData(selectedClass._id);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/classes");
      const ongoingClasses = response.data.filter(
        (cls) => cls.status === "ongoing" || cls.status === "upcoming"
      );
      setClasses(ongoingClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassData = async (classId) => {
    try {
      const [attendanceRes, membersRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/attendance/class/${classId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get(`http://localhost:5000/api/classes/${classId}/members`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);

      setAttendanceSessions(attendanceRes.data);
      setClassMembers(membersRes.data);
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/attendance/session",
        {
          classId: selectedClass._id,
          ...newSession,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchClassData(selectedClass._id);
      setShowCreateSession(false);
      setNewSession({
        sessionNumber: 1,
        sessionDate: new Date().toISOString().split("T")[0],
        instructorId: "",
      });
      alert("Tạo buổi học thành công!");
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Có lỗi xảy ra khi tạo buổi học!");
    }
  };

  const handleMarkAttendance = async (userId, attended, note = "") => {
    try {
      if (!attended) return; // Chỉ gửi request khi điểm danh có mặt

      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/attendance/mark",
        {
          attendanceId: selectedSession._id,
          userId,
          note,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Cập nhật danh sách attendees trong session
      setSelectedSession((prev) => ({
        ...prev,
        attendees: [
          ...(prev.attendees || []),
          {
            user: classMembers.find((m) => m.user._id === userId).user,
            attendedAt: new Date(),
            note,
          },
        ],
        totalPresent: (prev.totalPresent || 0) + 1,
      }));

      alert("Điểm danh thành công!");
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Có lỗi xảy ra khi điểm danh!");
    }
  };

  const isUserAttended = (userId) => {
    return selectedSession?.attendees?.some(
      (attendee) => attendee.user._id === userId || attendee.user === userId
    );
  };

  const getNextSessionNumber = () => {
    if (attendanceSessions.length === 0) return 1;
    const maxSession = Math.max(
      ...attendanceSessions.map((s) => s.sessionNumber)
    );
    return maxSession + 1;
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || cls.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportAttendanceReport = () => {
    if (!selectedClass || attendanceSessions.length === 0) return;

    const csvContent = [
      [
        "Buổi học",
        "Ngày",
        "Tổng học viên",
        "Có mặt",
        "Vắng mặt",
        "Tỷ lệ tham gia (%)",
      ],
      ...attendanceSessions.map((session) => [
        `Buổi ${session.sessionNumber}`,
        new Date(session.sessionDate).toLocaleDateString("vi-VN"),
        session.totalEnrolled,
        session.totalPresent,
        session.totalEnrolled - session.totalPresent,
        session.totalEnrolled > 0
          ? ((session.totalPresent / session.totalEnrolled) * 100).toFixed(1)
          : "0",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance_${selectedClass.className}_${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý điểm danh
          </h1>
          <p className="text-gray-600">
            Điểm danh và theo dõi tham gia lớp học
          </p>
        </div>
        {selectedClass && (
          <div className="flex space-x-2">
            <button
              onClick={exportAttendanceReport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </button>
            <button
              onClick={() => {
                setNewSession({
                  ...newSession,
                  sessionNumber: getNextSessionNumber(),
                });
                setShowCreateSession(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo buổi học
            </button>
          </div>
        )}
      </div>

      {/* Class Selection */}
      {!selectedClass ? (
        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg shadow">
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="upcoming">Sắp diễn ra</option>
                <option value="ongoing">Đang diễn ra</option>
              </select>

              <div className="flex justify-end">
                <span className="text-sm text-gray-500 flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {filteredClasses.length} lớp học
                </span>
              </div>
            </div>
          </div>

          {/* Classes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <motion.div
                key={classItem._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedClass(classItem)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {classItem.className}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Dịch vụ:</span>{" "}
                      {classItem.serviceName}
                    </p>
                    <p>
                      <span className="font-medium">HLV:</span>{" "}
                      {classItem.instructorName || "Chưa có"}
                    </p>
                    <p>
                      <span className="font-medium">Thành viên:</span>{" "}
                      {classItem.currentMembers}/{classItem.maxMembers}
                    </p>
                    <p>
                      <span className="font-medium">Tổng buổi:</span>{" "}
                      {classItem.totalSessions}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        classItem.status === "upcoming"
                          ? "bg-blue-100 text-blue-800"
                          : classItem.status === "ongoing"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {classItem.status === "upcoming"
                        ? "Sắp diễn ra"
                        : classItem.status === "ongoing"
                        ? "Đang diễn ra"
                        : "Hoàn thành"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredClasses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">Không có lớp học nào</p>
            </div>
          )}
        </div>
      ) : (
        /* Class Detail View */
        <div className="space-y-6">
          {/* Class Info Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => setSelectedClass(null)}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                ← Quay lại danh sách
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {selectedClass.className}
                </h2>
                <p className="text-gray-600">{selectedClass.serviceName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Thành viên</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedClass.currentMembers}/{selectedClass.maxMembers}
                  </p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Tổng buổi</p>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedClass.totalSessions}
                  </p>
                </div>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Buổi đã tạo</p>
                <p className="text-lg font-bold text-gray-900">
                  {attendanceSessions.length}
                </p>
              </div>
            </div>
          </div>

          {/* Attendance Sessions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Danh sách buổi học
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {attendanceSessions.length > 0 ? (
                attendanceSessions.map((session) => (
                  <div key={session._id} className="p-6 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {session.sessionNumber}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            Buổi học số {session.sessionNumber}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(session.sessionDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Có mặt</p>
                          <p className="text-lg font-semibold text-green-600">
                            {session.totalPresent || 0}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-gray-500">Vắng mặt</p>
                          <p className="text-lg font-semibold text-red-600">
                            {(session.totalEnrolled || 0) -
                              (session.totalPresent || 0)}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm text-gray-500">Tỷ lệ (%)</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {session.totalEnrolled > 0
                              ? (
                                  ((session.totalPresent || 0) /
                                    session.totalEnrolled) *
                                  100
                                ).toFixed(1)
                              : "0"}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedSession(session);
                            setShowMarkAttendance(true);
                          }}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Điểm danh
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chưa có buổi học nào
                  </h3>
                  <p className="text-gray-500">
                    Tạo buổi học đầu tiên để bắt đầu điểm danh
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Session Modal */}
      <AnimatePresence>
        {showCreateSession && (
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
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Tạo buổi học mới</h2>

              <form onSubmit={handleCreateSession} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số buổi học
                  </label>
                  <input
                    type="number"
                    value={newSession.sessionNumber}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        sessionNumber: parseInt(e.target.value),
                      })
                    }
                    min="1"
                    max={selectedClass?.totalSessions}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày học
                  </label>
                  <input
                    type="date"
                    value={newSession.sessionDate}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        sessionDate: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateSession(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Tạo buổi học
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mark Attendance Modal */}
      <AnimatePresence>
        {showMarkAttendance && selectedSession && (
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
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">
                    Điểm danh - Buổi {selectedSession.sessionNumber}
                  </h2>
                  <p className="text-gray-600">
                    {new Date(selectedSession.sessionDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setShowMarkAttendance(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {classMembers.map((member) => {
                  const isAttended = isUserAttended(member.user._id);

                  return (
                    <div
                      key={member.user._id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        isAttended
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {member.user.username || member.user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {member.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isAttended ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Đã điểm danh
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleMarkAttendance(member.user._id, true)
                            }
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Có mặt
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {classMembers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    Chưa có học viên nào đăng ký lớp này
                  </p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tổng: {classMembers.length} học viên</span>
                  <span>Đã điểm danh: {selectedSession.totalPresent || 0}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
