import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function PaymentPage() {
  const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [order, setOrder] = useState({
    classes: [
      { name: "Yoga Buổi Sáng", price: 150000 },
      { name: "Tập Lực Cường Độ Cao", price: 200000 },
    ],
  });
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const totalAmount = order.classes.reduce((sum, cls) => sum + cls.price, 0);

  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }
    setShowPaymentConfirmation(true);
  };

  const handlePaymentConfirm = () => {
    alert("Thanh toán thành công!");
    setIsPaid(true); // Khi thanh toán thành công, điều hướng đến trang hóa đơn
    navigate("/bill"); // Điều hướng đến trang hóa đơn (BillPage)
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      {/* Thông tin đơn hàng và phương thức thanh toán */}
      <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>
        {order.classes.map((cls, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center mb-2 text-lg"
          >
            <span>{cls.name}</span>
            <span>{cls.price.toLocaleString()}đ</span>
          </div>
        ))}
        <hr className="my-4" />
        <div className="flex justify-between text-xl font-bold">
          <span>Tổng cộng:</span>
          <span>{totalAmount.toLocaleString()}đ</span>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">
          Chọn phương thức thanh toán
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PaymentMethod
            label="Thẻ ngân hàng"
            value="Thẻ ngân hàng"
            selected={selectedMethod}
            onChange={setSelectedMethod}
          />
          <PaymentMethod
            label="VNPay"
            value="VNPay"
            selected={selectedMethod}
            onChange={setSelectedMethod}
          />
          <PaymentMethod
            label="Momo"
            value="Momo"
            selected={selectedMethod}
            onChange={setSelectedMethod}
          />
          <PaymentMethod
            label="ZaloPay"
            value="ZaloPay"
            selected={selectedMethod}
            onChange={setSelectedMethod}
          />
        </div>
        <button
          onClick={handlePayment}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg mt-4"
        >
          Thanh toán
        </button>
      </div>

      {/* Phiếu thanh toán */}
      {showPaymentConfirmation && (
        <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Phiếu thanh toán</h2>

          {/* Thông tin cá nhân người dùng */}
          <div className="mb-4">
            <h3 className="font-semibold">Thông tin cá nhân:</h3>
            <div>
              <strong>Tên: </strong>
              {userData.name}
            </div>
            <div>
              <strong>Email: </strong>
              {userData.email}
            </div>
            <div>
              <strong>Số điện thoại: </strong>
              {userData.phone}
            </div>
          </div>

          {/* Chi tiết dịch vụ */}
          <div className="mb-4">
            <h3 className="font-semibold">Chi tiết dịch vụ:</h3>
            {order.classes.map((cls, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center mb-2 text-lg"
              >
                <span>{cls.name}</span>
                <span>{cls.price.toLocaleString()}đ</span>
              </div>
            ))}
            <hr className="my-4" />
            <div className="flex justify-between text-xl font-bold">
              <span>Tổng cộng:</span>
              <span>{totalAmount.toLocaleString()}đ</span>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="mb-4">
            <h3 className="font-semibold">Phương thức thanh toán:</h3>
            <p>{selectedMethod}</p>
          </div>

          {/* Xác nhận thanh toán */}
          <button
            onClick={handlePaymentConfirm}
            className="bg-green-600 text-white px-6 py-2 rounded-lg mt-4"
          >
            Xác nhận thanh toán
          </button>
        </div>
      )}
    </div>
  );
}

function PaymentMethod({ label, value, selected, onChange }) {
  return (
    <label className="flex items-center gap-3 bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition">
      <input
        type="radio"
        name="payment-method"
        value={value}
        checked={selected === value}
        onChange={() => onChange(value)}
        className="accent-blue-600 w-5 h-5"
      />
      <span className="text-lg">{label}</span>
    </label>
  );
}
