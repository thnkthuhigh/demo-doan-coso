import React, { useState } from "react"; // Add useState import
import { motion } from "framer-motion";

export default function BankPopup({
  show,
  onClose,
  amount,
  userData,
  registeredClasses,
  selectedClasses, // Add this prop
  membershipPayment, // Add this prop
  includeMembership, // Add this prop
}) {
  const [processing, setProcessing] = useState(false); // Add missing state

  if (!show) return null;

  const bankInfo = {
    bankName: "MbBank",
    accountNumber: "0359498968",
    accountName: "NGUYEN CHI THANH",
    content: `GYM-${userData.phone || "PAYMENT"}`,
  };

  // Modify the handlePaymentSubmit function to handle membership
  const handlePaymentSubmit = async () => {
    try {
      setProcessing(true); // Now this will work

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Cần đăng nhập lại!");
        setProcessing(false);
        return;
      }

      // Get only the selected class IDs from props instead of window.parent
      const selectedClassIds = registeredClasses
        .filter((cls) => selectedClasses[cls.id])
        .map((cls) => cls.id);

      // Add membership if selected
      const registrationIds = [...selectedClassIds];
      if (membershipPayment && includeMembership) {
        registrationIds.push(membershipPayment.id);
      }

      console.log("Creating payment with registrationIds:", registrationIds);

      // Create payment with only selected registrations
      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          method: "Thẻ ngân hàng",
          registrationIds,
          status: "pending",
          paymentType:
            registrationIds.length > 1 && membershipPayment
              ? "membership_and_class"
              : membershipPayment
              ? "membership"
              : "class",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment creation failed");
      }

      // Clear pending membership if it was included
      if (membershipPayment && includeMembership) {
        localStorage.removeItem("pendingMembership");
        localStorage.removeItem("pendingPayment");
      }

      // Show success message
      alert("Đã ghi nhận thanh toán. Vui lòng chờ admin xác nhận.");

      setTimeout(() => {
        setProcessing(false);
        onClose(true); // Pass true to indicate successful payment
      }, 1500);
    } catch (error) {
      console.error("Bank payment error:", error);
      setProcessing(false);
      alert("Payment processing failed: " + error.message);
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
        {/* Header section */}
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
              disabled={processing}
              className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center ${
                processing ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {processing ? (
                <>
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
                  Đang xử lý...
                </>
              ) : (
                <>
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
                </>
              )}
            </button>

            <button
              onClick={onClose}
              disabled={processing}
              className={`w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors ${
                processing ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              Quay lại
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
