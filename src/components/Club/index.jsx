import { useState, useEffect } from "react";
import GymImageGallery from "../Club/Banner";
import axios from "axios";

export default function Club() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="p-6 space-y-20">
      {/* Tiêu đề */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-800 uppercase tracking-wide">
          Hệ Thống Câu Lạc Bộ
        </h1>
        <p className="text-2xl text-gray-500 italic">
          "Chinh phục sức khỏe, vươn tới đỉnh cao cùng chúng tôi!"
        </p>
      </div>

      {/* Banner */}
      <GymImageGallery />

      {/* Danh sách CLB */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-500 animate-pulse text-lg">
            Đang tải danh sách CLB...
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {clubs.map((club, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={club.image}
                  alt={club.name}
                  className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  {club.name}
                </h2>
                <p className="text-sm text-gray-500">{club.address}</p>
                <p className="text-gray-700">{club.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form đăng ký tư vấn */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-10 rounded-3xl shadow-2xl max-w-2xl mx-auto text-white">
        <h3 className="text-3xl font-bold mb-8 text-center">
          Đăng Ký Tư Vấn Ngay
        </h3>
        <form className="space-y-5">
          <input
            type="text"
            placeholder="Họ và tên"
            required
            className="w-full p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
          <input
            type="tel"
            placeholder="Số điện thoại"
            required
            className="w-full p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
          <input
            type="text"
            placeholder="Nội dung quan tâm"
            className="w-full p-4 rounded-lg text-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full py-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transition duration-300"
          >
            Gửi Đăng Ký
          </button>
        </form>
      </div>
    </div>
  );
}
