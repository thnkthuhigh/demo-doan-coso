import { useState, useEffect } from "react";
import GymImageGallery from "../Club/Banner";
import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PricingPlans from "../PricingPlans";
import Toast from "../common/Toast";

const membershipPlans = [
  {
    id: "basic",
    name: "Gói Cơ Bản",
    price: 1980000,
    duration: 30, // days
    type: "Basic",
    features: [
      "Tập luyện tại 01 CLB đã chọn.",
      "Tham gia Yoga và Group X tại 01 CLB đã chọn.",
      "1 buổi định hướng luyện tập và tư vấn dinh dưỡng.",
      "Sử dụng dịch vụ thư giãn (sauna, steambath).",
      "Nước uống miễn phí.",
      "Khăn tập thể thao cao cấp.",
    ],
    color: "blue",
    badge: "Phổ biến",
  },
  {
    id: "standard",
    name: "Gói Cơ Bản Nâng Cao",
    price: 5400000,
    duration: 90, // 3 months
    type: "Standard",
    features: [
      "Tập luyện tại 01 CLB đã chọn.",
      "Tham gia Yoga và Group X tại 01 CLB đã chọn.",
      "Tự do tập luyện tại tất cả các câu lạc bộ trong hệ thống.",
      "Không giới hạn thời gian luyện tập.",
      "Sử dụng dịch vụ thư giãn sau luyện tập (sauna, steambath).",
      "Khăn tập thể thao cao cấp.",
      "Hệ thống khóa từ thông minh, bảo mật tối ưu.",
    ],
    color: "green",
    badge: "Tiết kiệm",
  },
  {
    id: "vip",
    name: "Gói VIP",
    price: 10800000,
    duration: 180, // 6 months
    type: "VIP",
    features: [
      "Tự do tập luyện tại tất cả các CLB trong hệ thống.",
      "Tham gia tất cả các lớp Yoga và Group X tại tất cả các CLB.",
      "Được dẫn theo 1 người thân đi tập.",
      "Nước uống miễn phí, khăn tập thể thao cao cấp.",
      "Ưu tiên đặt chỗ các lớp Yoga và GroupX trước 48 tiếng.",
    ],
    color: "amber",
    popular: true,
  },
  {
    id: "offpeak-basic",
    name: "Gói Giờ Thấp Điểm",
    price: 1200000,
    duration: 30, // days
    type: "Basic",
    features: [
      "Tập luyện tại 01 CLB đã chọn.",
      "Chỉ được tập từ 10:00 - 16:00 các ngày trong tuần.",
      "Không được sử dụng vào ngày cuối tuần và ngày lễ.",
      "1 buổi định hướng luyện tập cơ bản.",
      "Nước uống miễn phí.",
    ],
    color: "blue",
    badge: "Tiết kiệm",
    offPeak: true,
  },
  {
    id: "student",
    name: "Gói Sinh Viên",
    price: 1500000,
    duration: 30, // days
    type: "Basic",
    features: [
      "Chỉ áp dụng cho sinh viên (yêu cầu thẻ sinh viên).",
      "Tập luyện tại 01 CLB đã chọn.",
      "Tham gia Yoga và Group X cơ bản.",
      "Được sử dụng vào tất cả các ngày trong tuần.",
      "Nước uống miễn phí.",
    ],
    color: "indigo",
    badge: "Sinh viên",
  },
  {
    id: "weekend",
    name: "Gói Cuối Tuần",
    price: 990000,
    duration: 30, // days
    type: "Basic",
    features: [
      "Chỉ được sử dụng vào các ngày cuối tuần (T7, CN).",
      "Tập luyện tại 01 CLB đã chọn.",
      "Tham gia tất cả các lớp Yoga và Group X trong ngày cuối tuần.",
      "Không giới hạn thời gian tập luyện vào ngày cuối tuần.",
      "Nước uống miễn phí.",
    ],
    color: "rose",
    badge: "Cuối tuần",
  },
  {
    id: "family",
    name: "Gói Gia Đình",
    price: 3500000,
    duration: 30, // days
    type: "Standard",
    features: [
      "Dành cho 2 thành viên trong gia đình.",
      "Tập luyện tại 01 CLB đã chọn.",
      "Tham gia các lớp Yoga và Group X.",
      "Sử dụng dịch vụ thư giãn (sauna, steambath).",
      "Nước uống miễn phí.",
      "Khăn tập thể thao cao cấp.",
    ],
    color: "purple",
    badge: "Gia đình",
  },
  {
    id: "senior",
    name: "Gói Người Cao Tuổi",
    price: 1500000,
    duration: 30, // days
    type: "Basic",
    features: [
      "Dành cho người trên 55 tuổi.",
      "Tập luyện tại 01 CLB đã chọn.",
      "Các lớp tập nhẹ nhàng chuyên biệt.",
      "Huấn luyện viên có kinh nghiệm với người cao tuổi.",
      "Thời gian tập không giới hạn.",
      "Nước uống miễn phí.",
    ],
    color: "teal",
    badge: "Người cao tuổi",
  },
];

export default function Club() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "",
  });
  const [formStatus, setFormStatus] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showMembershipSection, setShowMembershipSection] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [filterType, setFilterType] = useState("all"); // "all", "regular", "offpeak"
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [membershipMessage, setMembershipMessage] = useState({
    text: "",
    type: "",
  });
  const [filterCategory, setFilterCategory] = useState("all");
  const [toast, setToast] = useState({ message: "", type: "" });

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus("submitting");

    try {
      // Demo API call - thay thế với API thật khi có
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", formData);
      setFormStatus("success");
      setFormData({ name: "", email: "", phone: "", interest: "" });

      setTimeout(() => setFormStatus(null), 3000);
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      setFormStatus("error");

      setTimeout(() => setFormStatus(null), 3000);
    }
  };

  const openClubDetails = (club) => {
    setSelectedClub(club);
  };

  const closeClubDetails = () => {
    setSelectedClub(null);
  };

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const getFilteredPlans = () => {
    if (filterType === "all") return membershipPlans;
    if (filterType === "offpeak")
      return membershipPlans.filter((plan) => plan.offPeak);
    return membershipPlans.filter((plan) => !plan.offPeak);
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

      {/* Hero Section */}
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
              Hệ Thống Câu Lạc Bộ
            </h1>
            <p className="text-2xl sm:text-3xl text-white/90 italic font-light">
              "Chinh phục sức khỏe, vươn tới đỉnh cao cùng chúng tôi!"
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
      </div>

      {/* Club List Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Khám Phá Các Câu Lạc Bộ
          </h2>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
            Chúng tôi tự hào mang đến cho bạn hệ thống câu lạc bộ hiện đại,
            trang thiết bị đẳng cấp và đội ngũ HLV chuyên nghiệp, giúp bạn đạt
            được mục tiêu sức khỏe và thể hình.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600 text-lg font-medium">
                Đang tải danh sách CLB...
              </span>
            </div>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {clubs.map((club, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
              >
                <div className="overflow-hidden h-64">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    {club.name}
                    <span className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-gray-400"
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
                  <p className="text-gray-700 line-clamp-3">
                    {club.description}
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => openClubDetails(club)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-300 shadow-md w-full"
                    >
                      Xem Chi Tiết
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Membership Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Đăng Ký Gói Tập
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              Chọn gói tập phù hợp với lịch trình và nhu cầu của bạn. Chúng tôi
              cung cấp nhiều gói tập đa dạng từ giờ thấp điểm đến các gói dành
              riêng cho cuối tuần.
            </p>

            {!showMembershipSection ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-8"
              >
                <button
                  onClick={() => setShowMembershipSection(true)}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition duration-300"
                >
                  Xem Các Gói Tập
                </button>
              </motion.div>
            ) : null}
          </motion.div>

          {showMembershipSection && (
            <>
              {/* PricingPlans Component - Notice the readOnly prop */}
              <PricingPlans
                selectedPlan={selectedPlan}
                onSelectPlan={handleSelectPlan}
                filterCategory={filterCategory}
                onFilterChange={setFilterCategory}
                message={membershipMessage}
                readOnly={true} // Set this to true to hide selection buttons
              />

              <div className="text-center my-12">
                <Link
                  to="/membership"
                  className="px-8 py-4 rounded-xl text-white font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                >
                  Đăng ký ngay
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="text-4xl font-bold mb-6">Đăng Ký Tư Vấn Miễn Phí</h2>
            <p className="text-lg text-white/90 mb-8">
              Hãy để lại thông tin của bạn, chúng tôi sẽ liên hệ và tư vấn miễn
              phí về các dịch vụ phù hợp nhất với nhu cầu của bạn.
            </p>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>Tư vấn chuyên nghiệp với HLV kinh nghiệm</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>Lộ trình tập luyện phù hợp với thể trạng</span>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span>Chế độ dinh dưỡng khoa học</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-2xl shadow-2xl space-y-5"
            >
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Họ và tên
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên của bạn"
                  required
                  className="w-full p-4 rounded-xl border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  required
                  className="w-full p-4 rounded-xl border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="0987654321"
                  required
                  className="w-full p-4 rounded-xl border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              <div>
                <label
                  htmlFor="interest"
                  className="text-sm font-medium text-gray-700 block mb-2"
                >
                  Nội dung quan tâm
                </label>
                <textarea
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleInputChange}
                  placeholder="Tôi quan tâm đến..."
                  rows="3"
                  className="w-full p-4 rounded-xl border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className={`w-full py-4 mt-4 font-bold rounded-xl shadow-lg transition duration-300 ${
                  formStatus === "submitting"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                }`}
              >
                {formStatus === "submitting" ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang gửi...
                  </div>
                ) : (
                  "Gửi Đăng Ký"
                )}
              </button>

              {formStatus === "success" && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Đăng ký thành công! Chúng tôi sẽ liên hệ sớm nhất.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {formStatus === "error" && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        Có lỗi xảy ra! Vui lòng thử lại sau.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Modal for club details */}
      {selectedClub && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative">
              <img
                src={selectedClub.image}
                alt={selectedClub.name}
                className="w-full h-72 object-cover"
              />
              <button
                onClick={closeClubDetails}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white p-2 rounded-full transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {selectedClub.name}
              </h2>
              <div className="flex items-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 mr-2"
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
                <span className="text-gray-600">{selectedClub.address}</span>
              </div>

              <p className="text-gray-700 mb-8">{selectedClub.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Trang Thiết Bị
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Máy tập hiện đại nhập khẩu từ Mỹ
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Phòng tập rộng rãi, thoáng mát
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Khu vực cardio riêng biệt
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Dịch Vụ
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Huấn luyện viên cá nhân
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Các lớp học nhóm đa dạng
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="h-5 w-5 text-blue-600 mr-2 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Tư vấn dinh dưỡng
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={closeClubDetails}
                  className="mr-4 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Đóng
                </button>
                <Link
                  to="/membership"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Đăng Ký Thành Viên
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
