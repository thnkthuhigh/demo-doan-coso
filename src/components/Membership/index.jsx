import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import PricingPlans from "../PricingPlans";
import ConfirmationDialog from "../PricingPlans/index";
import Toast from "../common/Toast";

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
  const [toast, setToast] = useState({ message: "", type: "" });

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

  // Update the handleSelectPlan function to go directly to payment
  const handleSelectPlan = async (plan) => {
    // First set the selected plan
    setSelectedPlan(plan);

    // If user is not logged in, redirect to login
    if (!userId) {
      setToast({
        message: "Vui lòng đăng nhập để đăng ký gói tập",
        type: "error",
      });
      navigate("/login");
      return;
    }

    // Check if user already has an active membership
    if (user && user.membership && user.membership.endDate) {
      const endDate = new Date(user.membership.endDate);
      if (endDate > new Date()) {
        setToast({
          message:
            "Bạn đã có thẻ thành viên đang hoạt động. Vui lòng chờ hết hạn hoặc chọn nâng cấp gói tập.",
          type: "error",
        });
        return;
      }
    }

    // Skip confirmation and proceed directly to registration
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

      // Tính ngày hết hạn từ ngày hiện tại
      const startDate = new Date();
      const endDate = new Date(
        startDate.getTime() + plan.duration * 24 * 60 * 60 * 1000
      );

      const membershipData = {
        userId,
        type: plan.type,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        price: plan.price,
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
          type: plan.type,
          price: plan.price,
          name: plan.name,
          duration: plan.duration,
          isUpgrade: isUpgrade,
        })
      );

      // Navigate directly to payment page
      navigate("/payment", {
        state: {
          fromMembership: true,
          isUpgrade: isUpgrade,
          membershipId: response.data.membership._id,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);

      // Get detailed error information
      const errorDetail =
        error.response?.data?.message ||
        error.message ||
        "Đăng ký thất bại. Vui lòng thử lại sau.";

      // Use toast instead of message state
      setToast({
        message: errorDetail,
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

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

        {/* PricingPlans Component */}
        <PricingPlans
          selectedPlan={selectedPlan}
          onSelectPlan={handleSelectPlan}
          filterCategory={filterCategory}
          onFilterChange={setFilterCategory}
          message={message}
          isUpgrade={isUpgrade}
        />

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

        {/* Confirmation Dialog */}
        {showConfirmation && (
          <ConfirmationDialog
            selectedPlan={selectedPlan}
            onClose={() => setShowConfirmation(false)}
            onConfirm={confirmRegistration}
            isUpgrade={isUpgrade}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
