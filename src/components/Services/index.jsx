import { useState } from "react";
import GymImageGallery from "../Club/Banner";
// Dữ liệu các dịch vụ của phòng gym
const services = [
  {
    name: "FITNESS",
    image: "/fitness.jpg",
    description:
      "Dịch vụ tập gym cá nhân với huấn luyện viên chuyên nghiệp, giúp bạn đạt được mục tiêu sức khỏe nhanh chóng.",
  },
  {
    name: "DANCE COVER",
    image: "/dancecover.jpg",
    description:
      "Lớp học Dance Cover giúp bạn vừa tập thể dục vừa thể hiện phong cách nhảy riêng biệt.",
  },
  {
    name: "ZUMBA",
    image: "/zumba.jpg",
    description:
      "Zumba là môn thể dục nhịp điệu vui nhộn giúp bạn giảm cân và tăng cường sức bền.",
  },
  {
    name: "PERSONAL TRAINER",
    image: "/trainer.jpg",
    description:
      "Dịch vụ huấn luyện viên cá nhân giúp bạn xây dựng kế hoạch tập luyện phù hợp với mục tiêu của mình.",
  },
  {
    name: "YOGA",
    image: "/yoga.jpg",
    description:
      "Yoga giúp bạn tăng cường sự dẻo dai, thư giãn tinh thần và cải thiện sức khỏe tổng thể.",
  },
  {
    name: "MUAY THAI",
    image: "/muaythai.jpg",
    description:
      "Muay Thai là môn thể thao võ thuật giúp bạn rèn luyện sức mạnh và khả năng phòng thủ bản thân.",
  },
  {
    name: "BOXING",
    image: "/boxing.jpg",
    description:
      "Lớp học Boxing giúp bạn cải thiện thể lực, sức mạnh và kỹ năng tự vệ hiệu quả.",
  },
  {
    name: "CYCLING",
    image: "/cyclling.jpg",
    description:
      "Dịch vụ đạp xe giúp bạn cải thiện sức bền, giảm mỡ và giữ dáng thon gọn.",
  },
];

export default function ServicePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceName: "",
    startDate: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Thực hiện logic gửi đăng ký dịch vụ ở đây (ví dụ: gửi dữ liệu tới backend)
    alert(
      `Đăng ký thành công dịch vụ: ${
        formData.serviceName
      } với thông tin: ${JSON.stringify(formData)}`
    );
  };

  return (
    <div className="p-6 space-y-10">
      {/* Banner */}
      <GymImageGallery />
      {/* Danh sách dịch vụ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
          >
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-4 space-y-3">
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form đăng ký dịch vụ */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-md max-w-xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4 text-center">
          Đăng Ký Dịch Vụ
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="fullName"
            placeholder="Họ và Tên"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Chọn Dịch Vụ</option>
            {services.map((service, index) => (
              <option key={index} value={service.name}>
                {service.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="notes"
            placeholder="Ghi chú thêm (nếu có)"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            Gửi Đăng Ký
          </button>
        </form>
      </div>
    </div>
  );
}
