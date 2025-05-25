import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Import pricing plans from Price component
const pricingPlans = [
  // BASIC PLANS
  {
    id: "basic-monthly",
    name: "Gói Cơ Bản Hàng Tháng",
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
    category: "basic",
  },
  {
    id: "basic-offpeak",
    name: "Gói Cơ Bản Giờ Thấp Điểm",
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
    category: "basic",
  },
  {
    id: "basic-student",
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
    color: "blue",
    badge: "Sinh viên",
    category: "basic",
  },
  {
    id: "basic-weekend",
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
    color: "blue",
    badge: "Cuối tuần",
    category: "basic",
  },

  // STANDARD PLANS
  {
    id: "standard-quarterly",
    name: "Gói Tiêu Chuẩn Hàng Quý",
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
    category: "standard",
  },
  {
    id: "standard-monthly",
    name: "Gói Tiêu Chuẩn Hàng Tháng",
    price: 2200000,
    duration: 30, // 1 month
    type: "Standard",
    features: [
      "Tập luyện tại 01 CLB đã chọn.",
      "Tham gia Yoga và Group X tại 01 CLB đã chọn.",
      "Tự do tập luyện tại tất cả các câu lạc bộ trong hệ thống.",
      "Không giới hạn thời gian luyện tập.",
      "Sử dụng dịch vụ thư giãn sau luyện tập (sauna, steambath).",
      "Khăn tập thể thao cao cấp.",
    ],
    color: "green",
    category: "standard",
  },
  {
    id: "standard-family",
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
    color: "green",
    badge: "Gia đình",
    category: "standard",
  },
  {
    id: "standard-senior",
    name: "Gói Người Cao Tuổi",
    price: 1500000,
    duration: 30, // days
    type: "Standard",
    features: [
      "Dành cho người trên 55 tuổi.",
      "Tập luyện tại 01 CLB đã chọn.",
      "Các lớp tập nhẹ nhàng chuyên biệt.",
      "Huấn luyện viên có kinh nghiệm với người cao tuổi.",
      "Thời gian tập không giới hạn.",
      "Nước uống miễn phí.",
    ],
    color: "green",
    badge: "Người cao tuổi",
    category: "standard",
  },

  // VIP PLANS
  {
    id: "vip-biannual",
    name: "Gói VIP 6 Tháng",
    price: 10800000,
    duration: 180, // 6 months
    type: "VIP",
    features: [
      "Tự do tập luyện tại tất cả các CLB trong hệ thống.",
      "Tham gia tất cả các lớp Yoga và Group X tại tất cả các CLB.",
      "Được dẫn theo 1 người thân đi tập.",
      "Nước uống miễn phí, khăn tập thể thao cao cấp.",
      "Ưu tiên đặt chỗ các lớp Yoga và GroupX trước 48 tiếng.",
      "Chế độ dinh dưỡng được thiết kế riêng.",
      "Có tủ cá nhân riêng biệt.",
    ],
    color: "amber",
    popular: true,
    category: "vip",
  },
  {
    id: "vip-monthly",
    name: "Gói VIP Hàng Tháng",
    price: 2800000,
    duration: 30, // days
    type: "VIP",
    features: [
      "Tự do tập luyện tại tất cả các CLB trong hệ thống.",
      "Tham gia tất cả các lớp Yoga và Group X tại tất cả các CLB.",
      "Nước uống miễn phí, khăn tập thể thao cao cấp.",
      "2 buổi PT miễn phí mỗi tháng.",
      "Ưu tiên đặt lịch các lớp học.",
    ],
    color: "amber",
    category: "vip",
  },
  {
    id: "vip-annual",
    name: "Gói VIP 12 Tháng",
    price: 19800000,
    duration: 365, // days
    type: "VIP",
    features: [
      "Tự do tập luyện tại tất cả các CLB trong hệ thống.",
      "Tham gia tất cả các lớp Yoga và Group X tại tất cả các CLB.",
      "Được dẫn theo 1 người thân đi tập.",
      "PT không giới hạn.",
      "Nước uống miễn phí, khăn tập thể thao cao cấp.",
      "Ưu tiên đặt chỗ các lớp Yoga và GroupX trước 48 tiếng.",
      "Chế độ dinh dưỡng được thiết kế riêng.",
      "Tủ cá nhân riêng biệt.",
      "Dịch vụ spa và massage 1 lần/tháng.",
    ],
    color: "amber",
    badge: "Ưu đãi nhất",
    category: "vip",
  },
];

export default function MembershipPage() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [filterCategory, setFilterCategory] = useState("all");
  const [isUpgrade, setIsUpgrade] = useState(false);
  const [currentMembership, setCurrentMembership] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserId(decoded.userId);

      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/users/${decoded.userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // Check if this is an upgrade request
    const urlParams = new URLSearchParams(window.location.search);
    const upgradeParam = urlParams.get("upgrade");

    if (upgradeParam === "true") {
      setIsUpgrade(true);

      // Get current membership from localStorage
      const storedMembership = localStorage.getItem("currentMembership");
      if (storedMembership) {
        setCurrentMembership(JSON.parse(storedMembership));
      }
    }
  }, []);

  const handleSelectPlan = (plan) => {
    // First set the selected plan
    setSelectedPlan(plan);

    // If user is logged in, show confirmation immediately
    if (userId) {
      setShowConfirmation(true);
    } else {
      setMessage({
        text: "Vui lòng đăng nhập để đăng ký gói tập.",
        type: "error",
      });
      navigate("/login");
    }
  };

  const handleRegister = () => {
    if (!selectedPlan || !userId) {
      setMessage({
        text: "Vui lòng chọn gói đăng ký.",
        type: "error",
      });
      return;
    }

    // Show confirmation dialog instead of proceeding directly
    setShowConfirmation(true);
  };

  // Update the confirmRegistration function

  const confirmRegistration = async () => {
    setShowConfirmation(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({
          text: "Bạn cần đăng nhập để đăng ký thành viên.",
          type: "error",
        });
        navigate("/login");
        return;
      }

      // Ensure we have a valid userId
      if (!userId) {
        console.error("Missing userId - user may not be properly logged in");
        setMessage({
          text: "Lỗi xác thực người dùng. Vui lòng đăng nhập lại.",
          type: "error",
        });
        navigate("/login");
        return;
      }

      // Tính ngày hết hạn từ ngày hiện tại
      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() + selectedPlan.duration * 24 * 60 * 60 * 1000
      );

      const membershipData = {
        userId,
        type: selectedPlan.type,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        price: selectedPlan.price,
      };

      console.log("Sending membership registration:", membershipData);

      let endpoint = "http://localhost:5000/api/memberships";
      let method = "POST";

      // If upgrading, use PUT method instead and include current membership ID
      if (isUpgrade && currentMembership) {
        endpoint = `http://localhost:5000/api/memberships/upgrade/${currentMembership.id}`;
        method = "PUT";
      }

      console.log(`Making ${method} request to ${endpoint}`);

      const response = await axios({
        method: method,
        url: endpoint,
        data: membershipData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Membership registration response:", response.data);

      // Clear upgrade data from localStorage
      if (isUpgrade) {
        localStorage.removeItem("currentMembership");
      }

      if (!response.data.membership || !response.data.membership._id) {
        throw new Error("Invalid membership response from server");
      }

      // Lưu thông tin membership vào localStorage để trang thanh toán có thể truy cập
      localStorage.setItem(
        "pendingMembership",
        JSON.stringify({
          id: response.data.membership._id,
          type: selectedPlan.type,
          price: selectedPlan.price,
          name: selectedPlan.name,
          duration: selectedPlan.duration,
          isUpgrade: isUpgrade,
        })
      );

      // Instead of creating a payment here, redirect to the payment page
      // where the payment will be created
      setMessage({
        text: isUpgrade
          ? "Nâng cấp thẻ thành công! Chuyển đến trang thanh toán."
          : "Đăng ký thành công! Chuyển đến trang thanh toán.",
        type: "success",
      });

      // Chuyển hướng đến trang thanh toán
      setTimeout(() => {
        navigate("/payment", {
          state: {
            fromMembership: true,
            isUpgrade: isUpgrade,
            membershipId: response.data.membership._id,
          },
        });
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);

      // Get detailed error information
      const errorDetail =
        error.response?.data?.message ||
        error.message ||
        "Đăng ký thất bại. Vui lòng thử lại sau.";

      // Log detailed error data if available
      if (error.response?.data) {
        console.error("Server error details:", error.response.data);
      }

      setMessage({
        text: errorDetail,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format price để hiển thị đẹp hơn
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const getFilteredPlans = () => {
    if (filterCategory === "all") return pricingPlans;
    return pricingPlans.filter((plan) => plan.category === filterCategory);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {isUpgrade ? "Nâng Cấp Thẻ Thành Viên" : "Đăng Ký Thẻ Thành Viên"}
          </h1>
          <p className="text-xl text-gray-600">
            Trở thành thành viên của chúng tôi để tận hưởng trải nghiệm tập
            luyện tốt nhất cùng nhiều ưu đãi hấp dẫn.
          </p>
        </div>

        {message.text && (
          <div
            className={`mb-8 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setFilterCategory("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Tất cả gói tập
          </button>
          <button
            onClick={() => setFilterCategory("basic")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterCategory === "basic"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Gói Cơ Bản
          </button>
          <button
            onClick={() => setFilterCategory("standard")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterCategory === "standard"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Gói Tiêu Chuẩn
          </button>
          <button
            onClick={() => setFilterCategory("vip")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterCategory === "vip"
                ? "bg-amber-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Gói VIP
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {getFilteredPlans().map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -10 }}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 ${
                selectedPlan?.id === plan.id
                  ? `border-${plan.color}-500`
                  : "border-transparent"
              } ${plan.popular ? "transform md:-translate-y-4" : ""}`}
            >
              {plan.badge && (
                <div
                  className={`bg-${plan.color}-600 text-white text-center py-2 font-medium`}
                >
                  {plan.badge}
                </div>
              )}
              {plan.popular && !plan.badge && (
                <div
                  className={`bg-${plan.color}-600 text-white text-center py-2 font-medium`}
                >
                  Phổ biến nhất
                </div>
              )}
              <div
                className={`p-6 bg-gradient-to-r from-${plan.color}-50 to-${plan.color}-100`}
              >
                <h2 className={`text-2xl font-bold text-${plan.color}-900`}>
                  {plan.name}
                </h2>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {formatPrice(plan.price)}đ
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {plan.duration === 30
                    ? "1 tháng"
                    : plan.duration === 90
                    ? "3 tháng"
                    : plan.duration === 180
                    ? "6 tháng"
                    : `${plan.duration} ngày`}
                </p>
              </div>
              <div className="p-6 space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className={`h-5 w-5 text-${plan.color}-500 mr-3 mt-0.5 flex-shrink-0`}
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
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  className={`w-full py-3 px-6 rounded-xl text-white font-medium transition-colors ${
                    selectedPlan?.id === plan.id
                      ? `bg-${plan.color}-600 hover:bg-${plan.color}-700`
                      : `bg-${plan.color}-500 hover:bg-${plan.color}-600`
                  }`}
                >
                  {selectedPlan?.id === plan.id
                    ? "Đã chọn"
                    : isUpgrade
                    ? "Nâng cấp lên gói này"
                    : "Đăng ký gói này"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Làm thế nào để gia hạn thẻ thành viên?
              </h3>
              <p className="mt-2 text-gray-600">
                Bạn có thể gia hạn thẻ thành viên bằng cách đăng nhập vào tài
                khoản và chọn phần "Thẻ thành viên" trong hồ sơ cá nhân, sau đó
                chọn "Gia hạn" và làm theo hướng dẫn.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Tôi có thể chuyển nhượng thẻ tập cho người khác không?
              </h3>
              <p className="mt-2 text-gray-600">
                Các gói Cao Cấp và Đặc Quyền cho phép 1 lần chuyển nhượng miễn
                phí cho người thân trong gia đình. Các gói khác sẽ tính phí
                chuyển nhượng là 10% giá trị còn lại của gói tập.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Có hình thức trả góp cho các gói dài hạn không?
              </h3>
              <p className="mt-2 text-gray-600">
                Có, chúng tôi liên kết với các ngân hàng đối tác để cung cấp
                hình thức trả góp 0% lãi suất trong 3-6 tháng cho các gói tập từ
                6 tháng trở lên.
              </p>
            </div>
          </div>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-fade-in">
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-xl font-bold text-gray-900">
                  Xác nhận đăng ký
                </h3>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Bạn đã chọn{" "}
                  <span className="font-semibold">{selectedPlan.name}</span> với
                  giá{" "}
                  <span className="font-semibold">
                    {formatPrice(selectedPlan.price)}đ
                  </span>{" "}
                  cho{" "}
                  <span className="font-semibold">
                    {selectedPlan.duration === 30
                      ? "1 tháng"
                      : selectedPlan.duration === 90
                      ? "3 tháng"
                      : selectedPlan.duration === 180
                      ? "6 tháng"
                      : selectedPlan.duration === 365
                      ? "12 tháng"
                      : `${selectedPlan.duration} ngày`}
                  </span>
                  .
                </p>

                <p className="text-gray-700 mb-6">
                  {isUpgrade
                    ? "Bạn có chắc chắn muốn nâng cấp lên gói này không?"
                    : "Bạn có chắc chắn muốn đăng ký gói này không?"}
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg ${
                      loading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    } transition-colors`}
                  >
                    Hủy
                  </button>
                  <button
                    onClick={confirmRegistration}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white transition-colors flex items-center justify-center`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Đang xử lý...
                      </>
                    ) : isUpgrade ? (
                      "Nâng cấp"
                    ) : (
                      "Đăng ký"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
