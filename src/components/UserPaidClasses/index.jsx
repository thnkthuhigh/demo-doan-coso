import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PaidClassesPage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const [paidClasses, setPaidClasses] = useState([]); // Danh sách các lớp đã thanh toán
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [registeredClasses, setRegisteredClasses] = useState([]); // Danh sách các lớp đã đăng ký

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

  // Fetch user info + paid registrations
  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
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

        // Chỉ lấy các đăng ký đã thanh toán
        const paidRegs = regs.filter((reg) => reg.paymentStatus);

        // Loại bỏ trùng lịch học theo schedule._id
        const uniquePaid = paidRegs.filter(
          (reg, idx, arr) =>
            idx === arr.findIndex((r) => r.schedule._id === reg.schedule._id)
        );

        // Fetch thông tin chi tiết của từng lịch học
        const scheduleDetails = await Promise.all(
          uniquePaid.map(async ({ schedule }) => {
            // Gửi yêu cầu lấy chi tiết lịch học từ API schedules
            const scheduleRes = await fetch(
              `http://localhost:5000/api/schedules/${schedule._id}`
            );
            if (!scheduleRes.ok) throw new Error("Schedule API error");

            const scheduleInfo = await scheduleRes.json();

            return {
              ...scheduleInfo, // Lấy tất cả thông tin lịch học từ API
              className: schedule.className,
              instructor: scheduleInfo.instructor,
              startTime: scheduleInfo.startTime,
              endTime: scheduleInfo.endTime,
            };
          })
        );

        // Cập nhật lại danh sách các lớp đã thanh toán
        setRegisteredClasses(scheduleDetails);
      } catch (e) {
        console.error("Load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) return <p className="text-center py-10">Đang tải...</p>;

  return (
    <div className="min-h-screen p-6 bg-white text-gray-800">
      {/* Order Details */}
      <div className="mb-8 p-6 bg-gray-100 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Danh sách các lớp đã thanh toán
        </h2>
        {registeredClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registeredClasses.map((cls, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-800">
                  {cls.className}
                </h3>
                <p className="text-gray-600">Giảng viên: {cls.instructor}</p>
                <p className="text-gray-600">
                  Thời gian: {cls.startTime} - {cls.endTime}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Không có lớp nào đã thanh toán.</p>
        )}
      </div>
    </div>
  );
}
