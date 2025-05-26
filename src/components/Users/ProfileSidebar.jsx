import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { motion } from "framer-motion";

const ProfileSidebar = ({
  user,
  previewUrl,
  section,
  setSection,
  editMode,
  handleAvatarChange,
  cardVariants,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="bg-white rounded-3xl shadow-xl overflow-hidden"
    >
      <div className="relative h-40 bg-gradient-to-r from-purple-600 to-violet-700">
        <div className="absolute -bottom-16 left-0 right-0 flex justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
            {previewUrl ? (
              // Show preview image when changing avatar
              <img
                src={previewUrl}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            ) : user?.avatar?.url ? (
              // Show existing user avatar from profile
              <img
                src={user.avatar.url}
                alt="User avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(
                    "Failed to load sidebar avatar:",
                    user.avatar.url
                  );
                  e.target.onerror = null;
                  // Replace with fallback user icon
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center bg-purple-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                  `;
                }}
              />
            ) : (
              // Fallback when no avatar is available
              <div className="w-full h-full flex items-center justify-center bg-purple-100">
                <User size={48} className="text-purple-500" />
              </div>
            )}
            {editMode && (
              <label className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 cursor-pointer hover:bg-opacity-60 transition-all">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs text-white mt-1">Đổi ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  className="opacity-0 absolute inset-0 cursor-pointer"
                  onChange={handleAvatarChange}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div className="pt-20 px-6 pb-6">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-1">
          {user.username}
        </h3>
        <p className="text-purple-600 text-center mb-6">{user.email}</p>

        {/* Rest of your sidebar code */}
        <div className="space-y-3">
          <button
            onClick={() => setSection("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
              section === "profile"
                ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                : "hover:bg-purple-50 text-gray-700"
            }`}
          >
            <User size={20} />
            <span className="font-medium">Thông tin cá nhân</span>
          </button>

          <button
            onClick={() => setSection("password")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
              section === "password"
                ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                : "hover:bg-purple-50 text-gray-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <span className="font-medium">Đổi mật khẩu</span>
          </button>

          <button
            onClick={() => setSection("membership")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
              section === "membership"
                ? "bg-gradient-to-r from-purple-600 to-violet-600 text-white"
                : "hover:bg-purple-50 text-gray-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
            <span className="font-medium">Thẻ thành viên</span>
          </button>

          <button
            onClick={() => navigate("/my-classes")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition hover:bg-purple-50 text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2M7 7h10"
              />
            </svg>
            <span className="font-medium">Lớp học của tôi</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileSidebar;
