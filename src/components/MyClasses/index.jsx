import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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

  if (loading) return <p className="text-center py-10">Đang tải...</p>;

  const renderPaymentStatus = (status) => {
    if (status) {
      return <span className="text-green-500 font-medium">Đã thanh toán</span>;
    }
    return <span className="text-orange-500 font-medium">Chờ xác nhận</span>;
  };

  // Nhóm các lớp theo trạng thái thanh toán
  const paidClasses = registrations.filter((reg) => reg.paymentStatus);
  const pendingClasses = registrations.filter((reg) => !reg.paymentStatus);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Lớp học đã đăng ký</h1>

      {registrations.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="mb-4">Bạn chưa đăng ký lớp học nào</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => navigate("/classes")}
          >
            Đăng ký ngay
          </button>
        </div>
      ) : (
        <>
          {/* Các lớp đã thanh toán */}
          {paidClasses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-green-600">
                Lớp học đã thanh toán ({paidClasses.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paidClasses.map((reg) => (
                  <div
                    key={reg._id}
                    className="border rounded-lg shadow-sm overflow-hidden bg-white border-green-200"
                  >
                    <div className="bg-green-50 px-4 py-2 border-b border-green-200">
                      <h3 className="font-semibold">
                        {reg.schedule?.className || "Lớp học"}
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Ngày học:</span>{" "}
                          {new Date(reg.schedule?.date).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Giờ học:</span>{" "}
                          {reg.schedule?.timeStart} - {reg.schedule?.timeEnd}
                        </p>
                        <p>
                          <span className="font-medium">Giá:</span>{" "}
                          {reg.schedule?.price?.toLocaleString()}đ
                        </p>
                        <p>
                          <span className="font-medium">Trạng thái:</span>{" "}
                          {renderPaymentStatus(reg.paymentStatus)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Các lớp chờ thanh toán */}
          {pendingClasses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-orange-600">
                Lớp học chờ thanh toán ({pendingClasses.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingClasses.map((reg) => (
                  <div
                    key={reg._id}
                    className="border rounded-lg shadow-sm overflow-hidden bg-white border-orange-200"
                  >
                    <div className="bg-orange-50 px-4 py-2 border-b border-orange-200">
                      <h3 className="font-semibold">
                        {reg.schedule?.className || "Lớp học"}
                      </h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Ngày học:</span>{" "}
                          {new Date(reg.schedule?.date).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Giờ học:</span>{" "}
                          {reg.schedule?.timeStart} - {reg.schedule?.timeEnd}
                        </p>
                        <p>
                          <span className="font-medium">Giá:</span>{" "}
                          {reg.schedule?.price?.toLocaleString()}đ
                        </p>
                        <p>
                          <span className="font-medium">Trạng thái:</span>{" "}
                          {renderPaymentStatus(reg.paymentStatus)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <p className="text-sm">
                  Bạn có {pendingClasses.length} lớp học đang chờ thanh toán.
                </p>
                <button
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  onClick={() => navigate("/payment")}
                >
                  Thanh toán ngay
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className="flex justify-center mt-6">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/classes")}
        >
          Đăng ký thêm lớp học
        </button>
      </div>
    </div>
  );
}
