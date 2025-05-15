import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import GymImageGallery from "../Club/Banner";
import RegistrationForm from "../Common/RegistrationForm";

export default function ServicePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/services");
        setServices(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách dịch vụ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80 z-10"></div>
        <div className="absolute inset-0">
          <GymImageGallery />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <motion.div
            className="text-center max-w-4xl px-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white uppercase tracking-wide mb-4 drop-shadow-lg">
              Dịch Vụ Hàng Đầu
            </h1>
            <p className="text-2xl sm:text-3xl text-white/90 italic font-light">
              "Chăm Sóc Bạn Từ Tâm - Thay Đổi Từ Hình Thể Đến Cuộc Sống!"
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30">
        {/* Tiêu đề phần - Di chuyển xuống để không bị chồng lên banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16 mt-8"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Khám Phá Các Dịch Vụ Của Chúng Tôi
          </h2>
          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp các dịch vụ chất lượng cao, được thiết kế riêng
            để đáp ứng mọi nhu cầu về thể hình và sức khỏe của bạn
          </p>
        </motion.div>

        {/* Danh sách dịch vụ */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 text-lg font-medium">
                Đang tải dịch vụ...
              </span>
            </div>
          </div>
        ) : (
          <motion.section
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="h-full"
                onClick={() => setSelectedService(service.name)}
              >
                <Link
                  to={`/services/${service.id || service._id}`}
                  className="hover:no-underline block h-full"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 h-full flex flex-col">
                    <div className="overflow-hidden h-64">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-4 flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-800">
                          {service.name}
                        </h3>
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                          Hot
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {service.description}
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <div className="flex justify-between items-center">
                        <div className="text-blue-600 font-bold group-hover:underline flex items-center">
                          Chi tiết
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                        {service.price && (
                          <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-lg font-medium">
                            {typeof service.price === "number"
                              ? service.price.toLocaleString("vi-VN") + " đ"
                              : service.price}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* Form đăng ký dịch vụ - Sử dụng component chung */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          id="registration-form"
        >
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Đăng Ký Dịch Vụ
            </h3>
            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="mt-4 text-gray-600">
              Điền thông tin để nhận tư vấn và ưu đãi đặc biệt
            </p>
          </div>

          <RegistrationForm
            services={services}
            selectedService={selectedService}
            formType="service"
          />
        </motion.div>

        {/* Thông tin bổ sung */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-24 text-center"
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Tại sao chọn dịch vụ của chúng tôi?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">
                Chất lượng hàng đầu
              </h4>
              <p className="text-gray-600">
                Cam kết mang đến dịch vụ tốt nhất với đội ngũ chuyên gia hàng
                đầu trong ngành thể hình và chăm sóc sức khỏe
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">
                Tiết kiệm thời gian
              </h4>
              <p className="text-gray-600">
                Quy trình đơn giản, hiệu quả giúp bạn tiết kiệm thời gian tối đa
                và tập trung vào mục tiêu sức khỏe của mình
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform transition-transform">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-3">
                Hỗ trợ chuyên nghiệp
              </h4>
              <p className="text-gray-600">
                Đội ngũ tư vấn viên luôn sẵn sàng hỗ trợ bạn 24/7, giải đáp mọi
                thắc mắc và đồng hành cùng bạn trên hành trình
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
