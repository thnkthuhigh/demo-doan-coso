import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar({ user, setUser }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  // Kiểm tra đường dẫn hiện tại để highlight menu item active
  const isActive = (path) => {
    return location.pathname === path ? true : false;
  };

  // Xử lý scroll để thay đổi style của navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-gradient-to-r from-purple-900/70 to-blue-900/70 backdrop-blur-md py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div
              className={`text-2xl font-extrabold ${
                isScrolled ? "text-blue-900" : "text-white"
              }`}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                TMN GYM
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/club"
              isActive={isActive("/club")}
              isScrolled={isScrolled}
            >
              CLB
            </NavLink>

            <NavLink
              to="/services"
              isActive={isActive("/services")}
              isScrolled={isScrolled}
            >
              Dịch vụ
            </NavLink>

            <NavLink
              to="/schedule"
              isActive={isActive("/schedule")}
              isScrolled={isScrolled}
            >
              Lịch tập
            </NavLink>

            {user && (
              <NavLink
                to="/my-schedule"
                isActive={isActive("/my-schedule")}
                isScrolled={isScrolled}
              >
                Lịch của tôi
              </NavLink>
            )}

            <NavLink
              to="/membership"
              isActive={isActive("/membership")}
              isScrolled={isScrolled}
            >
              Đăng Ký Thành Viên
            </NavLink>

            <NavLink
              to="/payment"
              isActive={isActive("/payment")}
              isScrolled={isScrolled}
            >
              Thanh toán
            </NavLink>

            {/* User Authentication */}
            {user ? (
              <div className="relative group ml-2">
                <button
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full 
                  ${
                    isScrolled
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
                  }
                  transition-all`}
                  onClick={(e) => {
                    if (window.innerWidth < 1024) {
                      e.preventDefault();
                      setUserMenuOpen(!userMenuOpen);
                    }
                  }}
                  onMouseEnter={() => setUserMenuOpen(true)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                      onError={(e) => {
                        console.error(
                          "Nav: Failed to load avatar:",
                          user.avatar.url
                        );
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        // Make sure the fallback is displayed
                        const parent = e.target.parentElement;
                        let fallback = parent.querySelector(".avatar-fallback");
                        if (!fallback) {
                          fallback = document.createElement("span");
                          fallback.className =
                            "avatar-fallback w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold";
                          fallback.textContent =
                            user?.username?.charAt(0).toUpperCase() || "U";
                          parent.appendChild(fallback);
                        } else {
                          fallback.style.display = "flex";
                        }
                      }}
                    />
                  ) : (
                    <span className="avatar-fallback w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                  <span className="font-medium hidden sm:block">
                    {user?.username}
                  </span>
                  <span className="text-xs">▼</span>
                </button>

                <div
                  className="absolute right-0 w-48 top-full z-50"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div
                    className={`mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden 
                      transform transition-all duration-150 ease-in-out origin-top-right
                      ${
                        userMenuOpen
                          ? "scale-100 opacity-100 pointer-events-auto"
                          : "scale-95 opacity-0 pointer-events-none"
                      }`}
                  >
                    <div className="py-2 border-b border-gray-100">
                      <Link
                        to="/user"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg
                          className="mr-2 h-4 w-4 text-gray-500"
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
                        Hồ sơ cá nhân
                      </Link>

                      {user?.role === "admin" && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <svg
                              className="mr-2 h-4 w-4 text-gray-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                              />
                            </svg>
                            Dashboard
                          </Link>
                        </>
                      )}

                      <Link
                        to="/user/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg
                          className="mr-2 h-4 w-4 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Cài đặt
                      </Link>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg
                          className="mr-2 h-4 w-4 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-5 py-2 rounded-full font-medium transition-all ${
                  isScrolled
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-blue-700 hover:bg-blue-50"
                }`}
              >
                Đăng nhập
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                className={`h-6 w-6 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className={`h-6 w-6 ${
                  isScrolled ? "text-gray-900" : "text-white"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-2 pb-4 bg-white shadow-lg">
          <MobileNavLink to="/club" isActive={isActive("/club")}>
            CLB
          </MobileNavLink>
          <MobileNavLink to="/services" isActive={isActive("/services")}>
            Dịch vụ
          </MobileNavLink>
          <MobileNavLink to="/prices" isActive={isActive("/prices")}>
            Bảng giá
          </MobileNavLink>
          <MobileNavLink to="/schedule" isActive={isActive("/schedule")}>
            Lịch tập
          </MobileNavLink>

          {user && (
            <MobileNavLink
              to="/my-schedule"
              isActive={isActive("/my-schedule")}
            >
              Lịch của tôi
            </MobileNavLink>
          )}

          <MobileNavLink to="/membership" isActive={isActive("/membership")}>
            Đăng Ký Thành Viên
          </MobileNavLink>

          {user?.role === "admin" && (
            <>
              <MobileNavLink
                to="/admin/dashboard"
                isActive={isActive("/admin/dashboard")}
              >
                Dashboard
              </MobileNavLink>
              <MobileNavLink to="/qllt" isActive={isActive("/qllt")} isAdmin>
                Quản lý lịch tập
              </MobileNavLink>
              <MobileNavLink to="/qldv" isActive={isActive("/qldv")} isAdmin>
                Quản lý dịch vụ
              </MobileNavLink>
              <MobileNavLink to="/qlclb" isActive={isActive("/qlclb")} isAdmin>
                Quản lý CLB
              </MobileNavLink>
            </>
          )}

          <MobileNavLink to="/payment" isActive={isActive("/payment")}>
            Thanh toán
          </MobileNavLink>

          <div className="mt-4 pt-4 border-t border-gray-200">
            {user ? (
              <>
                <div className="flex items-center px-3 py-2 text-sm">
                  {user?.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt="Mobile avatar"
                      className="w-8 h-8 rounded-full object-cover mr-3 border border-gray-200 shadow-sm"
                      onError={(e) => {
                        console.error("Mobile: Failed to load avatar");
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        // Create fallback avatar with initials
                        const fallback = document.createElement("div");
                        fallback.className =
                          "w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3";
                        fallback.textContent = user.username
                          .charAt(0)
                          .toUpperCase();
                        e.target.parentNode.insertBefore(fallback, e.target);
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="font-medium text-gray-900">
                    {user.username}
                  </div>
                </div>
                <Link
                  to="/user"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hồ sơ cá nhân
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <svg
                    className="mr-2 h-4 w-4 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Đăng nhập / Đăng ký
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Component cho Desktop Nav Links
function NavLink({ children, to, isActive, isScrolled }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg font-medium transition-all ${
        isActive
          ? isScrolled
            ? "text-blue-600 bg-blue-50"
            : "text-white bg-white/20"
          : isScrolled
          ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          : "text-white/90 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </Link>
  );
}

// Component cho Admin Dropdown Links
function AdminLink({ children, to, icon }) {
  return (
    <Link
      to={to}
      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
    >
      {icon === "calendar" && (
        <svg
          className="mr-3 h-4 w-4 text-gray-500"
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
      )}
      {icon === "service" && (
        <svg
          className="mr-3 h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      )}
      {icon === "building" && (
        <svg
          className="mr-3 h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      )}
      {icon === "payment" && (
        <svg
          className="mr-3 h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      )}
      {icon === "card" && (
        <svg
          className="mr-3 h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      )}
      {children}
    </Link>
  );
}

// Component cho Mobile Nav Links
function MobileNavLink({ children, to, isActive, isAdmin }) {
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md ${
        isActive
          ? "bg-blue-50 text-blue-600 font-medium"
          : isAdmin
          ? "text-gray-600 pl-6 text-sm hover:bg-gray-50"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </Link>
  );
}
