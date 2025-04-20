import { useState } from "react";

function BillPage({ userData, order, selectedMethod }) {
  const [isPaid] = useState(true);

  // Tính tổng tiền
  const totalAmount = order.classes.reduce((sum, cls) => sum + cls.price, 0);

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      {isPaid && (
        <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Hóa đơn thanh toán</h2>

          {/* Thông tin đơn hàng */}
          <div className="mb-4">
            <h3 className="font-semibold">Thông tin đơn hàng:</h3>
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

          {/* Thông tin người dùng */}
          <div className="mb-4">
            <h3 className="font-semibold">Thông tin người dùng:</h3>
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

          {/* Phương thức thanh toán */}
          <div className="mb-4">
            <h3 className="font-semibold">Phương thức thanh toán:</h3>
            <p>{selectedMethod}</p>
          </div>

          {/* Mã QR */}
          <QRCode
            value="https://example.com/payment-confirmation"
            size={128}
            className="mb-4"
          />
          <p className="mb-4">Mã QR để xác minh hóa đơn tại phòng gym.</p>

          {/* Các nút hành động */}
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              In hóa đơn
            </button>
            <button className="bg-gray-600 text-white px-6 py-2 rounded-lg">
              Quay về trang chủ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Dữ liệu mẫu
const userData = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0123456789",
};

const order = {
  classes: [
    { name: "Yoga Buổi Sáng", price: 150000 },
    { name: "Tập Lực Cường Độ Cao", price: 200000 },
    { name: "Cardio Buổi Tối", price: 180000 },
  ],
};

const selectedMethod = "Thẻ ngân hàng";

// Gọi trang BillPage và truyền dữ liệu mẫu
function App() {
  return (
    <BillPage
      userData={userData}
      order={order}
      selectedMethod={selectedMethod}
    />
  );
}

export default App;
