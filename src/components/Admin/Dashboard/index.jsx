import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  CreditCard,
  Calendar,
  Dumbbell,
  Building,
  TrendingUp,
  ImageIcon,
  ClipboardList,
} from "lucide-react";
import AdminNav from "../AdminNav";
import ImageManager from "../ImageManager";
import PaymentManagement from "../PaymentManagement";
import MembershipManagement from "../MembershipManagement";
import AdminServiceManager from "../qldv";
import AdminClubManager from "../qlclb";
import ClassManagement from "../ClassManagement";
import AttendanceManagement from "../AttendanceManagement";
import Statistics from "../Statistics";
import UserManagement from "../UserManagement"; // Thêm import

const AdminDashboard = () => {
  const [activeModule, setActiveModule] = useState("dashboard");

  // Render content based on active module
  const renderContent = () => {
    switch (activeModule) {
      case "users":
        return <UserManagement />; // Thêm case này
      case "images":
        return <ImageManager />;
      case "payments":
        return <PaymentManagement />;
      case "memberships":
        return <MembershipManagement />;
      case "services":
        return <AdminServiceManager />;
      case "clubs":
        return <AdminClubManager />;
      case "classes":
        return <ClassManagement />;
      case "attendance":
        return <AttendanceManagement />;
      case "stats":
        return <Statistics />;
      case "dashboard":
      default:
        return <DashboardHome setActiveModule={setActiveModule} />;
    }
  };

  return (
    <div className="flex">
      <AdminNav activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 ml-64 p-6">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
};

// Dashboard home with real stats
const DashboardHome = ({ setActiveModule }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/stats/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Xem tổng quan và quản lý hệ thống</p>
      </div>

      {/* Stat cards với dữ liệu thật */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng người dùng"
          value={stats?.stats?.totalUsers || 0}
          change={`+${stats?.stats?.newUsersThisMonth || 0} tháng này`}
          icon={<Users className="h-7 w-7" />}
          color="blue"
        />
        <StatCard
          title="Doanh thu tháng"
          value={formatCurrency(stats?.stats?.monthlyRevenue || 0)}
          change={`${stats?.stats?.attendanceRate || 0}% tỷ lệ tham gia`}
          icon={<CreditCard className="h-7 w-7" />}
          color="green"
        />
        <StatCard
          title="Lớp học hoạt động"
          value={stats?.stats?.activeClasses || 0}
          change={`${stats?.stats?.newMembersThisMonth || 0} đăng ký mới`}
          icon={<Calendar className="h-7 w-7" />}
          color="purple"
        />
        <StatCard
          title="Thành viên mới"
          value={stats?.stats?.newMembersThisMonth || 0}
          change="Tháng này"
          icon={<Users className="h-7 w-7" />}
          color="amber"
        />
      </div>

      {/* Charts Section */}
      {stats?.charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Enrollment Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Đăng ký 7 ngày qua
            </h3>
            <div className="space-y-3">
              {stats.charts.last7Days.map((day, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-500">
                    {new Date(day.date).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.max(
                            (day.enrollments /
                              Math.max(
                                ...stats.charts.last7Days.map(
                                  (d) => d.enrollments
                                )
                              )) *
                              100,
                            5
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-12 text-sm font-medium text-gray-900">
                    {day.enrollments}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Services */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Dịch vụ phổ biến
            </h3>
            <div className="space-y-3">
              {stats.charts.popularServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-3 ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                          ? "bg-green-500"
                          : index === 2
                          ? "bg-yellow-500"
                          : index === 3
                          ? "bg-purple-500"
                          : "bg-gray-500"
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900">
                      {service._id}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {service.count} lượt đăng ký
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick actions - giữ nguyên */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Truy cập nhanh
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <QuickAction
            title="Quản lý lớp học"
            icon={<Calendar className="h-6 w-6" />}
            onClick={() => setActiveModule("classes")}
            color="purple"
          />
          <QuickAction
            title="Điểm danh"
            icon={<ClipboardList className="h-6 w-6" />}
            onClick={() => setActiveModule("attendance")}
            color="blue"
          />
          <QuickAction
            title="Thanh toán"
            icon={<CreditCard className="h-6 w-6" />}
            onClick={() => setActiveModule("payments")}
            color="green"
          />
          <QuickAction
            title="Thành viên"
            icon={<Users className="h-6 w-6" />}
            onClick={() => setActiveModule("users")} // Thay đổi từ "memberships" thành "users"
            color="indigo"
          />
          <QuickAction
            title="Dịch vụ"
            icon={<Dumbbell className="h-6 w-6" />}
            onClick={() => setActiveModule("services")}
            color="pink"
          />
          <QuickAction
            title="CLB"
            icon={<Building className="h-6 w-6" />}
            onClick={() => setActiveModule("clubs")}
            color="amber"
          />
          <QuickAction
            title="Hình ảnh"
            icon={<ImageIcon className="h-6 w-6" />}
            onClick={() => setActiveModule("images")}
            color="blue"
          />
          <QuickAction
            title="Thống kê"
            icon={<TrendingUp className="h-6 w-6" />}
            onClick={() => setActiveModule("stats")}
            color="indigo"
          />
        </div>
      </div>

      {/* Recent activity với dữ liệu thật */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Hoạt động gần đây
        </h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {stats?.recentActivities?.enrollments
              ?.slice(0, 5)
              .map((enrollment, index) => (
                <ActivityItem
                  key={index}
                  title={`${enrollment.user?.username} đăng ký lớp ${enrollment.class?.className}`}
                  time={new Date(enrollment.enrollmentDate).toLocaleDateString(
                    "vi-VN"
                  )}
                  icon={<Users className="h-5 w-5" />}
                  color="blue"
                />
              ))}
            {stats?.recentActivities?.classes
              ?.slice(0, 3)
              .map((classItem, index) => (
                <ActivityItem
                  key={`class-${index}`}
                  title={`Lớp ${classItem.className} (${classItem.serviceName}) đã được tạo`}
                  time={new Date(classItem.createdAt).toLocaleDateString(
                    "vi-VN"
                  )}
                  icon={<Calendar className="h-5 w-5" />}
                  color="purple"
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Stats placeholder
const StatsPlaceholder = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Thống kê</h1>
      <p className="text-gray-600">Tính năng đang được phát triển</p>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
    pink: "bg-pink-50 text-pink-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <span className="text-sm font-medium text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
          {change}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

// Quick Action Component
const QuickAction = ({ title, icon, onClick, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
    amber: "bg-amber-50 text-amber-600 hover:bg-amber-100",
    pink: "bg-pink-50 text-pink-600 hover:bg-pink-100",
    indigo: "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl transition-colors ${colorClasses[color]}`}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-sm font-medium text-center">{title}</span>
    </button>
  );
};

// Activity Item Component
const ActivityItem = ({ title, time, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
    pink: "bg-pink-50 text-pink-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="flex items-center px-6 py-4 hover:bg-gray-50">
      <div className={`p-2 rounded-lg mr-4 ${colorClasses[color]}`}>{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
