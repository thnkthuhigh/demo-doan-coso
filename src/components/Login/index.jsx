import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  Crown,
  Shield,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";

export default function Login({ setUser }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Debug: Log request data
    console.log("🔍 Login Request Data:", {
      identifier,
      password: password ? "***" : "empty",
      email: identifier, // API expects 'email' field
    });

    try {
      // Improved request - ensure proper data format
      const loginData = {
        email: identifier.trim(),
        password: password,
      };

      console.log(
        "📤 Sending login request to:",
        "http://localhost:5000/api/auth/login"
      );
      console.log("📤 Request payload:", { ...loginData, password: "***" });

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log("✅ Login response:", response.data);

      const { token, user } = response.data;

      // Validate response data
      if (!token) {
        throw new Error("Token không được trả về từ server");
      }

      if (!user) {
        throw new Error("Thông tin user không được trả về từ server");
      }

      console.log("👤 User data from login:", user);
      console.log("🔑 Token received:", token ? "Yes" : "No");

      // Store basic info first
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Check if user has valid ID for profile fetch
      if (user._id || user.id) {
        try {
          const userId = user._id || user.id;
          console.log("🔍 Fetching user profile for ID:", userId);

          const userResponse = await axios.get(
            `http://localhost:5000/api/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              timeout: 5000,
            }
          );

          console.log("✅ User profile response:", userResponse.data);

          const fullUserData = userResponse.data;
          localStorage.setItem("user", JSON.stringify(fullUserData));
          setUser(fullUserData);
        } catch (profileError) {
          console.error("❌ Error fetching complete profile:", profileError);
          console.log("⚠️ Using basic user data from login response");
          setUser(user);
        }
      } else {
        console.log("⚠️ No valid user ID found, using basic user data");
        setUser(user);
      }

      console.log("🎉 Login successful, redirecting to home");
      navigate("/");
    } catch (error) {
      console.error("❌ Login error:", error);

      // Enhanced error handling
      let errorMessage = "Đăng nhập thất bại, vui lòng thử lại sau.";

      if (error.response) {
        // Server responded with error status
        console.error("📥 Error response:", error.response);
        console.error("📊 Error status:", error.response.status);
        console.error("📄 Error data:", error.response.data);

        switch (error.response.status) {
          case 400:
            errorMessage =
              error.response.data?.message ||
              "Thông tin đăng nhập không hợp lệ";
            break;
          case 401:
            errorMessage = "Email/Username hoặc mật khẩu không chính xác";
            break;
          case 404:
            errorMessage = "Tài khoản không tồn tại";
            break;
          case 429:
            errorMessage = "Quá nhiều lần thử đăng nhập, vui lòng thử lại sau";
            break;
          case 500:
            errorMessage = "Lỗi server, vui lòng thử lại sau";
            break;
          default:
            errorMessage = error.response.data?.message || errorMessage;
        }
      } else if (error.request) {
        // Network error
        console.error("🌐 Network error:", error.request);
        errorMessage =
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
      } else {
        // Other error
        console.error("❓ Other error:", error.message);
        errorMessage = error.message || errorMessage;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-blue-400 rounded-3xl blur-2xl opacity-30"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 border-2 border-pink-200/30 shadow-2xl">
              {/* Logo Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="relative w-24 h-24 mx-auto mb-6"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full blur-lg opacity-40 animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                  <div className="absolute inset-2 border-2 border-white/30 rounded-full"></div>
                  <Crown className="h-12 w-12 text-white drop-shadow-lg relative z-10" />
                  <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full opacity-80 animate-ping"></div>
                  <div className="absolute bottom-2 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse"></div>
                </div>
              </motion.div>

              {/* Brand Name */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 relative">
                  <span className="relative z-10">Fitness Club</span>
                  <div className="absolute inset-0 text-pink-500/20 blur-sm">
                    Fitness Club
                  </div>
                </h1>

                <div className="flex items-center justify-center mb-3">
                  <div className="w-8 h-px bg-pink-500"></div>
                  <div className="w-2 h-2 bg-pink-500 rotate-45 mx-3"></div>
                  <div className="w-8 h-px bg-pink-500"></div>
                </div>

                <p className="text-lg text-gray-600 font-medium">Royal Gym</p>
              </motion.div>

              {/* Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  Chào Mừng Trở Lại
                </h2>
                <p className="text-gray-600 text-base leading-relaxed">
                  Đăng nhập để tiếp tục hành trình fitness của bạn
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-blue-400/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/95 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border-2 border-pink-200/20">
            {/* Login Form */}
            <div className="p-8">
              <motion.form
                onSubmit={handleLogin}
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="mr-2 text-pink-500" />
                    Email / Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="pl-12 w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Nhập email hoặc username"
                      required
                      autoComplete="email"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Lock size={16} className="mr-2 text-pink-500" />
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 placeholder-gray-400 backdrop-blur-sm"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-pink-500 focus:outline-none transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-center justify-between"
                  variants={itemVariants}
                >
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-gray-600"
                    >
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <div>
                    <Link
                      to="/forgot-password"
                      className="font-medium text-pink-600 hover:text-pink-500 transition-colors"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border-2 border-red-200 flex items-start"
                  >
                    <Shield className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 flex justify-center items-center bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white rounded-2xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-lg group ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        <span>Đang đăng nhập...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-5 w-5" />
                        <span>Đăng nhập</span>
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.form>
            </div>

            {/* Sign Up Link */}
            <motion.div
              className="bg-gray-50 px-8 py-6 border-t-2 border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p className="text-center text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  to="/sign-up"
                  className="font-semibold text-pink-600 hover:text-pink-500 transition-colors"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-8 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Bằng việc đăng nhập, bạn đồng ý với{" "}
          <a href="#" className="text-pink-600 hover:text-pink-500">
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a href="#" className="text-pink-600 hover:text-pink-500">
            Chính sách bảo mật
          </a>
        </motion.div>
      </div>
    </div>
  );
}
