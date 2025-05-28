import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, Settings, Crown, Shield } from "lucide-react";

export default function NavBar({ user, setUser }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra đường dẫn hiện tại để highlight menu item active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Xử lý scroll để thay đổi style của navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUserMenuOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "CLB", path: "/club" },
    { name: "Dịch vụ", path: "/services" },
    { name: "Lớp học", path: "/classes" },
    { name: "Lịch của tôi", path: "/my-classes" },
    { name: "Thẻ thành viên", path: "/membership" },
  ];

  // Cập nhật phần render chính
  return (
    <header
      className={`navbar-fixed transition-all duration-500 ${
        isScrolled ? "navbar-scrolled py-3" : "navbar-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div
              className={`w-12 h-12 bg-gradient-luxury rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 ${
                isScrolled ? "shadow-vintage" : "shadow-golden"
              }`}
            >
              <Crown className="h-7 w-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span
                className={`vintage-heading text-2xl font-bold transition-colors duration-300 nav-text`}
              >
                Royal Fitness
              </span>
              <span
                className={`vintage-sans text-xs font-medium tracking-wider nav-text-secondary`}
              >
                LUXURY GYM CLUB
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`vintage-sans px-4 py-2 rounded-lg font-medium transition-all duration-300 relative group ${
                  isActive(link.path)
                    ? isScrolled
                      ? "text-vintage-primary bg-vintage-warm"
                      : "text-vintage-gold bg-white/15 shadow-golden"
                    : isScrolled
                    ? "text-vintage-neutral hover:text-vintage-primary hover:bg-vintage-warm"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
                <span
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-vintage-gold transition-all duration-300 group-hover:w-3/4 ${
                    isActive(link.path) ? "w-3/4" : ""
                  }`}
                ></span>
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-full transition-all duration-300 group ${
                      isScrolled
                        ? "bg-vintage-warm border border-vintage-primary/20 hover:border-vintage-primary/40"
                        : "bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20"
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center shadow-soft group-hover:shadow-vintage transition-all duration-300">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <div
                        className={`vintage-sans font-medium text-sm ${
                          isScrolled ? "text-vintage-dark" : "text-white"
                        }`}
                      >
                        {user.username}
                      </div>
                      <div
                        className={`vintage-sans text-xs ${
                          isScrolled
                            ? "text-vintage-neutral"
                            : "text-vintage-cream opacity-80"
                        }`}
                      >
                        {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                      </div>
                    </div>
                    <svg
                      className={`w-4 h-4 transform transition-transform duration-200 ${
                        userMenuOpen ? "rotate-180" : ""
                      } ${
                        isScrolled
                          ? "text-vintage-neutral"
                          : "text-vintage-cream"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 vintage-card border border-vintage-primary/20 shadow-elegant z-50">
                      <div className="py-2">
                        <Link
                          to="/user"
                          className="flex items-center px-4 py-3 vintage-sans text-vintage-dark hover:bg-vintage-warm transition-colors duration-200"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-3 text-vintage-primary" />
                          Thông tin cá nhân
                        </Link>

                        {user.role === "admin" && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-3 vintage-sans text-vintage-dark hover:bg-vintage-warm transition-colors duration-200"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4 mr-3 text-vintage-primary" />
                            Dashboard
                          </Link>
                        )}

                        <div className="vintage-divider my-2"></div>

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 vintage-sans text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <button
                    className={`btn-vintage-secondary px-6 py-2 rounded-lg vintage-sans font-medium transition-all duration-300 ${
                      !isScrolled
                        ? "border-white text-white hover:bg-white hover:text-vintage-dark"
                        : ""
                    }`}
                  >
                    Đăng nhập
                  </button>
                </Link>
                <Link to="/sign-up">
                  <button className="btn-vintage-primary px-6 py-2 rounded-lg vintage-sans font-medium">
                    Đăng ký
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                isScrolled
                  ? "text-vintage-neutral hover:text-vintage-dark hover:bg-vintage-warm"
                  : "text-vintage-cream hover:text-white hover:bg-white/10"
              }`}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation với z-index cao */}
      {mobileMenuOpen && (
        <div className="mobile-menu lg:hidden bg-white shadow-vintage border-t border-vintage-primary/20">
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-3 rounded-lg vintage-sans font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? "bg-vintage-warm text-vintage-primary"
                    : "text-vintage-dark hover:bg-vintage-warm hover:text-vintage-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <Link
                to="/my-classes"
                className={`block px-4 py-3 rounded-lg vintage-sans font-medium transition-colors duration-200 ${
                  isActive("/my-classes")
                    ? "bg-vintage-warm text-vintage-primary"
                    : "text-vintage-dark hover:bg-vintage-warm hover:text-vintage-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Lịch của tôi
              </Link>
            )}

            {/* Mobile User Menu */}
            {user ? (
              <div className="pt-4 border-t border-vintage-primary/20 space-y-2">
                <div className="flex items-center px-4 py-2">
                  <div className="w-10 h-10 bg-gradient-luxury rounded-full flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="vintage-sans font-medium text-vintage-dark">
                      {user.username}
                    </div>
                    <div className="vintage-sans text-sm text-vintage-neutral">
                      {user.role === "admin" ? "Quản trị viên" : "Thành viên"}
                    </div>
                  </div>
                </div>

                <Link
                  to="/user"
                  className="block px-4 py-3 vintage-sans text-vintage-dark hover:bg-vintage-warm transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Thông tin cá nhân
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block px-4 py-3 vintage-sans text-vintage-dark hover:bg-vintage-warm transition-colors duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 vintage-sans text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-vintage-primary/20 space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center py-3 btn-vintage-secondary rounded-lg vintage-sans font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/sign-up"
                  className="block w-full text-center py-3 btn-vintage-primary rounded-lg vintage-sans font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
