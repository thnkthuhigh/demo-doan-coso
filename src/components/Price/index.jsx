import { useState } from "react";
import GymImageGallery from "../Club/Banner";

const pricingPlans = [
  {
    name: "Gói Cơ Bản",
    duration: "1 tháng",
    totalCost: "1,980,000 VNĐ",
    costPerMonth: "1,980,000 VNĐ",
    costPerDay: "66,000 VNĐ",
    features: [
      "Tập luyện tại 01 CLB đã chọn.",
      "Tham gia Yoga và Group X tại 01 CLB đã chọn.",
      "1 buổi định hướng luyện tập và tư vấn dinh dưỡng.",
      "Sử dụng dịch vụ thư giãn (sauna, steambath).",
      "Nước uống miễn phí.",
      "Khăn tập thể thao cao cấp.",
    ],
  },
  {
    name: "Gói Cơ Bản Nâng Cao",
    duration: "3 tháng",
    totalCost: "5,400,000 VNĐ",
    costPerMonth: "1,800,000 VNĐ",
    costPerDay: "60,000 VNĐ",
    features: [
      "Tập luyện tại 01 CLB đã chọn.",
      "Tham gia Yoga và Group X tại 01 CLB đã chọn.",
      "Tự do tập luyện tại tất cả các câu lạc bộ trong hệ thống.",
      "Không giới hạn thời gian luyện tập.",
      "Sử dụng dịch vụ thư giãn sau luyện tập (sauna, steambath).",
      "Khăn tập thể thao cao cấp.",
      "Hệ thống khóa từ thông minh, bảo mật tối ưu.",
    ],
  },
  {
    name: "Gói Toàn Hệ Thống",
    duration: "6 tháng",
    totalCost: "10,800,000 VNĐ",
    costPerMonth: "1,800,000 VNĐ",
    costPerDay: "60,000 VNĐ",
    features: [
      "Tự do tập luyện tại tất cả các CLB trong hệ thống.",
      "Tham gia tất cả các lớp Yoga và Group X tại tất cả các CLB.",
      "Được dẫn theo 1 người thân đi tập.",
      "Nước uống miễn phí, khăn tập thể thao cao cấp.",
      "Ưu tiên đặt chỗ các lớp Yoga và GroupX trước 48 tiếng.",
    ],
  },
  {
    name: "Gói Cao Cấp",
    duration: "12 tháng",
    totalCost: "23,760,000 VNĐ",
    costPerMonth: "1,980,000 VNĐ",
    costPerDay: "66,000 VNĐ",
    features: [
      "Sử dụng dịch vụ thư giãn (sauna, steambath).",
      "Tập luyện tự do tại tất cả các CLB trong hệ thống.",
      "Tham gia tất cả các lớp Yoga và Group X.",
      "1 lần chuyển nhượng cho người thân trong gia đình.",
      "Khóa từ thông minh bảo mật tối ưu.",
      "Tặng 01 ly nước trái cây hoặc ly sinh tố dinh dưỡng.",
    ],
  },
  {
    name: "Gói Đặc Quyền",
    duration: "15 tháng",
    totalCost: "29,700,000 VNĐ",
    costPerMonth: "1,980,000 VNĐ",
    costPerDay: "66,000 VNĐ",
    features: [
      "Được sử dụng dịch vụ thư giãn (sauna, steambath).",
      "Được dẫn theo 2 khách không cố định đi tập.",
      "Bộ đồ dùng tắm gội cao cấp.",
      "Ưu tiên đặt chỗ các lớp Yoga và GroupX trước 48 tiếng.",
      "Tặng ly nước trái cây hoặc ly sinh tố dinh dưỡng.",
      "Khóa từ thông minh bảo mật tối ưu.",
      "Tự do tập luyện tại tất cả các CLB trong hệ thống.",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="p-6 space-y-10">
      {/* Banner */}
      <GymImageGallery />

      {/* Tiêu đề nằm dưới banner */}
      <div className="text-center text-gray-800 mt-6">
        <h1 className="text-5xl font-bold">Chính Sách Giá</h1>
        <p className="text-xl mt-4">
          Lựa chọn gói tập gym phù hợp với nhu cầu và mục tiêu của bạn
        </p>

        {/* Thông báo bảng giá tham khảo */}
        <div className="mt-4 text-sm text-yellow-500 italic">
          <p>
            Đây là bảng giá tham khảo, vui lòng liên hệ trực tiếp để biết thông
            tin chi tiết.
          </p>
        </div>
      </div>

      {/* Thông tin chi tiết các gói */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
          >
            <div className="p-4">
              <h3 className="text-xl font-semibold text-center">{plan.name}</h3>
              <div className="mt-4 space-y-2">
                <p className="text-gray-600">
                  Thời gian tập luyện: {plan.duration}
                </p>
                <p className="text-gray-600">Tổng chi phí: {plan.totalCost}</p>
                <p className="text-gray-600">
                  Chi phí / tháng: {plan.costPerMonth}
                </p>
                <p className="text-gray-600">
                  Chi phí / ngày: {plan.costPerDay}
                </p>
              </div>
              <ul className="mt-4 space-y-2 text-gray-700">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-600 mr-2">✔</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
