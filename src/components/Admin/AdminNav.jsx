import React from "react";
import {
  LayoutDashboard,
  Users,
  ImageIcon,
  Calendar,
  BarChart,
  CreditCard,
  UserCheck,
  Building,
  Dumbbell,
  ClipboardList,
} from "lucide-react";

const AdminNav = ({ activeModule, setActiveModule }) => {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "users", label: "Quản lý người dùng", icon: <Users size={20} /> },
    { id: "classes", label: "Quản lý lớp học", icon: <Calendar size={20} /> },
    { id: "attendance", label: "Điểm danh", icon: <ClipboardList size={20} /> },
    {
      id: "payments",
      label: "Quản lý thanh toán",
      icon: <CreditCard size={20} />,
    },
    {
      id: "memberships",
      label: "Quản lý thành viên",
      icon: <UserCheck size={20} />,
    },
    { id: "services", label: "Quản lý dịch vụ", icon: <Dumbbell size={20} /> },
    { id: "clubs", label: "Quản lý CLB", icon: <Building size={20} /> },
    { id: "images", label: "Quản lý hình ảnh", icon: <ImageIcon size={20} /> },
    { id: "stats", label: "Thống kê", icon: <BarChart size={20} /> },
  ];

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen fixed left-0 top-16 pt-4 overflow-y-auto z-40">
      <div className="px-4 py-2">
        <h2 className="text-xl font-semibold">Quản trị viên</h2>
        <p className="text-gray-400 text-sm">Quản lý hệ thống</p>
      </div>

      <nav className="mt-6 pb-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`flex w-full items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
              activeModule === item.id
                ? "bg-gray-700 border-r-4 border-purple-500 text-purple-200"
                : ""
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default AdminNav;
