import React from "react";

export default function BankPopup({ show, onClose, amount, userData }) {
  if (!show) return null;

  const bankInfo = {
    bankName: "MbBank",
    accountNumber: "0359498968",
    accountName: "NGUYEN CHI THANH",
    content: `GYM-${userData.phone || "PAYMENT"}`,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Thông tin chuyển khoản</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-gray-600">Ngân hàng</p>
            <p className="font-semibold">{bankInfo.bankName}</p>
          </div>

          <div>
            <p className="text-gray-600">Số tài khoản</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{bankInfo.accountNumber}</p>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(bankInfo.accountNumber)
                }
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="text-gray-600">Chủ tài khoản</p>
            <p className="font-semibold">{bankInfo.accountName}</p>
          </div>

          <div>
            <p className="text-gray-600">Số tiền</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{amount.toLocaleString()}đ</p>
              <button
                onClick={() => navigator.clipboard.writeText(amount)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <p className="text-gray-600">Nội dung chuyển khoản</p>
            <div className="flex items-center gap-2">
              <p className="font-semibold">{bankInfo.content}</p>
              <button
                onClick={() => navigator.clipboard.writeText(bankInfo.content)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Copy
              </button>
            </div>
          </div>

          <img
            src={`https://img.vietqr.io/image/${bankInfo.bankName}-${bankInfo.accountNumber}-compact2.png?amount=${amount}&addInfo=${bankInfo.content}`}
            alt="QR Code"
            className="w-full mt-4"
          />

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Đã chuyển khoản xong
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
