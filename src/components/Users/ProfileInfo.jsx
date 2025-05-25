import React from "react";
import { motion } from "framer-motion";
import {
  Pencil,
  Save,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
} from "lucide-react";

function ProfileInfo({
  user,
  form,
  editMode,
  setEditMode,
  handleChange,
  handleSave,
  setForm,
  setPreviewUrl,
  setAvatar,
  cardVariants,
}) {
  return (
    <motion.div
      key="profile-info"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Thông tin cá nhân
        </h3>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex space-x-3">
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
              className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex items-center text-sm font-medium text-green-600 hover:text-green-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Lưu
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          {/* Full Name Field - New */}
          <div className="sm:col-span-2">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Họ và tên
            </label>
            {editMode ? (
              <input
                type="text"
                name="fullName"
                id="fullName"
                value={form.fullName || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            ) : (
              <div className="mt-1 text-gray-900">
                {user.fullName || "Chưa cập nhật"}
              </div>
            )}
          </div>

          {/* Username field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tên người dùng
            </label>
            {editMode ? (
              <input
                type="text"
                name="username"
                id="username"
                value={form.username || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            ) : (
              <div className="mt-1 text-gray-900">{user.username}</div>
            )}
          </div>

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            {editMode ? (
              <input
                type="email"
                name="email"
                id="email"
                value={form.email || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            ) : (
              <div className="mt-1 text-gray-900">{user.email}</div>
            )}
          </div>

          {/* Phone number field */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số điện thoại
            </label>
            {editMode ? (
              <input
                type="text"
                name="phone"
                id="phone"
                value={form.phone || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            ) : (
              <div className="mt-1 text-gray-900">
                {user.phone || "Chưa cập nhật"}
              </div>
            )}
          </div>

          {/* Date of birth field */}
          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngày sinh
            </label>
            {editMode ? (
              <input
                type="date"
                name="dob"
                id="dob"
                value={form.dob || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            ) : (
              <div className="mt-1 text-gray-900">
                {user.dob?.split("T")[0] || "Chưa cập nhật"}
              </div>
            )}
          </div>

          {/* Address Field - New */}
          <div className="sm:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Địa chỉ
            </label>
            {editMode ? (
              <input
                type="text"
                name="address"
                id="address"
                value={form.address || ""}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            ) : (
              <div className="mt-1 text-gray-900">
                {user.address || "Chưa cập nhật"}
              </div>
            )}
          </div>

          {/* Gender field */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Giới tính
            </label>
            {editMode ? (
              <select
                name="gender"
                id="gender"
                value={form.gender || "other"}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            ) : (
              <div className="mt-1 text-gray-900">
                {user.gender === "male"
                  ? "Nam"
                  : user.gender === "female"
                  ? "Nữ"
                  : "Khác"}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfileInfo;
