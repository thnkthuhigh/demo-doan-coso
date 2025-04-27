import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);

  const userId = "6616e899125c8e4c6b4b5a1e"; // giả sử userId cố định

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch thông tin người dùng
        const userRes = await fetch(
          `http://localhost:5000/api/users/${userId}`
        );
        const userData = await userRes.json();
        setUserData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });

        // Fetch các lớp đã đăng ký
        const regRes = await fetch(
          `http://localhost:5000/api/classregistrations/user/${userId}`
        );
        const registrations = await regRes.json();

        // Fetch chi tiết từng lớp học dựa trên scheduleId
        const classDetailsPromises = registrations.map(async (reg) => {
          const scheduleRes = await fetch(
            `http://localhost:5000/api/schedules/${reg.schedule._id}`
          );
          const scheduleData = await scheduleRes.json();
          return {
            name: scheduleData.name || "Lớp học không xác định",
            price: scheduleData.price || 0,
          };
        });

        const classes = await Promise.all(classDetailsPromises);
        setRegisteredClasses(classes);
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalAmount = registeredClasses.reduce(
    (sum, cls) => sum + cls.price,
    0
  );

  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Vui lòng chọn phương thức thanh toán.");
      return;
    }
    setShowPaymentConfirmation(true);
  };

  const handlePaymentConfirm = async () => {
    try {
      await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount: totalAmount,
          method: selectedMethod,
        }),
      });

      alert("Thanh toán thành công!");
      navigate("/bill");
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      alert("Thanh toán thất bại.");
    }
  };

  if (loading) return <p className="text-center py-10">Đang tải dữ liệu...</p>;

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      {/* Thông tin đơn hàng */}
      <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>
        {registeredClasses.length > 0 ? (
          registeredClasses.map((cls, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center mb-2 text-lg"
            >
              <span>{cls.name}</span>
              <span>{cls.price.toLocaleString()}đ</span>
            </div>
          ))
        ) : (
          <p>Không có lớp nào trong đơn hàng.</p>
        )}
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

          <div className="mb-4">
            <h3 className="font-semibold">Chi tiết dịch vụ:</h3>
            {registeredClasses.map((cls, idx) => (
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

          <div className="mb-4">
            <h3 className="font-semibold">Phương thức thanh toán:</h3>
            <p>{selectedMethod}</p>
          </div>

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
