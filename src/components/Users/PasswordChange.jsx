import React, { useState } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff } from "lucide-react";
import axios from "axios";

const PasswordChange = ({
  passwordForm,
  handlePasswordChange,
  handlePasswordSubmit,
  cardVariants,
}) => {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setNotification({
        message: "Mật khẩu mới và xác nhận mật khẩu không khớp",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/users/change-password",
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotification({
        message: "Đổi mật khẩu thành công!",
        type: "success",
      });

      // Reset form
      handlePasswordChange({ target: { name: "currentPassword", value: "" } });
      handlePasswordChange({ target: { name: "newPassword", value: "" } });
      handlePasswordChange({ target: { name: "confirmPassword", value: "" } });
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu";
      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }

    // Auto hide notification
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 5000);
  };

  return (
    <motion.div
      key="password"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      className="bg-white rounded-3xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h2>

      {/* Notification */}
      {notification.message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            notification.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="text-sm text-gray-500 font-medium">
            Mật khẩu hiện tại <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="currentPassword"
              type={showPassword.current ? "text" : "password"}
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
              className="w-full rounded-xl pl-4 pr-12 py-3 border text-gray-800 focus:outline-none transition-all duration-200 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Nhập mật khẩu hiện tại"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-500 font-medium">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="newPassword"
              type={showPassword.new ? "text" : "password"}
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
              minLength="6"
              className="w-full rounded-xl pl-4 pr-12 py-3 border text-gray-800 focus:outline-none transition-all duration-200 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-500 font-medium">
            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              name="confirmPassword"
              type={showPassword.confirm ? "text" : "password"}
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
              className="w-full rounded-xl pl-4 pr-12 py-3 border text-gray-800 focus:outline-none transition-all duration-200 bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl shadow-sm transition font-medium ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700"
          } text-white`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Đang xử lý...
            </>
          ) : (
            <>
              <Save size={18} />
              Lưu mật khẩu
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default PasswordChange;
