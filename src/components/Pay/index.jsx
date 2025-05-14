import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import BankPopup from "./BankPopup";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showBankPopup, setShowBankPopup] = useState(false);

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

  // Fetch user info + unpaid registrations
  const fetchUnpaidRegistrations = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const [userRes, regRes] = await Promise.all([
        fetch(`http://localhost:5000/api/users/${userId}`),
        fetch(`http://localhost:5000/api/registrations/user/${userId}`),
      ]);

      const userInfo = await userRes.json();
      const regs = await regRes.json();

      if (!userRes.ok) throw new Error("User API error");
      if (!regRes.ok) throw new Error("Registrations API error");

      setUserData({
        name: userInfo.username,
        email: userInfo.email,
        phone: userInfo.phone || "",
      });

      // Chỉ lấy các đăng ký chưa thanh toán
      const unpaidRegs = regs.filter((reg) => !reg.paymentStatus);

      // Loại bỏ trùng lịch học theo schedule._id
      const uniqueUnpaid = unpaidRegs.filter(
        (reg, idx, arr) =>
          idx === arr.findIndex((r) => r.schedule._id === reg.schedule._id)
      );

      setRegisteredClasses(
        uniqueUnpaid.map((reg) => ({
          id: reg._id,
          scheduleId: reg.schedule._id,
          name: reg.schedule.className,
          price: reg.schedule.price,
        }))
      );
    } catch (e) {
      console.error("Load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidRegistrations();
  }, [userId]);

  // Hàm xóa đăng ký lớp học - kiểm tra lại code này
  const handleDeleteRegistration = async (registrationId) => {
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

      const response = await fetch(
        `http://localhost:5000/api/registrations/${registrationId}`,
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
        registeredClasses.filter((cls) => cls.id !== registrationId)
      );
      alert("Đã xóa đăng ký lớp học thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa đăng ký:", error);
      alert("Không thể xóa đăng ký. Vui lòng thử lại sau.");
    }
  };

  if (loading) return <p className="text-center py-10">Đang tải...</p>;

  const total = registeredClasses.reduce((sum, c) => sum + c.price, 0);

  // Thêm hàm xử lý thanh toán
  const handlePayment = () => {
    if (!selectedMethod) {
      alert("Chọn phương thức!");
      return;
    }

    if (selectedMethod === "Thẻ ngân hàng") {
      setShowBankPopup(true);
    } else {
      // Xử lý thanh toán trực tiếp với các phương thức khác
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

      const response = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          amount: total,
          method: selectedMethod,
          registrationIds: registeredClasses.map((cls) => cls.id),
          status: "pending",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Thanh toán lỗi");
      }

      setShowReceipt(true);
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Không thể thanh toán. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-gray-800">
      {/* Order Details */}
      <div className="mb-8 p-6 bg-gray-100 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>
        {registeredClasses.length > 0 ? (
          registeredClasses.map((cls) => (
            <div
              key={cls.id}
              className="flex justify-between mb-2 items-center"
            >
              <span className="flex-grow">{cls.name}</span>
              <span className="mx-4">{cls.price.toLocaleString()}đ</span>
              <button
                onClick={() => handleDeleteRegistration(cls.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          ))
        ) : (
          <p>Không có lớp nào cần thanh toán.</p>
        )}
        <hr className="my-4" />
        <div className="flex justify-between font-bold">
          <span>Tổng cộng:</span>
          <span>{total.toLocaleString()}đ</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-8 p-6 bg-gray-100 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">
          Chọn phương thức thanh toán
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Thẻ ngân hàng", "VNPay", "Momo", "ZaloPay"].map((m) => (
            <label
              key={m}
              className="flex items-center gap-3 p-4 bg-white border rounded-lg cursor-pointer"
            >
              <input
                type="radio"
                value={m}
                checked={selectedMethod === m}
                onChange={() => setSelectedMethod(m)}
                className="w-5 h-5 accent-blue-600"
              />
              <span>{m}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handlePayment}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          disabled={registeredClasses.length === 0}
        >
          Thanh toán
        </button>
      </div>

      {/* Bank Payment Popup */}
      <BankPopup
        show={showBankPopup}
        onClose={() => {
          setShowBankPopup(false);
          setShowReceipt(true);
        }}
        amount={total}
        userData={{ ...userData, id: userId }}
        registeredClasses={registeredClasses}
      />

      {/* Receipt */}
      {showReceipt && (
        <div className="p-6 bg-gray-100 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Phiếu thanh toán</h2>
          <div className="mb-4">
            <h3 className="font-semibold">Thông tin cá nhân:</h3>
            <p>
              <strong>Tên:</strong> {userData.name}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>SĐT:</strong> {userData.phone}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Danh sách lớp:</h3>
            {registeredClasses.map((cls) => (
              <div key={cls.id} className="flex justify-between mb-2">
                <span>{cls.name}</span>
                <span>{cls.price.toLocaleString()}đ</span>
              </div>
            ))}
            <hr className="my-4" />
            <div className="flex justify-between font-bold">
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString()}đ</span>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">PT thanh toán:</h3>
            <p>{selectedMethod}</p>
            <p className="mt-2 text-orange-500">Đang chờ xác nhận thanh toán</p>
          </div>
          <button
            onClick={() => navigate("/my-classes")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg"
          >
            Xem danh sách lớp học đã đăng ký
          </button>
        </div>
      )}
    </div>
  );
}
