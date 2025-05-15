import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
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
import { motion, AnimatePresence } from "framer-motion";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [section, setSection] = useState("profile"); // 'profile' or 'password'
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const decoded = jwtDecode(token);
        const res = await axios.get(
          `http://localhost:5000/api/users/${decoded.userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(res.data);
        setForm({
          ...res.data,
          dob: res.data.dob ? res.data.dob.split("T")[0] : "",
        });

        if (res.data.avatar) {
          setPreviewUrl(res.data.avatar);
        }
      } catch (err) {
        console.error("Lỗi khi lấy thông tin:", err);
        alert("Không thể tải thông tin người dùng.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      let data = form;
      if (avatar) {
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("avatar", avatar);
        data = formData;
      }

      await axios.put(`http://localhost:5000/api/users/${user._id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": avatar ? "multipart/form-data" : "application/json",
        },
      });

      setUser({ ...form, avatar: previewUrl });
      setEditMode(false);
      setAvatar(null);

      const notification = document.getElementById("notification");
      if (notification) {
        notification.classList.remove("opacity-0");
        notification.classList.add("opacity-100");
        setTimeout(() => {
          notification.classList.remove("opacity-100");
          notification.classList.add("opacity-0");
        }, 3000);
      }
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/users/${user._id}/password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Cập nhật mật khẩu thành công!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Lỗi cập nhật mật khẩu:", err);
      alert("Cập nhật mật khẩu thất bại.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-violet-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-purple-800 font-medium text-lg">
            Đang tải thông tin người dùng...
          </div>
        </div>
      </div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-violet-50 to-purple-300 pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div
        id="notification"
        className="fixed top-24 right-4 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg flex items-center opacity-0 transition-opacity duration-300 z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span>Cập nhật thành công!</span>
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hồ sơ cá nhân
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Xem và cập nhật thông tin cá nhân của bạn
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
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
                      <img
                        src={previewUrl}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-100">
                        <User size={48} className="text-purple-500" />
                      </div>
                    )}
                    {editMode && (
                      <label className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 cursor-pointer">
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
                          className="opacity-0 absolute inset-0"
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
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <span className="font-medium">Lớp học của tôi</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="md:w-2/3">
            <AnimatePresence mode="wait">
              {section === "profile" ? (
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
              ) : (
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <input
                          name="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          placeholder="Nhập mật khẩu hiện tại"
                          className="w-full rounded-xl pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 ring-purple-200 focus:border-purple-400 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-gray-500 font-medium">
                        Mật khẩu mới
                      </label>
                      <div className="relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
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
                        <input
                          name="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          required
                          placeholder="Nhập mật khẩu mới"
                          className="w-full rounded-xl pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 ring-purple-200 focus:border-purple-400 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-gray-500 font-medium">
                        Nhập lại mật khẩu mới
                      </label>
                      <div className="relative">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        <input
                          name="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          placeholder="Nhập lại mật khẩu mới"
                          className="w-full rounded-xl pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-800 focus:outline-none focus:ring-2 ring-purple-200 focus:border-purple-400 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="mt-6 p-5 bg-yellow-50 rounded-xl border border-yellow-100">
                      <div className="flex items-start">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-yellow-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-semibold text-yellow-800">
                            Lưu ý về mật khẩu
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ
                            hoa, chữ thường, số và ký tự đặc biệt.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white py-3 rounded-xl font-medium transition shadow-sm"
                      >
                        Cập nhật mật khẩu
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-white rounded-2xl p-6 shadow-md border border-gray-200"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-violet-100 p-2 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-violet-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-800">
                    Quản lý lớp học
                  </h3>
                  <p className="text-gray-500">
                    Xem các lớp học đã đăng ký và lịch tập luyện
                  </p>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={() => navigate("/my-classes")}
                    className="px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition font-medium"
                  >
                    Xem lớp học
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
