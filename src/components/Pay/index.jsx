import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [registeredClasses, setRegisteredClasses] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [loading, setLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [userId, setUserId] = useState(null);

  // 1) Decode token only once
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

  // 2) Fetch user info + registrations
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const [userRes, regRes] = await Promise.all([
          fetch(`http://localhost:5000/api/users/${userId}`),
          fetch(`http://localhost:5000/api/registrations/user/${userId}`),
        ]);

        console.log("/api/users status:", userRes.status);
        console.log("/api/registrations status:", regRes.status);

        const userInfo = await userRes.json();
        const regs = await regRes.json();

        if (!userRes.ok) throw new Error("User API error");
        if (!regRes.ok) throw new Error("Registrations API error");

        console.log("📋 User payload:", userInfo);
        console.log("📋 Registrations payload:", regs);
        setUserData({
          name: userInfo.username,
          email: userInfo.email,
          phone: userInfo.phone || "",
        });

        // Filter duplicates by schedule._id
        const uniqueBySchedule = regs.filter(
          (reg, idx, arr) =>
            idx === arr.findIndex((r) => r.schedule._id === reg.schedule._id)
        );

        setRegisteredClasses(
          uniqueBySchedule.map(({ schedule }) => ({
            name: schedule.className,
            price: schedule.price,
          }))
        );
      } catch (e) {
        console.error("Load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) return <p className="text-center py-10">Đang tải...</p>;

  const total = registeredClasses.reduce((sum, c) => sum + c.price, 0);

  return (
    <div className="min-h-screen p-6 bg-white text-gray-800">
      {/* Order Details */}
      <div className="mb-8 p-6 bg-gray-100 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Chi tiết đơn hàng</h2>
        {registeredClasses.length > 0 ? (
          registeredClasses.map((cls, i) => (
            <div key={i} className="flex justify-between mb-2">
              <span>{cls.name}</span>
              <span>{cls.price.toLocaleString()}đ</span>
            </div>
          ))
        ) : (
          <p>Không có lớp nào trong đơn hàng.</p>
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
          onClick={() =>
            selectedMethod ? setShowReceipt(true) : alert("Chọn phương thức!")
          }
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Thanh toán
        </button>
      </div>

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
            {registeredClasses.map((cls, i) => (
              <div key={i} className="flex justify-between mb-2">
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
          </div>
          <button
            onClick={async () => {
              try {
                await fetch("http://localhost:5000/api/payments", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId,
                    amount: total,
                    method: selectedMethod,
                  }),
                });
                alert("Thanh toán thành công!");
                navigate("/bill");
              } catch {
                alert("Thanh toán lỗi");
              }
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg"
          >
            Xác nhận
          </button>
        </div>
      )}
    </div>
  );
}
