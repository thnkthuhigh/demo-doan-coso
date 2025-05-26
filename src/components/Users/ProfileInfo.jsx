import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Upload, X } from "lucide-react";

function ProfileInfo({
  user,
  form,
  editMode,
  setEditMode,
  handleChange,
  handleSave,
  setForm,
  setPreviewUrl,
  previewUrl,
  setAvatar,
  avatar,
  cardVariants,
}) {
  const fileInputRef = useRef(null);

  // Add debug logging to track avatar data
  useEffect(() => {
    if (user?.avatar) {
      console.log("ProfileInfo received user avatar:", user.avatar);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file.name);
      setAvatar(file);
      // Create a URL for preview
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl("");
    setAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Log the user object whenever it changes
  useEffect(() => {
    console.log("User object updated:", user);
  }, [user]);

  // Log the form state whenever it changes
  useEffect(() => {
    console.log("Form state updated:", form);
  }, [form]);

  // Log the editMode state whenever it changes
  useEffect(() => {
    console.log("Edit mode changed:", editMode);
  }, [editMode]);

  // Log the previewUrl state whenever it changes
  useEffect(() => {
    console.log("Preview URL changed:", previewUrl);
  }, [previewUrl]);

  // Log the avatar state whenever it changes
  useEffect(() => {
    console.log("Avatar state changed:", avatar);
  }, [avatar]);

  // Check if the avatar URL is valid and the image loads correctly
  useEffect(() => {
    if (user?.avatar?.url) {
      console.log("Avatar URL from user object:", user.avatar.url);
      // Test if the image is accessible by creating a temporary image
      const testImg = new Image();
      testImg.onload = () => console.log("Avatar image loaded successfully");
      testImg.onerror = () => console.error("Failed to load avatar image");
      testImg.src = user.avatar.url;
    }
  }, [user]);

  return (
    <motion.div
      key="profile-info"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      {/* Header section */}
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
                setPreviewUrl(""); // Reset preview URL instead of setting it to user.avatar
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
        {/* Avatar upload section */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-2">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                />
              ) : user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Failed to load avatar:", user.avatar.url);
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.username || "User"
                    )}&background=6d28d9&color=fff&size=100`;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-500">
                  <User size={32} />
                </div>
              )}
            </div>

            {editMode && (
              <div className="absolute bottom-0 right-0 flex space-x-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-purple-600 text-white p-1 rounded-full shadow hover:bg-purple-700"
                >
                  <Upload size={16} />
                </button>

                {(previewUrl || user.avatar?.url) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {editMode && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          )}

          {/* Display avatar URL for debugging */}
          {user?.avatar?.url && (
            <div className="mt-1 text-xs text-gray-400 max-w-[240px] truncate">
              {user.avatar.url}
            </div>
          )}
        </div>

        {/* Rest of the form fields */}
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
