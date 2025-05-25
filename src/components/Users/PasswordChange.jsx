import React from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

const PasswordChange = ({ passwordForm, handlePasswordChange, handlePasswordSubmit, cardVariants }) => {
  return (
    <motion.div
      key="password"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      className="bg-white rounded-3xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Đổi mật khẩu
      </h2>

      <form onSubmit={handlePasswordSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="text-sm text-gray-500 font-medium">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
              className="w-full rounded-xl pl-4 pr-10 py-3 border text-gray-800 focus:outline-none transition-all duration-200 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-500 font-medium">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
              className="w-full rounded-xl pl-4 pr-10 py-3 border text-gray-800 focus:outline-none transition-all duration-200 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-500 font-medium">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
              className="w-full rounded-xl pl-4 pr-10 py-3 border text-gray-800 focus:outline-none transition-all duration-200 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-5 py-3 rounded-xl shadow-sm transition font-medium"
        >
          <Save size={18} />
          Lưu mật khẩu
        </button>
      </form>
    </motion.div>
  );
};

export default PasswordChange;