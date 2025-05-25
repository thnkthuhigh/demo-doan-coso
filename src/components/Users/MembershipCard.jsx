import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const BenefitItem = ({ children }) => (
  <li className="flex items-start">
    <svg
      className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
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
    <span className="text-gray-700">{children}</span>
  </li>
);

const MembershipCard = ({ user, cardVariants }) => {
  const navigate = useNavigate();
  const [showMembershipDetails, setShowMembershipDetails] = useState(false);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBenefits, setShowBenefits] = useState(false);

  // Define membership benefits based on type
  const membershipBenefits = {
    Standard: [
      "Sử dụng tất cả các thiết bị tập luyện cơ bản",
      "Tham gia các lớp tập nhóm cơ bản",
      "Tủ đồ cá nhân trong thời gian tập",
      "Đặt lịch tập trực tuyến",
    ],
    VIP: [
      "Tất cả quyền lợi của gói Standard",
      "Sử dụng tất cả các thiết bị tập luyện cao cấp",
      "Ưu tiên đăng ký các lớp tập đặc biệt",
      "Huấn luyện viên cá nhân 2 buổi/tháng",
      "Tủ đồ cá nhân cố định",
      "Phòng tắm và thay đồ riêng",
      "Đồ uống dinh dưỡng miễn phí",
      "Giảm 15% dịch vụ spa và massage",
    ],
    Platinum: [
      "Tất cả quyền lợi của gói VIP",
      "Huấn luyện viên cá nhân 4 buổi/tháng",
      "Đánh giá thể chất và dinh dưỡng định kỳ",
      "Ưu tiên đặt lịch tập mọi lúc",
      "Phòng tập riêng theo yêu cầu",
      "Gửi xe VIP",
      "Dịch vụ đưa đón tận nơi",
      "Giảm 25% tất cả các dịch vụ bổ sung",
    ],
  };

  // Fetch membership data from API
  useEffect(() => {
    const fetchMembershipData = async () => {
      if (!user || !user._id) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Không tìm thấy token xác thực");
        }

        // First try to get active membership using the user ID
        const response = await fetch(
          `http://localhost:5000/api/memberships/user/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMembership(data);
        } else if (response.status === 404) {
          // User doesn't have an active membership
          setMembership(null);
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch membership data"
          );
        }
      } catch (error) {
        console.error("Error fetching membership:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipData();
  }, [user]);

  // Function to handle membership upgrade or renewal
  const handleUpgrade = () => {
    // Store current membership info for potential upgrade discount calculations
    if (membership) {
      localStorage.setItem(
        "currentMembership",
        JSON.stringify({
          id: membership._id,
          type: membership.type,
          endDate: membership.endDate,
          status: membership.status,
        })
      );
    }

    // Navigate to membership page with upgrade flag
    navigate("/membership?upgrade=true");
  };

  // Function to handle membership renewal
  const handleRenewal = () => {
    // Store expired membership info for renewal process
    if (membership) {
      localStorage.setItem(
        "renewMembership",
        JSON.stringify({
          id: membership._id,
          type: membership.type,
          endDate: membership.endDate,
        })
      );
    }

    // Navigate directly to payment page for renewal
    navigate("/payment?renew=true");
  };

  // Function to get card background style based on membership type
  const getCardBackground = (type) => {
    switch (type) {
      case "VIP":
        return "bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600";
      case "Standard":
        return "bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700";
      case "Basic":
        return "bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600";
      default:
        return "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900";
    }
  };

  // Function to get membership badge based on type
  const getMembershipBadge = (type) => {
    switch (type) {
      case "VIP":
        return (
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-yellow-100 font-bold text-xs uppercase tracking-wider">
              Premium
            </span>
          </div>
        );
      case "Standard":
        return (
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-indigo-100 font-bold text-xs uppercase tracking-wider">
              Popular
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <motion.div
        key="membership-loading"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={cardVariants}
        className="bg-white rounded-3xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Thẻ thành viên
        </h2>
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="membership"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      className="bg-white rounded-3xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-between">
        <span>Thẻ thành viên</span>
        {membership && membership.status === "active" && (
          <button
            onClick={handleUpgrade}
            className="text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            Nâng cấp
          </button>
        )}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {membership && membership.status === "active" ? (
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            {/* Membership badge */}
            {getMembershipBadge(membership.type)}

            {/* Membership Card Background */}
            <div
              className={`p-6 ${getCardBackground(membership.type)} relative`}
            >
              {/* Decorative pattern */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  className="w-full h-full"
                >
                  <path
                    fill="currentColor"
                    d="M0 4c0-2.2 1.8-4 4-4h24c2.2 0 4 1.8 4 4v24c0 2.2-1.8 4-4 4H4c-2.2 0-4-1.8-4-4V4z"
                  />
                </svg>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-white/70 text-sm font-medium">
                    Thành viên
                  </p>
                  <div
                    onClick={() => setShowMembershipDetails(true)}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <h3 className="text-white text-xl font-bold mt-1">
                      {membership.type === "VIP"
                        ? "VIP"
                        : membership.type === "Standard"
                        ? "Tiêu chuẩn"
                        : "Cơ bản"}
                    </h3>
                    <p className="text-white/70 text-xs mt-1">
                      Nhấn để xem chi tiết quyền lợi
                    </p>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {membership.type === "VIP" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-yellow-200"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  ) : membership.type === "Standard" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-indigo-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div className="flex flex-col text-white space-y-4">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Chủ thẻ</p>
                    <p className="text-white font-medium">
                      {user?.fullName || user?.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">ID Thẻ</p>
                    <p className="text-white font-medium">
                      #{membership._id.substring(membership._id.length - 6)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <p className="text-white/70 text-xs">Ngày đăng ký</p>
                    <p className="text-white font-medium">
                      {new Date(membership.startDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">Hạn sử dụng</p>
                    <p className="text-white font-medium">
                      {new Date(membership.endDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : membership && membership.status === "expired" ? (
          <div className="bg-gradient-to-br from-gray-50 to-stone-100 rounded-xl p-8 text-center border border-gray-300">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl text-amber-800 font-bold mb-3">
              Thẻ thành viên đã hết hạn
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Thẻ thành viên{" "}
              {membership.type === "VIP"
                ? "VIP"
                : membership.type === "Standard"
                ? "Tiêu chuẩn"
                : "Cơ bản"}{" "}
              của bạn đã hết hạn vào ngày{" "}
              {new Date(membership.endDate).toLocaleDateString("vi-VN")}. Vui
              lòng đăng ký lại để tiếp tục sử dụng các dịch vụ của chúng tôi.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleRenewal}
                className="inline-block bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-medium rounded-xl px-8 py-3 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Đăng ký lại
              </button>
              <Link
                to="/membership"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl px-8 py-3 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Chọn gói khác
              </Link>
            </div>
          </div>
        ) : membership && membership.status === "pending_payment" ? (
          <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl p-8 text-center border border-amber-200">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl text-amber-800 font-bold mb-3">
              Thẻ thành viên đang chờ thanh toán
            </h3>
            <p className="text-amber-700 mb-6 max-w-md mx-auto">
              Bạn đã đăng ký thẻ thành viên{" "}
              {membership.type === "VIP"
                ? "VIP"
                : membership.type === "Standard"
                ? "Tiêu chuẩn"
                : "Cơ bản"}{" "}
              nhưng chưa thanh toán. Vui lòng hoàn tất thanh toán để kích hoạt
              thẻ.
            </p>
            <Link
              to="/payment"
              className="inline-block bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white font-medium rounded-xl px-8 py-3 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Thanh toán ngay
            </Link>
          </div>
        ) : membership && membership.status === "cancelled" ? (
          <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-8 text-center border border-gray-200">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
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
            </div>
            <h3 className="text-xl text-gray-800 font-bold mb-3">
              Thẻ thành viên đã bị hủy
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Thẻ thành viên của bạn đã bị hủy. Vui lòng đăng ký gói thành viên
              mới để tiếp tục sử dụng dịch vụ.
            </p>
            <Link
              to="/membership"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl px-8 py-3 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Đăng ký mới
            </Link>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-8 text-center border border-gray-200">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl text-gray-800 font-bold mb-3">
              Bạn chưa có thẻ thành viên
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Đăng ký thẻ thành viên để tận hưởng nhiều ưu đãi đặc biệt, giá ưu
              đãi khi đăng ký lớp học và nhiều quyền lợi hấp dẫn khác.
            </p>
            <Link
              to="/membership"
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl px-8 py-3 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Đăng ký ngay
            </Link>
          </div>
        )}
      </div>

      {/* Membership Details Modal */}
      {showMembershipDetails && membership && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div
              className={`p-6 ${getCardBackground(membership.type)} text-white`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold">
                  Gói{" "}
                  {membership.type === "VIP"
                    ? "VIP"
                    : membership.type === "Standard"
                    ? "Tiêu chuẩn"
                    : "Cơ bản"}
                </h3>
                <button
                  onClick={() => setShowMembershipDetails(false)}
                  className="text-white/80 hover:text-white"
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
              <p className="text-white/80 mt-2">
                Thời hạn sử dụng:{" "}
                {new Date(membership.startDate).toLocaleDateString("vi-VN")} -{" "}
                {new Date(membership.endDate).toLocaleDateString("vi-VN")}
              </p>
              {membership.status === "expired" && (
                <div className="mt-2 bg-red-500/20 px-3 py-1 rounded text-white text-sm">
                  Đã hết hạn
                </div>
              )}
            </div>

            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Quyền lợi của bạn
              </h4>

              {membership.type === "VIP" && (
                <ul className="space-y-3">
                  <BenefitItem>
                    Tự do tập luyện tại tất cả các CLB trong hệ thống
                  </BenefitItem>
                  <BenefitItem>
                    Tham gia tất cả các lớp Yoga và Group X tại tất cả các CLB
                  </BenefitItem>
                  <BenefitItem>Được dẫn theo 1 người thân đi tập</BenefitItem>
                  <BenefitItem>PT không giới hạn</BenefitItem>
                  <BenefitItem>
                    Nước uống miễn phí, khăn tập thể thao cao cấp
                  </BenefitItem>
                  <BenefitItem>
                    Ưu tiên đặt chỗ các lớp Yoga và GroupX trước 48 tiếng
                  </BenefitItem>
                  <BenefitItem>
                    Dịch vụ spa và massage tùy theo gói cụ thể
                  </BenefitItem>
                </ul>
              )}

              {membership.type === "Standard" && (
                <ul className="space-y-3">
                  <BenefitItem>Tập luyện tại 01 CLB đã chọn</BenefitItem>
                  <BenefitItem>
                    Tham gia Yoga và Group X tại 01 CLB đã chọn
                  </BenefitItem>
                  <BenefitItem>
                    Tự do tập luyện tại tất cả các câu lạc bộ trong hệ thống
                  </BenefitItem>
                  <BenefitItem>Không giới hạn thời gian luyện tập</BenefitItem>
                  <BenefitItem>
                    Sử dụng dịch vụ thư giãn sau luyện tập (sauna, steambath)
                  </BenefitItem>
                  <BenefitItem>Khăn tập thể thao cao cấp</BenefitItem>
                </ul>
              )}

              {membership.type === "Basic" && (
                <ul className="space-y-3">
                  <BenefitItem>Tập luyện tại 01 CLB đã chọn</BenefitItem>
                  <BenefitItem>
                    Tham gia Yoga và Group X tại 01 CLB đã chọn
                  </BenefitItem>
                  <BenefitItem>
                    1 buổi định hướng luyện tập và tư vấn dinh dưỡng
                  </BenefitItem>
                  <BenefitItem>
                    Sử dụng dịch vụ thư giãn (sauna, steambath)
                  </BenefitItem>
                  <BenefitItem>Nước uống miễn phí</BenefitItem>
                  <BenefitItem>Khăn tập thể thao cao cấp</BenefitItem>
                </ul>
              )}

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setShowMembershipDetails(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Đóng
                </button>
                {membership.status === "active" && (
                  <button
                    onClick={handleUpgrade}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700"
                  >
                    Nâng cấp gói
                  </button>
                )}
                {membership.status === "expired" && (
                  <button
                    onClick={handleRenewal}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg hover:from-amber-700 hover:to-orange-600"
                  >
                    Đăng ký lại
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Membership Benefits Popup */}
      {showBenefits && membership && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Quyền lợi hạng {membership.type || "Standard"}
              </h2>
              <button
                onClick={() => setShowBenefits(false)}
                className="text-gray-500 hover:text-gray-700"
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

            <div className="mb-6">
              <div
                className={`p-4 rounded-lg ${
                  membership.type === "VIP"
                    ? "bg-indigo-50 border border-indigo-100"
                    : membership.type === "Platinum"
                    ? "bg-purple-50 border border-purple-100"
                    : "bg-blue-50 border border-blue-100"
                }`}
              >
                <ul className="space-y-3">
                  {membershipBenefits[membership.type || "Standard"].map(
                    (benefit, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 mr-2 flex-shrink-0 ${
                            membership.type === "VIP"
                              ? "text-indigo-500"
                              : membership.type === "Platinum"
                              ? "text-purple-500"
                              : "text-blue-500"
                          }`}
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
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            {/* Show higher tier options if not already at the highest */}
            {membership.type !== "Platinum" && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Nâng cấp thẻ thành viên
                </h3>
                <p className="text-gray-600 mb-4">
                  Nâng cấp để nhận thêm nhiều quyền lợi hấp dẫn
                </p>
                <button
                  onClick={() => {
                    setShowBenefits(false);
                    navigate("/upgrade-membership");
                  }}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
                >
                  Nâng cấp ngay
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MembershipCard;
