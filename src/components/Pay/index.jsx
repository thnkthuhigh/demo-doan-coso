import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import BankPopup from "./BankPopup";
import { motion } from "framer-motion";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showBankPopup, setShowBankPopup] = useState(false);
  const [membershipPayment, setMembershipPayment] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState({});
  const [includeMembership, setIncludeMembership] = useState(true);

  // Thêm custom styling cho navbar khi vào trang Payment
  useEffect(() => {
    document.body.classList.add("payment-page");
    return () => {
      document.body.classList.remove("payment-page");
    };
  }, []);

  // Decode token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const payload = jwtDecode(token);
      setUserId(payload.userId);
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  // Check if we have a pending membership payment
  useEffect(() => {
    const pendingMembershipString = localStorage.getItem("pendingMembership");
    console.log(
      "Pending membership from localStorage:",
      pendingMembershipString
    );

    if (pendingMembershipString) {
      try {
        const pendingMembership = JSON.parse(pendingMembershipString);
        console.log("Parsed pending membership:", pendingMembership);
        setMembershipPayment(pendingMembership);
      } catch (error) {
        console.error("Error parsing pending membership:", error);
      }
    } else {
      // If no membership in localStorage, check if there's one from URL state
      if (location.state?.fromMembership && location.state?.membershipId) {
        const fetchMembershipDetails = async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token || !userId) return;

            const response = await fetch(
              `http://localhost:5000/api/memberships/${location.state.membershipId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              const membershipData = await response.json();
              console.log("Fetched membership data:", membershipData);

              setMembershipPayment({
                id: membershipData._id,
                type: membershipData.type,
                price: membershipData.price,
                duration: membershipData.endDate
                  ? Math.round(
                      (new Date(membershipData.endDate) -
                        new Date(membershipData.startDate)) /
                        (1000 * 60 * 60 * 24)
                    )
                  : 30,
              });
            }
          } catch (error) {
            console.error("Error fetching membership details:", error);
          }
        };

        fetchMembershipDetails();
      }
    }
  }, [location, userId]);

  // Fetch user info + unpaid class enrollments
  const fetchUnpaidRegistrations = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const [userRes, enrollmentRes] = await Promise.all([
        fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/classes/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const userInfo = await userRes.json();
      const enrollments = await enrollmentRes.json();

      if (!userRes.ok) throw new Error("User API error");
      if (!enrollmentRes.ok) throw new Error("Enrollments API error");

      setUserData({
        name: userInfo.username,
        email: userInfo.email,
        phone: userInfo.phone || "",
      });

      // Chỉ lấy các đăng ký chưa thanh toán
      const unpaidEnrollments = enrollments.filter(
        (enrollment) => !enrollment.paymentStatus
      );

      setRegisteredClasses(
        unpaidEnrollments.map((enrollment) => ({
          id: enrollment._id,
          classId: enrollment.class._id,
          name: enrollment.class.className,
          price: enrollment.class.price,
          serviceName: enrollment.class.serviceName,
          instructorName: enrollment.class.instructorName,
          schedule: enrollment.class.schedule,
        }))
      );
    } catch (e) {
      console.error("Load error:", e);
      setRegisteredClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidRegistrations();
  }, [userId]);

  // Hàm xóa đăng ký lớp học - sử dụng ClassEnrollment ID
  const handleDeleteRegistration = async (enrollmentId) => {
    if (!confirm("Bạn có chắc muốn xóa đăng ký lớp học này?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Bạn cần đăng nhập lại!");
        navigate("/login");
        return;
      }

      // Gọi API xóa ClassEnrollment
      const response = await fetch(
        `http://localhost:5000/api/classes/enrollment/${enrollmentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể xóa đăng ký");
      }

      // Cập nhật lại danh sách lớp học sau khi xóa
      setRegisteredClasses(
        registeredClasses.filter((cls) => cls.id !== enrollmentId)
      );

      // Cập nhật selectedClasses
      const newSelectedClasses = { ...selectedClasses };
      delete newSelectedClasses[enrollmentId];
      setSelectedClasses(newSelectedClasses);

      alert("Đã xóa đăng ký lớp học thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa đăng ký:", error);
      alert("Không thể xóa đăng ký. Vui lòng thử lại sau.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Initialize selected classes
  useEffect(() => {
    if (registeredClasses.length > 0) {
      const initialSelectedState = {};
      registeredClasses.forEach((cls) => {
        initialSelectedState[cls.id] = true;
      });
      setSelectedClasses(initialSelectedState);
    }
  }, [registeredClasses]);

  // Hàm chuyển đổi trạng thái chọn lớp học
  const toggleClassSelection = (classId) => {
    const newState = {
      ...selectedClasses,
      [classId]: !selectedClasses[classId],
    };
    setSelectedClasses(newState);
  };

  // Hàm tính toán tổng tiền dựa trên trạng thái đã chọn của các lớp học
  const calculateTotal = (selectedState) => {
    let sum = 0;

    // Tính tổng tiền cho các lớp học đã chọn
    Object.keys(selectedState).forEach((clsId) => {
      if (selectedState[clsId]) {
        const cls = registeredClasses.find((c) => c.id === clsId);
        if (cls) {
          sum += cls.price;
        }
      }
    });

    // Thêm tiền gói thành viên nếu có
    if (membershipPayment && includeMembership) {
      sum += membershipPayment.price;
    }

    return sum;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  const total = calculateTotal(selectedClasses);

  // Thêm hàm xử lý thanh toán
  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Chọn phương thức!");
      return;
    }

    if (selectedMethod === "Thẻ ngân hàng") {
      setShowBankPopup(true);
    } else {
      handleDirectPayment();
    }
  };

  // Xử lý thanh toán các phương thức khác
  const handleDirectPayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn cần đăng nhập lại!");
        navigate("/login");
        return;
      }

      // Lấy các ClassEnrollment ID đã chọn
      const selectedClassIds = registeredClasses
        .filter((cls) => selectedClasses[cls.id])
        .map((cls) => cls.id);

      // Kiểm tra có item nào được chọn không
      if (
        selectedClassIds.length === 0 &&
        (!membershipPayment || !includeMembership)
      ) {
        alert("Vui lòng chọn ít nhất một dịch vụ để thanh toán");
        return;
      }

      // Tạo danh sách registrationIds
      const registrationIds = [...selectedClassIds];

      // Thêm membership ID nếu có và được chọn
      if (membershipPayment && includeMembership) {
        registrationIds.push(membershipPayment.id);
      }

      // Xác định payment type
      let paymentType = "class";
      if (
        membershipPayment &&
        includeMembership &&
        selectedClassIds.length > 0
      ) {
        paymentType = "membership_and_class";
      } else if (membershipPayment && includeMembership) {
        paymentType = membershipPayment.isUpgrade
          ? "membership_upgrade"
          : "membership";
      }

      // Tạo payment với các ClassEnrollment đã chọn
      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: total,
          method: selectedMethod,
          registrationIds: registrationIds,
          status: "pending",
          paymentType: paymentType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Thanh toán lỗi");
      }

      // Clear pending membership sau khi tạo payment thành công
      if (membershipPayment && includeMembership) {
        localStorage.removeItem("pendingMembership");
        localStorage.removeItem("pendingPayment");
      }

      setShowReceipt(true);
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Không thể thanh toán. Vui lòng thử lại sau: " + error.message);
    }
  };

  // Payment method icons
  const getMethodIcon = (method) => {
    switch (method) {
      case "Thẻ ngân hàng":
        return (
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="5"
              width="20"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path d="M2 10H22" stroke="currentColor" strokeWidth="2" />
            <path
              d="M6 15H10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        );
      case "VNPay":
        return (
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 9H2M22 12H2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <rect
              x="2"
              y="5"
              width="20"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <circle cx="18" cy="15" r="1" fill="currentColor" />
            <circle cx="15" cy="15" r="1" fill="currentColor" />
          </svg>
        );
      case "Momo":
        return (
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 11C17 14.3137 14.3137 17 11 17C7.68629 17 5 14.3137 5 11C5 7.68629 7.68629 5 11 5C14.3137 5 17 7.68629 17 11Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M20 11C20 15.9706 15.9706 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11Z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        );
      case "ZaloPay":
        return (
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 9C2 7.34315 3.34315 6 5 6H19C20.6569 6 22 7.34315 22 9V15C22 16.6569 20.6569 18 19 18H5C3.34315 18 2 16.6569 2 15V9Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M6 11L9 14L14 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-indigo-900/95 to-purple-900/95"
    >
      {/* Thêm phần tạo nav backdrop */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/30 to-transparent z-40"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Thanh toán
          </h1>
          <p className="text-indigo-200 max-w-md mx-auto">
            Hoàn tất đăng ký khóa học của bạn và bắt đầu hành trình fitness ngay
            hôm nay
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-indigo-100/10 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6">
                <h2 className="text-xl font-semibold text-white">
                  Chi tiết đơn hàng
                </h2>
              </div>

              <div className="p-6">
                {registeredClasses.length === 0 && !membershipPayment ? (
                  <div className="py-10 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p className="text-gray-500 mb-4">
                      Không có mục nào cần thanh toán.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => navigate("/classes")}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Tìm lớp học
                      </button>
                      <button
                        onClick={() => navigate("/membership")}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                      >
                        Đăng ký gói tập
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Classes section */}
                    {registeredClasses.length > 0 && (
                      <>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-gray-700">
                            Lớp học đã đăng ký
                          </h3>

                          <button
                            onClick={() => {
                              const newSelectedState = {};
                              const allSelected = registeredClasses.every(
                                (cls) => selectedClasses[cls.id]
                              );

                              registeredClasses.forEach((cls) => {
                                newSelectedState[cls.id] = !allSelected;
                              });

                              setSelectedClasses(newSelectedState);
                            }}
                            className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors"
                          >
                            {registeredClasses.every(
                              (cls) => selectedClasses[cls.id]
                            )
                              ? "Bỏ chọn tất cả"
                              : "Chọn tất cả"}
                          </button>
                        </div>

                        {registeredClasses.map((cls) => (
                          <div
                            key={cls.id}
                            className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                          >
                            <div className="flex items-center flex-grow">
                              <input
                                type="checkbox"
                                id={`class-${cls.id}`}
                                checked={selectedClasses[cls.id] || false}
                                onChange={() => toggleClassSelection(cls.id)}
                                className="mr-3 h-5 w-5 accent-indigo-600 cursor-pointer"
                              />
                              <div>
                                <label
                                  htmlFor={`class-${cls.id}`}
                                  className="font-medium text-gray-800 cursor-pointer"
                                >
                                  {cls.name}
                                </label>
                                <p className="text-sm text-gray-500">
                                  {cls.serviceName} - HLV:{" "}
                                  {cls.instructorName || "Chưa có"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Mã đăng ký: {cls.id.slice(-6)}
                                </p>
                              </div>
                            </div>
                            <span className="mx-4 font-semibold text-gray-800">
                              {cls.price.toLocaleString()}đ
                            </span>
                            <button
                              onClick={() => handleDeleteRegistration(cls.id)}
                              className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
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
                        ))}
                      </>
                    )}

                    {/* Membership payment info */}
                    {membershipPayment && (
                      <>
                        {registeredClasses.length > 0 && (
                          <h3 className="font-semibold text-gray-700 mt-6 mb-2">
                            Gói tập
                          </h3>
                        )}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="membership-checkbox"
                                checked={includeMembership}
                                onChange={() =>
                                  setIncludeMembership(!includeMembership)
                                }
                                className="mr-3 h-5 w-5 accent-indigo-600 cursor-pointer"
                              />
                              <div>
                                <label
                                  htmlFor="membership-checkbox"
                                  className="font-semibold text-indigo-800 cursor-pointer"
                                >
                                  {membershipPayment.name ||
                                    `Gói ${membershipPayment.type}`}
                                </label>
                                <p className="text-sm text-gray-600">
                                  Thời hạn:{" "}
                                  {membershipPayment.duration
                                    ? membershipPayment.duration === 30
                                      ? "1 tháng"
                                      : membershipPayment.duration === 90
                                      ? "3 tháng"
                                      : membershipPayment.duration === 180
                                      ? "6 tháng"
                                      : membershipPayment.duration === 365
                                      ? "12 tháng"
                                      : `${membershipPayment.duration} ngày`
                                    : "30 ngày"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Mã thẻ:{" "}
                                  {membershipPayment.id.substring(
                                    membershipPayment.id.length - 6
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-indigo-800">
                                {new Intl.NumberFormat("vi-VN").format(
                                  membershipPayment.price
                                )}
                                đ
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Total section */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Tạm tính</span>
                        <span className="text-gray-800">
                          {total.toLocaleString()}đ
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-600">Giảm giá</span>
                        <span className="text-gray-800">0đ</span>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                        <span className="font-bold text-lg text-gray-900">
                          Tổng thanh toán
                        </span>
                        <span className="font-bold text-lg text-indigo-600">
                          {total.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6">
                <h2 className="text-xl font-semibold text-white">
                  Phương thức thanh toán
                </h2>
              </div>

              <div className="p-6">
                {["Thẻ ngân hàng", "VNPay", "Momo", "ZaloPay"].map((m) => (
                  <label
                    key={m}
                    className={`flex items-center gap-3 p-4 mb-3 border rounded-xl cursor-pointer transition-all ${
                      selectedMethod === m
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={m}
                      checked={selectedMethod === m}
                      onChange={() => setSelectedMethod(m)}
                      className="w-5 h-5 accent-indigo-600"
                    />
                    <span className="text-indigo-500">{getMethodIcon(m)}</span>
                    <span className="font-medium text-gray-800">{m}</span>
                  </label>
                ))}

                <div className="mt-8">
                  <button
                    onClick={handlePayment}
                    disabled={
                      (registeredClasses.length === 0 && !membershipPayment) ||
                      !selectedMethod
                    }
                    className={`w-full py-3 px-6 rounded-xl font-medium text-white shadow-sm flex items-center justify-center ${
                      (registeredClasses.length === 0 && !membershipPayment) ||
                      !selectedMethod
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    } transition-all duration-300`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    Thanh toán {total > 0 ? `(${total.toLocaleString()}đ)` : ""}
                  </button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-500">
                  <p className="flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Thanh toán an toàn & bảo mật
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bank Payment Popup */}
        {showBankPopup && (
          <BankPopup
            show={showBankPopup}
            onClose={(success) => {
              setShowBankPopup(false);
              if (success) {
                setShowReceipt(true);
              }
            }}
            amount={total}
            userData={userData}
            registeredClasses={registeredClasses}
            selectedClasses={selectedClasses}
            membershipPayment={membershipPayment}
            includeMembership={includeMembership}
          />
        )}

        {/* Receipt - Display after payment */}
        {showReceipt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 py-4 px-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Phiếu thanh toán
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Thông tin cá nhân
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
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
                      <p>
                        <span className="font-medium">Họ tên:</span>{" "}
                        {userData.name}
                      </p>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {userData.email}
                      </p>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <p>
                        <span className="font-medium">SĐT:</span>{" "}
                        {userData.phone || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
                    Thông tin thanh toán
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <p>
                        <span className="font-medium">PT thanh toán:</span>{" "}
                        {selectedMethod}
                      </p>
                    </div>
                    <div className="flex items-center text-orange-500 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3"
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
                      <p>Đang chờ xác nhận thanh toán</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Chi tiết đơn hàng
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {/* Chỉ hiển thị các lớp học đã chọn */}
                    {registeredClasses
                      .filter((cls) => selectedClasses[cls.id])
                      .map((cls) => (
                        <div
                          key={cls.id}
                          className="flex justify-between py-2 border-b border-gray-200"
                        >
                          <span className="text-gray-700">{cls.name}</span>
                          <span className="font-medium">
                            {cls.price.toLocaleString()}đ
                          </span>
                        </div>
                      ))}

                    {/* Chỉ hiển thị membership nếu được chọn */}
                    {membershipPayment && includeMembership && (
                      <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-gray-700">
                          {membershipPayment.name ||
                            `Gói ${membershipPayment.type}`}
                        </span>
                        <span className="font-medium">
                          {membershipPayment.price.toLocaleString()}đ
                        </span>
                      </div>
                    )}

                    {/* Tổng cộng */}
                    <div className="flex justify-between py-3 mt-2 border-t border-gray-300">
                      <span className="font-bold text-gray-900">
                        Tổng cộng:
                      </span>
                      <span className="font-bold text-indigo-600">
                        {total.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => navigate("/my-classes")}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg shadow-sm flex items-center transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                  Xem danh sách lớp học đã đăng ký
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
