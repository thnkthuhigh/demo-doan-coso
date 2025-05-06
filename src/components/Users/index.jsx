import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Pencil, Save, X } from "lucide-react";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:5000/api/users/${user._id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(form);
      setEditMode(false);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600 text-lg">
          Đang tải thông tin người dùng...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-3xl p-10">
        <h2 className="text-4xl font-bold text-center text-blue-700 mb-10">
          Hồ sơ người dùng
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "username", label: "Họ tên" },
            { name: "email", label: "Email" },
            { name: "phone", label: "Số điện thoại" },
            { name: "dob", label: "Ngày sinh" },
          ].map(({ name, label }) => (
            <div key={name} className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1">{label}</label>
              <input
                name={name}
                type={name === "dob" ? "date" : "text"}
                value={form[name] || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`rounded-xl px-4 py-2 border text-gray-800 focus:outline-none transition-all duration-200 ${
                  editMode
                    ? "bg-white border-blue-400 focus:ring-2 ring-blue-300"
                    : "bg-gray-100 border-gray-300"
                }`}
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-1">Giới tính</label>
            <select
              name="gender"
              value={form.gender || "other"}
              onChange={handleChange}
              disabled={!editMode}
              className={`rounded-xl px-4 py-2 border text-gray-800 focus:outline-none transition-all duration-200 ${
                editMode
                  ? "bg-white border-blue-400 focus:ring-2 ring-blue-300"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-4">
          {editMode ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition"
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
                }}
                className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-xl shadow-sm transition"
              >
                <X size={18} />
                Hủy
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-sm transition"
            >
              <Pencil size={18} />
              Chỉnh sửa
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
