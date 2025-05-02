import { useState, useEffect } from "react";
import GymImageGallery from "../Club/Banner";
import axios from "axios";
import { Link } from "react-router-dom";

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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Đăng ký thành công dịch vụ: ${
        formData.serviceName
      } với thông tin: ${JSON.stringify(formData)}`
    );
  };

  return (
    <div className="p-6 space-y-16">
      {/* Banner */}
      <GymImageGallery />

      {/* Tiêu đề + slogan */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          Khám Phá Các Dịch Vụ Hàng Đầu Của Chúng Tôi
        </h1>
        <p className="text-lg text-gray-600">
          Chăm Sóc Bạn Từ Tâm - Thay Đổi Từ Hình Thể Đến Cuộc Sống!
        </p>
      </div>

      {/* Danh sách dịch vụ */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <Link
            key={index}
            to={`/services/${service._id}`}
            className="hover:no-underline"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <div className="overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Form đăng ký dịch vụ */}
      <section className="bg-gray-100 p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
        <h3 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Đăng Ký Dịch Vụ
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="fullName"
            placeholder="Họ và Tên"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            required
            className="w-full p-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="notes"
            placeholder="Ghi chú thêm (nếu có)"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Gửi Đăng Ký
          </button>
        </form>
      </section>
    </div>
  );
}
