import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Import components
import ProfileSidebar from "./ProfileSidebar";
import ProfileInfo from "./ProfileInfo";
import PasswordChange from "./PasswordChange";
import MembershipCard from "./MembershipCard";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [section, setSection] = useState("profile"); // 'profile', 'password', or 'membership'
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

        // Add simulated membership data for testing
        const userData = {
          ...res.data,
          membership: {
            id: "MEM" + Math.floor(10000 + Math.random() * 90000),
            type: "Standard", // or 'VIP'
            startDate: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000
            ).toISOString(), // 30 days ago
            endDate: new Date(
              Date.now() + 60 * 24 * 60 * 60 * 1000
            ).toISOString(), // 60 days from now
          },
        };

        setUser(userData);
        setForm({
          ...userData,
          dob: userData.dob ? userData.dob.split("T")[0] : "",
        });

        if (userData.avatar) {
          setPreviewUrl(userData.avatar);
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
            <ProfileSidebar
              user={user}
              previewUrl={previewUrl}
              section={section}
              setSection={setSection}
              editMode={editMode}
              handleAvatarChange={handleAvatarChange}
              cardVariants={cardVariants}
            />
          </div>

          <div className="md:w-2/3">
            <AnimatePresence mode="wait">
              {section === "profile" ? (
                <ProfileInfo
                  user={user}
                  form={form}
                  editMode={editMode}
                  setEditMode={setEditMode}
                  handleChange={handleChange}
                  handleSave={handleSave}
                  setForm={setForm}
                  setPreviewUrl={setPreviewUrl}
                  setAvatar={setAvatar}
                  cardVariants={cardVariants}
                />
              ) : section === "membership" ? (
                <MembershipCard user={user} cardVariants={cardVariants} />
              ) : (
                <PasswordChange
                  passwordForm={passwordForm}
                  handlePasswordChange={handlePasswordChange}
                  handlePasswordSubmit={handlePasswordSubmit}
                  cardVariants={cardVariants}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
