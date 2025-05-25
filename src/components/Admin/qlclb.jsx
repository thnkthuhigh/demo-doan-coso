import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminClubManager() {
  const [clubs, setClubs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    image: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = "http://localhost:5000/api/clubs";

  // Lấy dữ liệu CLB từ backend khi component mount
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(apiUrl);
        setClubs(response.data);
      } catch (error) {
        console.error("Error fetching clubs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClubs();
  }, []);

  // Xử lý thay đổi form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý gửi form (thêm hoặc cập nhật CLB)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updatedClub = { ...formData };
        await axios.put(`${apiUrl}/${clubs[editIndex]._id}`, updatedClub);
        const updatedClubs = [...clubs];
        updatedClubs[editIndex] = updatedClub;
        setClubs(updatedClubs);
        setIsEditing(false);
        setEditIndex(null);
      } else {
        const newClub = { ...formData };
        const response = await axios.post(apiUrl, newClub);
        setClubs([...clubs, response.data]);
      }
      setFormData({ name: "", address: "", image: "", description: "" });

      // Show notification
      showNotification(
        isEditing ? "Cập nhật CLB thành công!" : "Thêm CLB mới thành công!"
      );
    } catch (error) {
      console.error("Error:", error);
      showNotification("Đã xảy ra lỗi, vui lòng thử lại!", "error");
    }
  };

  // Xử lý chỉnh sửa CLB
  const handleEdit = (index) => {
    setFormData(clubs[index]);
    setIsEditing(true);
    setEditIndex(index);

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Xử lý xóa CLB
  const handleDelete = async (index) => {
    const confirmDelete = confirm("Bạn có chắc muốn xóa CLB này?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${apiUrl}/${clubs[index]._id}`);
      const updatedClubs = [...clubs];
      updatedClubs.splice(index, 1);
      setClubs(updatedClubs);
      showNotification("Đã xóa CLB thành công!");
    } catch (error) {
      console.error("Error deleting club:", error);
      showNotification("Không thể xóa CLB, vui lòng thử lại!", "error");
    }
  };

  // Function to show notification
  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 ease-in-out z-50 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => document.body.removeChild(notification), 500);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Quản lý CLB Gym
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Thêm, chỉnh sửa và quản lý các câu lạc bộ gym
          </p>
        </div>

        {/* Form Thêm/Sửa */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">
            {isEditing ? "Chỉnh sửa thông tin CLB" : "Thêm CLB mới"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên CLB
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nhập tên CLB"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Nhập địa chỉ CLB"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL ảnh
              </label>
              <input
                type="text"
                name="image"
                placeholder="Nhập đường dẫn ảnh đại diện"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                placeholder="Mô tả chi tiết về CLB"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
              >
                {isEditing ? "Cập nhật CLB" : "Thêm CLB"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditIndex(null);
                    setFormData({
                      name: "",
                      address: "",
                      image: "",
                      description: "",
                    });
                  }}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Danh sách CLB */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club, index) => (
            <div
              key={club._id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border border-gray-100"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6 space-y-3">
                <h2 className="text-xl font-bold text-gray-900">{club.name}</h2>
                <p className="text-sm text-gray-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {club.address}
                </p>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {club.description}
                </p>
                <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-600 hover:text-red-800 transition-colors flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {clubs.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="mt-4 text-xl font-medium text-gray-500">
              Chưa có CLB nào được thêm vào
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
