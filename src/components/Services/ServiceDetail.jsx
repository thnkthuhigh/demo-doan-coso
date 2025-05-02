import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ServiceDetail() {
  const { id } = useParams(); // lấy id từ URL
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/services/${id}`);
        setService(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết dịch vụ:", error);
      }
    };
    fetchService();
  }, [id]);

  if (!service) {
    return <p className="text-center text-gray-600 p-6">Đang tải dữ liệu...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-4xl font-bold text-center text-gray-800">
        {service.name}
      </h1>

      {/* Hình ảnh dịch vụ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {service.images?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Service ${index}`}
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
        ))}
      </div>

      {/* Mô tả & ưu điểm */}
      <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-blue-700">
          Giới thiệu dịch vụ
        </h2>
        <p className="text-gray-700">{service.description}</p>

        <h2 className="text-2xl font-semibold text-blue-700">
          Ưu điểm nổi bật
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {service.advantages?.map((advantage, idx) => (
            <li key={idx}>{advantage}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
