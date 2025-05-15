import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Calendar,
  ChevronRight,
  UserCheck,
  ArrowLeft,
} from "lucide-react";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Xóa lỗi khi người dùng thay đổi input
    setError("");
  };

  const validateStep1 = () => {
    if (!formData.username.trim()) {
      setError("Vui lòng nhập tên người dùng");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Vui lòng nhập email");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Email không hợp lệ");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      setError("Vui lòng nhập mật khẩu");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu không khớp");
      return false;
    }
    if (!formData.dob) {
      setError("Vui lòng chọn ngày sinh");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    const { username, email, phone, password, dob, gender } = formData;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          username: username.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          dob: new Date(dob).toISOString(),
          gender: gender || "other",
        }
      );

      if (response.status === 201) {
        // Hiển thị success animation
        setStep(3);

        // Redirect sau 2 giây
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during signup", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Đã xảy ra lỗi. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
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
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  // Render form step 1
  const renderStep1 = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <motion.h3
        variants={itemVariants}
        className="text-xl font-semibold text-gray-800 mb-1"
      >
        Thông tin cá nhân
      </motion.h3>

      <motion.p variants={itemVariants} className="text-sm text-gray-500 mb-6">
        Nhập thông tin của bạn để bắt đầu
      </motion.p>

      <motion.div variants={itemVariants} className="mb-4">
        <label
          htmlFor="username"
          className="flex items-center text-sm font-medium text-gray-700 mb-1"
        >
          <User size={16} className="mr-2 text-purple-500" />
          Tên người dùng
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
          placeholder="Nhập tên người dùng của bạn"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-4">
        <label
          htmlFor="email"
          className="flex items-center text-sm font-medium text-gray-700 mb-1"
        >
          <Mail size={16} className="mr-2 text-purple-500" />
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
          placeholder="example@email.com"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-4">
        <label
          htmlFor="phone"
          className="flex items-center text-sm font-medium text-gray-700 mb-1"
        >
          <Phone size={16} className="mr-2 text-purple-500" />
          Số điện thoại
        </label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
          placeholder="Nhập số điện thoại của bạn"
        />
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mt-6">
        <button
          type="button"
          onClick={nextStep}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition duration-300 flex items-center justify-center text-base font-medium shadow-md"
        >
          Tiếp tục
          <ChevronRight size={18} className="ml-1" />
        </button>
      </motion.div>
    </motion.div>
  );

  // Render form step 2
  const renderStep2 = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center mb-2">
        <button
          onClick={prevStep}
          className="text-gray-500 hover:text-purple-600 transition p-1 rounded-full hover:bg-purple-50"
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-xl font-semibold text-gray-800 ml-2">
          Bảo mật & Thông tin bổ sung
        </h3>
      </motion.div>

      <motion.p variants={itemVariants} className="text-sm text-gray-500 mb-6">
        Hoàn tất đăng ký tài khoản của bạn
      </motion.p>

      <motion.div variants={itemVariants} className="mb-4">
        <label
          htmlFor="password"
          className="flex items-center text-sm font-medium text-gray-700 mb-1"
        >
          <Lock size={16} className="mr-2 text-purple-500" />
          Mật khẩu
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
          placeholder="••••••••"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-4">
        <label
          htmlFor="confirmPassword"
          className="flex items-center text-sm font-medium text-gray-700 mb-1"
        >
          <Lock size={16} className="mr-2 text-purple-500" />
          Xác nhận mật khẩu
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
          placeholder="••••••••"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-4">
        <label
          htmlFor="dob"
          className="flex items-center text-sm font-medium text-gray-700 mb-1"
        >
          <Calendar size={16} className="mr-2 text-purple-500" />
          Ngày sinh
        </label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="mb-4">
        <label
          htmlFor="gender"
          className="flex items-center text-sm font-medium text-gray-700 mb-1"
        >
          <UserCheck size={16} className="mr-2 text-purple-500" />
          Giới tính
        </label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-3 border border-gray-200 rounded-xl mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 appearance-none"
        >
          <option value="">Chọn giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 flex-shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition duration-300 flex items-center justify-center text-base font-medium shadow-md ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang đăng ký...
            </>
          ) : (
            "Đăng ký"
          )}
        </button>
      </motion.div>
    </motion.div>
  );

  // Render success step
  const renderSuccess = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="w-20 h-20 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-6"
      >
        <svg
          className="w-12 h-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        Đăng ký thành công!
      </h3>
      <p className="text-gray-600 mb-6">
        Bạn sẽ được chuyển đến trang đăng nhập.
      </p>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-500"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2 }}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
              Đăng ký tài khoản
            </h2>
            <p className="mt-2 text-gray-600">
              Tạo tài khoản để truy cập vào hệ thống của chúng tôi
            </p>
          </motion.div>
        </div>

        <motion.div
          className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderSuccess()}
          </form>

          {step !== 3 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-purple-600 font-medium hover:text-purple-800 transition-colors"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          Bằng việc đăng ký, bạn đồng ý với{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-800">
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a href="#" className="text-indigo-600 hover:text-indigo-800">
            Chính sách bảo mật
          </a>{" "}
          của chúng tôi.
        </motion.div>
      </div>
    </div>
  );
}

export default SignUp;
