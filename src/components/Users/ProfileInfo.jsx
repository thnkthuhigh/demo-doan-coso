import React from "react";
import { motion } from "framer-motion";
import { Pencil, Save, X, User, Mail, Phone, Calendar, MapPin } from "lucide-react";

const ProfileInfo = ({ 
  user, 
  form, 
  editMode, 
  setEditMode, 
  handleChange, 
  handleSave, 
  setForm, 
  setPreviewUrl, 
  setAvatar, 
  cardVariants 
}) => {
  return (
    <motion.div
      key="profile"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      className="bg-white rounded-3xl shadow-xl p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Thông tin cá nhân
        </h2>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-5 py-2 rounded-xl shadow-sm transition font-medium"
          >
            <Pencil size={18} />
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow-sm transition font-medium"
            >
              <Save size={18} />
              Lưu
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setForm({
                  ...user,
                  dob: user.dob ? user.dob.split("T")[0] : "",
                });
                setPreviewUrl(user.avatar || "");
                setAvatar(null);
              }}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl shadow-sm transition font-medium"
            >
              <X size={18} />
              Hủy
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm text-gray-500 font-medium">
              Họ và tên
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                name="username"
                type="text"
                value={form.username || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full rounded-xl pl-10 pr-4 py-3 border text-gray-800 focus:outline-none transition-all duration-200 ${
                  editMode
                    ? "bg-white border-purple-400 focus:ring-2 ring-purple-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-500 font-medium">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                name="email"
                type="email"
                value={form.email || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full rounded-xl pl-10 pr-4 py-3 border text-gray-800 focus:outline-none transition-all duration-200 ${
                  editMode
                    ? "bg-white border-purple-400 focus:ring-2 ring-purple-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-500 font-medium">
              Số điện thoại
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                name="phone"
                type="text"
                value={form.phone || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full rounded-xl pl-10 pr-4 py-3 border text-gray-800 focus:outline-none transition-all duration-200 ${
                  editMode
                    ? "bg-white border-purple-400 focus:ring-2 ring-purple-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-500 font-medium">
              Ngày sinh
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                name="dob"
                type="date"
                value={form.dob || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full rounded-xl pl-10 pr-4 py-3 border text-gray-800 focus:outline-none transition-all duration-200 ${
                  editMode
                    ? "bg-white border-purple-400 focus:ring-2 ring-purple-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-500 font-medium">
              Địa chỉ
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                name="address"
                type="text"
                value={form.address || ""}
                onChange={handleChange}
                disabled={!editMode}
                placeholder="Nhập địa chỉ của bạn"
                className={`w-full rounded-xl pl-10 pr-4 py-3 border text-gray-800 focus:outline-none transition-all duration-200 ${
                  editMode
                    ? "bg-white border-purple-400 focus:ring-2 ring-purple-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-500 font-medium">
              Giới tính
            </label>
            <select
              name="gender"
              value={form.gender || "other"}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full rounded-xl px-4 py-3 border text-gray-800 focus:outline-none transition-all duration-200 ${
                editMode
                  ? "bg-white border-purple-400 focus:ring-2 ring-purple-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>

        {!editMode && (
          <div className="mt-6 p-5 bg-purple-50 rounded-xl border border-purple-100">
            <div className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-semibold text-purple-800">
                  Thông tin của bạn được bảo mật
                </h4>
                <p className="text-sm text-purple-600 mt-1">
                  Chúng tôi chỉ sử dụng thông tin của bạn cho mục
                  đích quản lý tài khoản và không chia sẻ cho bất kỳ
                  bên thứ ba nào mà không có sự cho phép của bạn.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfileInfo;