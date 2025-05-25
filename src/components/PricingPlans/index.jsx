import React from "react";
import { motion } from "framer-motion";
import pricingPlansData from "../../data/pricingPlansData";

const PricingPlans = ({
  selectedPlan,
  onSelectPlan,
  filterCategory = "all",
  onFilterChange,
  message,
  isUpgrade = false,
  containerClassName = "",
  readOnly = false, // Add this prop
}) => {
  // Format price để hiển thị đẹp hơn
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const getFilteredPlans = () => {
    if (filterCategory === "all") return pricingPlansData;
    return pricingPlansData.filter((plan) => plan.category === filterCategory);
  };

  // Animation variants
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
    <div className={containerClassName}>
      {/* Category filters */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => onFilterChange("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Tất cả gói tập
        </button>
        <button
          onClick={() => onFilterChange("basic")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterCategory === "basic"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Gói Cơ Bản
        </button>
        <button
          onClick={() => onFilterChange("standard")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterCategory === "standard"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Gói Tiêu Chuẩn
        </button>
        <button
          onClick={() => onFilterChange("vip")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filterCategory === "vip"
              ? "bg-amber-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Gói VIP
        </button>
      </div>

      {/* Message display */}
      {message && message.text && (
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

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {getFilteredPlans().map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -10 }}
            variants={itemVariants}
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

              {/* Conditionally render buttons based on readOnly */}
              {!readOnly && plan.type !== "Platinum" && (
                <button
                  onClick={() => onSelectPlan(plan)}
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
              )}

              {!readOnly && plan.type === "Platinum" && (
                <button
                  onClick={() => (window.location.href = "/contact")}
                  className={`w-full py-3 px-6 rounded-xl text-white font-medium transition-colors bg-amber-500 hover:bg-amber-600`}
                >
                  Liên hệ tư vấn
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;
