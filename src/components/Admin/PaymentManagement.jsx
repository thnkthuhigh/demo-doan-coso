import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PaymentManagement() {
  const navigate = useNavigate();
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra xác thực và quyền admin
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        navigate("/");
        return;
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    // Lấy danh sách thanh toán chờ xác nhận
    const fetchPendingPayments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5000/api/payments/pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể tải danh sách thanh toán");
        }

        const data = await response.json();
        setPendingPayments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPayments();
  }, [navigate]);

  const handleApprovePayment = async (paymentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/payments/approve/${paymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xác nhận thanh toán");
      }

      // Cập nhật UI bằng cách xóa thanh toán đã xác nhận
      setPendingPayments((prev) => prev.filter((p) => p._id !== paymentId));
      alert("Đã xác nhận thanh toán thành công!");
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  const handleRejectPayment = async (paymentId) => {
    const reason = prompt("Nhập lý do từ chối:");
    if (!reason) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/payments/reject/${paymentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể từ chối thanh toán");
      }

      // Cập nhật UI bằng cách xóa thanh toán đã từ chối
      setPendingPayments((prev) => prev.filter((p) => p._id !== paymentId));
      alert("Đã từ chối thanh toán!");
    } catch (error) {
      alert(`Lỗi: ${error.message}`);
    }
  };

  if (loading) return <div className="p-6 text-center">Đang tải...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý thanh toán</h1>

      {pendingPayments.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-center">
            Không có thanh toán nào đang chờ xác nhận
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phương thức
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingPayments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.user?.username || "Không tìm thấy"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.user?.email || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.amount?.toLocaleString()}đ
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.method}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(payment.createdAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleApprovePayment(payment._id)}
                      className="text-green-600 hover:text-green-900 mr-4"
                    >
                      Xác nhận
                    </button>
                    <button
                      onClick={() => handleRejectPayment(payment._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Từ chối
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
