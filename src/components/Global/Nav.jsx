import React from "react";
import { Link } from "react-router-dom";

export default function NavBar({ user, setUser }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // Reset state người dùng
    window.location.href = "/login"; // Chuyển đến trang login
  };

  return (
    <header className="flex justify-between items-center p-4 shadow-md">
      <Link to="/" className="text-2xl font-bold text-black">
        TMN
      </Link>
      <nav className="space-x-6 text-sm flex items-center">
        <Link to="/club" className="hover:text-gray-600">
          CLB
        </Link>
        <Link to="/services" className="hover:text-gray-600">
          Dịch vụ
        </Link>
        <Link to="/prices" className="hover:text-gray-600">
          Chính sách giá
        </Link>
        <Link to="/schedule" className="hover:text-gray-600">
          Xem lịch tập
        </Link>

        {/* Quản lý cho Admin */}
        {user?.role === "admin" && (
          <div className="relative group">
            <button className="hover:text-gray-600">Quản lý </button>
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50 opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-300">
              <Link
                to="/ql"
                className="block px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
              >
                Quản Lý Lịch Tập
              </Link>
              <Link
                to="/qldv"
                className="block px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
              >
                Quản Lý Dịch Vụ
              </Link>
              <Link
                to="/qlclb"
                className="block px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
              >
                Quản Lý CLB
              </Link>
            </div>
          </div>
        )}

        <Link to="/payment" className="hover:text-gray-600">
          Thanh toán
        </Link>

        {user ? (
          <>
            <span className="text-gray-700 font-semibold">
              👤 {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:text-gray-600">
            Đăng nhập/Đăng ký
          </Link>
        )}
      </nav>
    </header>
  );
}
