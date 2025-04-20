import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 mt-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Thông tin liên hệ */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Thông tin liên hệ</h2>
          <ul className="text-sm space-y-3">
            <li>
              <strong>CN1:</strong> Lầu 3, 360 Hai Bà Trưng, P. Tân Định, Q1
              <br />
              Hotline: 0988 696 360
            </li>
            <li>
              <strong>CN2:</strong> 23 Dương Quang Đông, P.5, Q8
              <br />
              Hotline: 0969 667 823
            </li>
            <li>
              <strong>CN3:</strong> 105 Lý Chiêu Hoàng, P.10, Q6
              <br />
              Hotline: 0981 200 105
            </li>
            <li>
              <strong>CN4:</strong> Block B2 Topaz City, 39 Cao Lỗ, P.04, Q8
              <br />
              Hotline: 0972 642 039
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-sm text-gray-400 mt-10">
        © 2025 FITBOX GYM. All rights reserved.
      </div>
    </footer>
  );
}
