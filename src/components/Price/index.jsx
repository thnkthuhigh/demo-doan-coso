import { useState, useEffect } from "react";
import GymImageGallery from "../Club/Banner";
import { motion } from "framer-motion";

const pricingPlans = [
  {
    name: "Gói Cơ Bản",
    duration: "1 tháng",
    totalCost: "1,980,000 VNĐ",
    costPerMonth: "1,980,000 VNĐ",
    costPerDay: "66,000 VNĐ",
    badge: "Phổ biến",
    badgeColor: "blue",
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
    badge: "Tiết kiệm",
    badgeColor: "green",
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
    badge: "Đề xuất",
    badgeColor: "purple",
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
    badge: "Premium",
    badgeColor: "gold",
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

const frequentlyAskedQuestions = [
  {
    question: "Có được đóng phí theo tháng không?",
    answer:
      "Có, bạn có thể chọn đóng phí theo tháng với tất cả các gói tập luyện. Tuy nhiên, khi đóng theo kỳ dài hơn (3 tháng, 6 tháng...) bạn sẽ nhận được mức giá ưu đãi hơn.",
  },
  {
    question: "Tôi có thể đổi CLB tập trong quá trình sử dụng gói tập không?",
    answer:
      "Đối với gói Cơ Bản, bạn sẽ tập cố định tại 1 CLB đã chọn. Với các gói từ Cơ Bản Nâng Cao trở lên, bạn có thể tập luyện tại nhiều CLB khác nhau trong hệ thống của chúng tôi.",
  },
  {
    question: "Có được bảo lưu thời gian khi không đi tập được không?",
    answer:
      "Chúng tôi cho phép bảo lưu thời gian trong các trường hợp bất khả kháng như bệnh tật (có giấy tờ y tế), công tác dài ngày (có xác nhận). Thời gian bảo lưu tối đa là 30 ngày đối với gói 6 tháng trở lên.",
  },
  {
    question: "Tôi có thể chuyển nhượng thẻ tập cho người khác không?",
    answer:
      "Các gói Cao Cấp và Đặc Quyền cho phép 1 lần chuyển nhượng miễn phí cho người thân trong gia đình. Các gói khác sẽ tính phí chuyển nhượng là 10% giá trị còn lại của gói tập.",
  },
  {
    question: "Có hình thức trả góp cho các gói dài hạn không?",
    answer:
      "Có, chúng tôi liên kết với các ngân hàng đối tác để cung cấp hình thức trả góp 0% lãi suất trong 3-6 tháng cho các gói tập từ 6 tháng trở lên.",
  },
];

export default function PricingPage() {
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    plan: "",
    message: "",
  });

  const filteredPlans =
    selectedDuration === "all"
      ? pricingPlans
      : pricingPlans.filter((plan) => {
          const months = parseInt(plan.duration);
          if (selectedDuration === "shortTerm" && months <= 3) return true;
          if (selectedDuration === "midTerm" && months > 3 && months <= 6)
            return true;
          if (selectedDuration === "longTerm" && months > 6) return true;
          return false;
        });

  const handleContactFormSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi form đăng ký ở đây
    console.log("Form data submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      plan: "",
      message: "",
    });
    // Đóng form
    setIsContactFormOpen(false);
    // Hiển thị thông báo thành công
    alert("Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleQuestion = (index) => {
    if (activeQuestion === index) {
      setActiveQuestion(null);
    } else {
      setActiveQuestion(index);
    }
  };

  const openContactForm = (planName = "") => {
    setFormData({
      ...formData,
      plan: planName,
    });
    setIsContactFormOpen(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
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
              Bảng Giá Dịch Vụ
            </h1>
            <p className="text-2xl sm:text-3xl text-white/90 italic font-light">
              "Đầu tư cho sức khỏe là đầu tư thông minh nhất"
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 -mt-10">
        {/* Intro Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Lựa Chọn Gói Tập Phù Hợp Với Bạn
          </h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full mb-4"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cung cấp nhiều lựa chọn linh hoạt, đáp ứng mọi nhu cầu và
            ngân sách với cam kết chất lượng dịch vụ hàng đầu
          </p>
        </motion.div>

        {/* Filter Options */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button
            onClick={() => setSelectedDuration("all")}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              selectedDuration === "all"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setSelectedDuration("shortTerm")}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              selectedDuration === "shortTerm"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Ngắn hạn (1-3 tháng)
          </button>
          <button
            onClick={() => setSelectedDuration("midTerm")}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              selectedDuration === "midTerm"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Trung hạn (4-6 tháng)
          </button>
          <button
            onClick={() => setSelectedDuration("longTerm")}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              selectedDuration === "longTerm"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Dài hạn (&gt;6 tháng)
          </button>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative flex flex-col"
            >
              {/* Badge if exists */}
              {plan.badge && (
                <div
                  className={`absolute top-0 right-0 ${
                    plan.badgeColor === "blue"
                      ? "bg-blue-500"
                      : plan.badgeColor === "green"
                      ? "bg-green-500"
                      : plan.badgeColor === "purple"
                      ? "bg-purple-500"
                      : "bg-amber-500"
                  } text-white px-4 py-1 rounded-bl-lg font-semibold text-sm shadow-md`}
                >
                  {plan.badge}
                </div>
              )}

              {/* Plan Header */}
              <div className="p-6 text-center border-b border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800">
                  {plan.name}
                </h3>
                <p className="text-gray-500 mt-1">Thời hạn: {plan.duration}</p>
                <div className="mt-4 flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-600">
                    {plan.costPerMonth}
                  </span>
                  <span className="text-gray-500 ml-2">/tháng</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Tổng phí: {plan.totalCost}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {plan.costPerDay}/ngày
                </p>
              </div>

              {/* Feature List */}
              <div className="p-6 flex-grow">
                <h4 className="font-semibold text-gray-700 mb-4">
                  Quyền lợi bao gồm:
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => openContactForm(plan.name)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors duration-300 font-semibold shadow-md"
                >
                  Đăng Ký Ngay
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Comparison Table for Desktop */}
        <motion.div
          className="hidden lg:block mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            So Sánh Các Gói Dịch Vụ
          </h2>

          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-gray-700">
                    Tính năng
                  </th>
                  {pricingPlans.map((plan, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-4 text-center text-gray-700"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Thời gian */}
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    Thời gian
                  </td>
                  {pricingPlans.map((plan, idx) => (
                    <td
                      key={idx}
                      className="px-6 py-4 text-center text-gray-600"
                    >
                      {plan.duration}
                    </td>
                  ))}
                </tr>

                {/* Chi phí */}
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    Chi phí/tháng
                  </td>
                  {pricingPlans.map((plan, idx) => (
                    <td
                      key={idx}
                      className="px-6 py-4 text-center text-gray-600"
                    >
                      {plan.costPerMonth}
                    </td>
                  ))}
                </tr>

                {/* Tập tại CLB đã chọn */}
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    Tập tại CLB đã chọn
                  </td>
                  {pricingPlans.map((plan, idx) => (
                    <td key={idx} className="px-6 py-4 text-center">
                      {plan.features.some((f) =>
                        f.includes("01 CLB đã chọn")
                      ) ? (
                        <svg
                          className="w-6 h-6 mx-auto text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 mx-auto text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Tập tại tất cả CLB */}
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    Tập tại tất cả CLB
                  </td>
                  {pricingPlans.map((plan, idx) => (
                    <td key={idx} className="px-6 py-4 text-center">
                      {plan.features.some(
                        (f) =>
                          f.includes("tất cả các CLB") ||
                          f.includes("toàn hệ thống")
                      ) ? (
                        <svg
                          className="w-6 h-6 mx-auto text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 mx-auto text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Dịch vụ thư giãn */}
                <tr className="border-t border-gray-200">
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    Dịch vụ thư giãn
                  </td>
                  {pricingPlans.map((plan, idx) => (
                    <td key={idx} className="px-6 py-4 text-center">
                      {plan.features.some((f) => f.includes("thư giãn")) ? (
                        <svg
                          className="w-6 h-6 mx-auto text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 mx-auto text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Dẫn khách */}
                <tr className="border-t border-gray-200 bg-gray-50">
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    Dẫn theo khách
                  </td>
                  {pricingPlans.map((plan, idx) => (
                    <td key={idx} className="px-6 py-4 text-center">
                      {plan.features.some((f) => f.includes("dẫn theo")) ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                          <span className="ml-1 text-sm">
                            {plan.features.some((f) => f.includes("2 khách"))
                              ? "2 người"
                              : "1 người"}
                          </span>
                        </div>
                      ) : (
                        <svg
                          className="w-6 h-6 mx-auto text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            Câu Hỏi Thường Gặp
          </h2>

          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            {frequentlyAskedQuestions.map((faq, index) => (
              <div
                key={index}
                className={`border-b border-gray-200 ${
                  index === frequentlyAskedQuestions.length - 1
                    ? "border-b-0"
                    : ""
                }`}
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="font-medium text-gray-800">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                      activeQuestion === index ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                <div
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    activeQuestion === index ? "max-h-40 pb-4" : "max-h-0"
                  }`}
                >
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Bạn vẫn còn thắc mắc?
              </h2>
              <p className="text-white/80 max-w-lg">
                Đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng giải đáp mọi câu
                hỏi của bạn và giúp bạn chọn gói tập phù hợp nhất.
              </p>
            </div>
            <button
              onClick={() => openContactForm()}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300 font-semibold shadow-md"
            >
              Liên Hệ Ngay
            </button>
          </div>
        </motion.div>
      </div>

      {/* Contact Form Modal */}
      {isContactFormOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  Đăng Ký Tư Vấn
                </h3>
                <button
                  onClick={() => setIsContactFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleContactFormSubmit} className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ tên
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0912345678"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="plan"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Gói quan tâm
                </label>
                <select
                  id="plan"
                  name="plan"
                  value={formData.plan}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="">-- Chọn gói --</option>
                  {pricingPlans.map((plan, idx) => (
                    <option key={idx} value={plan.name}>
                      {plan.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Thời gian thuận tiện để liên hệ..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors duration-300 font-medium"
              >
                Gửi Thông Tin
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
