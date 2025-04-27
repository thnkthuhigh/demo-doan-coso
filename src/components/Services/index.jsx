import { useState, useEffect } from "react";
import GymImageGallery from "../Club/Banner";
import axios from "axios";

export default function ServicePage() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceName: "",
    startDate: "",
    notes: "",
  });

  // Gọi API để lấy danh sách dịch vụ
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/services");
        setServices(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      }
    };

    fetchServices();
  }, []);

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
