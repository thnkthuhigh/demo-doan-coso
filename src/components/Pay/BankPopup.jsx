import React from "react";
import { motion } from "framer-motion"; // Đảm bảo bạn đã import motion

export default function BankPopup({
  show,
  onClose,
  amount,
  userData,
  registeredClasses,
}) {
  if (!show) return null;

  const bankInfo = {
    bankName: "MbBank",
    accountNumber: "0359498968",
    accountName: "NGUYEN CHI THANH",
    content: `GYM-${userData.phone || "PAYMENT"}`,
  };

  const handlePaymentSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Cần đăng nhập lại!");
        return;
      }

      // Lưu thông tin thanh toán chờ xác nhận
      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userData.id,
          amount: amount,
          method: "Thẻ ngân hàng",
          registrationIds: registeredClasses.map((cls) => cls.id), // Lưu danh sách ID đăng ký
          status: "pending", // Trạng thái chờ xác nhận
        }),
      });

      if (!response.ok) {
        throw new Error("Không thể tạo thanh toán");
      }

      alert("Thanh toán của bạn đã được ghi nhận và đang chờ xác nhận!");
      onClose();
    } catch (error) {
      console.error("Lỗi khi gửi thanh toán:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white rounded-2xl max-w-md w-full shadow-xl my-8"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-4 px-6 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white flex items-center">
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
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Thông tin chuyển khoản
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
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
        </div>

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">Ngân hàng</p>
                <p className="font-semibold text-gray-800">
                  {bankInfo.bankName}
                </p>
              </div>

              <div className="bg-indigo-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 mb-1">Số tài khoản</p>
                <div className="flex items-center">
                  <p className="font-semibold text-gray-800 mr-2 truncate">
                    {bankInfo.accountNumber}
                  </p>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(bankInfo.accountNumber)
                    }
                    className="text-indigo-600 hover:text-indigo-800 transition-colors flex-shrink-0"
                    title="Sao chép"
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
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Chủ tài khoản</p>
              <p className="font-semibold text-gray-800">
                {bankInfo.accountName}
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Số tiền</p>
              <div className="flex items-center">
                <p className="font-semibold text-gray-800 mr-2 text-lg">
                  {amount.toLocaleString()}đ
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(amount)}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                  title="Sao chép"
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
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">
                Nội dung chuyển khoản
              </p>
              <div className="flex items-center">
                <p className="font-semibold text-gray-800 mr-2 truncate">
                  {bankInfo.content}
                </p>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(bankInfo.content)
                  }
                  className="text-indigo-600 hover:text-indigo-800 transition-colors flex-shrink-0"
                  title="Sao chép"
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
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-3 flex justify-center">
              <img
                src={`https://img.vietqr.io/image/${bankInfo.bankName}-${bankInfo.accountNumber}-compact2.png?amount=${amount}&addInfo=${bankInfo.content}`}
                alt="QR Code"
                className="h-48 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-10">
          <div className="flex flex-col space-y-3">
            <button
              onClick={handlePaymentSubmit}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center"
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Đã chuyển khoản xong
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
