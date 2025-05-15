import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion"; // Thêm animation

export default function MyClasses() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  // Kiểm tra đăng nhập
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

  // Lấy danh sách lớp học đã đăng ký
  useEffect(() => {
    if (!userId) return;

    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/registrations/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể lấy danh sách lớp học");
        }

        const data = await response.json();
        setRegistrations(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách lớp học:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [userId]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }

  const renderPaymentStatus = (status) => {
    if (status) {
      return (
        <span className="text-emerald-500 font-medium">Đã thanh toán</span>
      );
    }
    return <span className="text-amber-500 font-medium">Chờ xác nhận</span>;
  };

  // Nhóm các lớp theo trạng thái thanh toán
  const paidClasses = registrations.filter((reg) => reg.paymentStatus);
  const pendingClasses = registrations.filter((reg) => !reg.paymentStatus);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Lớp học đã đăng ký
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Quản lý các lớp học bạn đã đăng ký và theo dõi trạng thái thanh toán
          </p>
        </motion.div>

        {registrations.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl shadow-md p-10 text-center max-w-xl mx-auto"
          >
            <div className="mb-6 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Bạn chưa đăng ký lớp học nào
            </h2>
            <p className="text-gray-600 mb-6">
              Khám phá các lớp học của chúng tôi và bắt đầu hành trình fitness
              của bạn ngay hôm nay.
            </p>
            <button
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              onClick={() => navigate("/classes")}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Đăng ký ngay
            </button>
          </motion.div>
        ) : (
          <>
            {/* Các lớp đã thanh toán */}
            {paidClasses.length > 0 && (
              <motion.div variants={itemVariants} className="mb-10">
                <div className="flex items-center mb-5">
                  <div className="bg-emerald-100 p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Lớp học đã thanh toán{" "}
                    <span className="text-emerald-500 font-medium">
                      ({paidClasses.length})
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paidClasses.map((reg) => (
                    <motion.div
                      key={reg._id}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-xl border border-emerald-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
                    >
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-white flex items-center justify-between">
                        <h3 className="font-semibold truncate">
                          {reg.schedule?.className || "Lớp học"}
                        </h3>
                        <span className="bg-white/20 text-xs py-1 px-2 rounded-full">
                          Đã xác nhận
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Ngày học</p>
                              <p className="font-medium text-gray-800">
                                {new Date(
                                  reg.schedule?.date
                                ).toLocaleDateString("vi-VN", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
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
                            <div>
                              <p className="text-xs text-gray-500">Giờ học</p>
                              <p className="font-medium text-gray-800">
                                {reg.schedule?.timeStart} -{" "}
                                {reg.schedule?.timeEnd}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                              />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Giá</p>
                              <p className="font-medium text-gray-800">
                                {reg.schedule?.price?.toLocaleString()}đ
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-emerald-500 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-emerald-600 font-medium">
                              Đã thanh toán
                            </span>
                          </div>

                          <button
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            onClick={() =>
                              navigate(`/classes/${reg.schedule?._id}`)
                            }
                          >
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Các lớp chờ thanh toán */}
            {pendingClasses.length > 0 && (
              <motion.div variants={itemVariants} className="mb-10">
                <div className="flex items-center mb-5">
                  <div className="bg-amber-100 p-2 rounded-lg mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-amber-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Lớp học chờ thanh toán{" "}
                    <span className="text-amber-500 font-medium">
                      ({pendingClasses.length})
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pendingClasses.map((reg) => (
                    <motion.div
                      key={reg._id}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-xl border border-amber-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-200"
                    >
                      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-3 text-white flex items-center justify-between">
                        <h3 className="font-semibold truncate">
                          {reg.schedule?.className || "Lớp học"}
                        </h3>
                        <span className="bg-white/20 text-xs py-1 px-2 rounded-full">
                          Chờ thanh toán
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Ngày học</p>
                              <p className="font-medium text-gray-800">
                                {new Date(
                                  reg.schedule?.date
                                ).toLocaleDateString("vi-VN", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
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
                            <div>
                              <p className="text-xs text-gray-500">Giờ học</p>
                              <p className="font-medium text-gray-800">
                                {reg.schedule?.timeStart} -{" "}
                                {reg.schedule?.timeEnd}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                              />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Giá</p>
                              <p className="font-medium text-gray-800">
                                {reg.schedule?.price?.toLocaleString()}đ
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-amber-500 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-amber-600 font-medium">
                              Chờ thanh toán
                            </span>
                          </div>

                          <button
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            onClick={() =>
                              navigate(`/classes/${reg.schedule?._id}`)
                            }
                          >
                            Chi tiết
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  variants={itemVariants}
                  className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl overflow-hidden shadow-sm border border-amber-100"
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0 text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-amber-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="font-bold text-lg text-gray-800">
                          Thanh toán lớp học
                        </h3>
                      </div>
                      <p className="text-gray-600 max-w-md">
                        Bạn có{" "}
                        <span className="font-semibold text-amber-600">
                          {pendingClasses.length} lớp học
                        </span>{" "}
                        đang chờ thanh toán. Vui lòng thanh toán để hoàn tất
                        đăng ký và đảm bảo chỗ học.
                      </p>
                    </div>
                    <button
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-colors shadow-sm whitespace-nowrap"
                      onClick={() => navigate("/payment")}
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
                      Thanh toán ngay
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </>
        )}

        <motion.div
          variants={itemVariants}
          className="flex justify-center mt-8"
        >
          <button
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
            onClick={() => navigate("/classes")}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Đăng ký thêm lớp học
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
