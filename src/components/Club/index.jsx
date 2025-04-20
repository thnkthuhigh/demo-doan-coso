import { useState, useEffect } from "react";
import GymImageGallery from "../Club/Banner";

const clubs = [
  {
    name: "CLB Fitness Center A",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    image: "/images/club1.jpg",
    description: "Phòng tập hiện đại, huấn luyện viên chuyên nghiệp.",
  },
  {
    name: "CLB Gym Pro B",
    address: "456 Nguyễn Huệ, Quận 3, TP.HCM",
    image: "/images/club2.jpg",
    description: "Trang thiết bị đầy đủ, không gian rộng rãi.",
  },
  {
    name: "CLB BodyFit C",
    address: "789 Trần Hưng Đạo, Quận 5, TP.HCM",
    image: "/images/club3.jpg",
    description: "Môi trường thân thiện, lịch tập linh hoạt.",
  },
  {
    name: "CLB MaxFit D",
    address: "101 Hai Bà Trưng, Quận 1, TP.HCM",
    image: "/images/club4.jpg",
    description: "Chế độ tập luyện hiệu quả, hỗ trợ giảm cân.",
  },
  {
    name: "CLB FitWorld E",
    address: "202 Bùi Viện, Quận 1, TP.HCM",
    image: "/images/club5.jpg",
    description: "Cung cấp dịch vụ chăm sóc sức khỏe toàn diện.",
  },
  {
    name: "CLB PowerGym F",
    address: "303 Võ Thị Sáu, Quận 3, TP.HCM",
    image: "/images/club6.jpg",
    description: "Thiết bị tập luyện tiên tiến, huấn luyện viên tận tâm.",
  },
  {
    name: "CLB UltraGym G",
    address: "404 Lý Tự Trọng, Quận 1, TP.HCM",
    image: "/images/club7.jpg",
    description: "Đội ngũ huấn luyện viên giỏi, không gian tập rộng.",
  },
  {
    name: "CLB Fitness World H",
    address: "505 Lê Văn Sỹ, Quận 3, TP.HCM",
    image: "/images/club8.jpg",
    description: "Không gian thoải mái, phục vụ đầy đủ nhu cầu tập luyện.",
  },
  {
    name: "CLB MuscleMax I",
    address: "606 Trường Chinh, Quận Tân Bình, TP.HCM",
    image: "/images/club9.jpg",
    description: "Trang thiết bị hiện đại, các khóa học chuyên sâu.",
  },
];

export default function Club() {
  return (
    <div className="p-6 space-y-10">
      {/* Ảnh phòng gym */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mt-6 mb-4">
        HỆ THỐNG CÂU LẠC BỘ
      </h1>
      <p className="text-2xl text-center text-gray-600 italic mt-4 mb-6">
        "Chinh phục sức khỏe, vươn tới đỉnh cao cùng chúng tôi!"
      </p>
      <GymImageGallery />
      {/* Danh sách CLB */}
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
      {/* Form đăng ký */}
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
