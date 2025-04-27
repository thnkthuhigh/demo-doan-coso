import { useState, useEffect } from "react";
import GymImageGallery from "../Club/Banner";
import axios from "axios";

export default function Club() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API lấy danh sách CLB từ backend
    const fetchClubs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clubs");
        setClubs(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách CLB:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mt-6 mb-4">
        HỆ THỐNG CÂU LẠC BỘ
      </h1>
      <p className="text-2xl text-center text-gray-600 italic mt-4 mb-6">
        "Chinh phục sức khỏe, vươn tới đỉnh cao cùng chúng tôi!"
      </p>

      <GymImageGallery />

      {/* Hiển thị danh sách CLB */}
      {loading ? (
        <p className="text-center text-gray-600">Đang tải danh sách CLB...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <img
                src={club.image}
                alt={club.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-bold">{club.name}</h2>
                <p className="text-sm text-gray-600">{club.address}</p>
                <p className="text-base">{club.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form đăng ký tư vấn */}
      <div className="bg-gray-100 p-6 rounded-2xl shadow-md max-w-xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4">Đăng ký tư vấn</h3>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Họ và tên"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Số điện thoại"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Nội dung quan tâm"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Gửi đăng ký
          </button>
        </form>
      </div>
    </div>
  );
}
