import { useState, useEffect } from "react";

export default function ViewSchedule() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId] = useState("6616e899125c8e4c6b4b5a1e"); // Giả sử ID user cố định
  const [message, setMessage] = useState("");

  const services = [
    "FITNESS",
    "DANCE COVER",
    "ZUMBA",
    "PERSONAL TRAINER",
    "YOGA",
    "MUAY THAI",
    "BOXING",
    "CYCLING",
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/schedules");
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Lỗi load lịch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleRegister = async (scheduleId) => {
    try {
      const res = await fetch("http://localhost:5000/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, scheduleId }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("🎉 Đăng ký thành công!");
      } else {
        setMessage(`⚠️ ${result.message}`);
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setMessage("❌ Lỗi hệ thống!");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.className?.toLowerCase().includes(search.toLowerCase()) &&
      (filterService === "" || cls.service === filterService)
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) return <p className="text-center py-10">Đang tải lịch tập...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Lịch Tập</h1>

      {message && (
        <div className="bg-green-100 text-green-700 text-center p-2 rounded">
          {message}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Tìm theo tên lớp..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
        />

        <select
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/3"
        >
          <option value="">Tất cả dịch vụ</option>
          {services.map((service, index) => (
            <option key={index} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => (
          <div
            key={cls._id}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition duration-300 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{cls.className}</h2>
              <p>🗓 Ngày: {formatDate(cls.date)}</p>
              <p>
                ⏰ Thời gian: {cls.startTime} - {cls.endTime}
              </p>
              <p>🏋️‍♂️ Huấn luyện viên: {cls.instructor || "Đang cập nhật"}</p>
              <p>
                📌 Dịch vụ: <span className="font-medium">{cls.service}</span>
              </p>
              <p>
                💵 Giá:{" "}
                <span className="font-semibold">
                  {cls.price?.toLocaleString()} VND
                </span>
              </p>
            </div>

            <button
              onClick={() => handleRegister(cls._id)}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Đăng ký
            </button>
          </div>
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <p className="text-center col-span-full text-gray-500">
          Không tìm thấy lớp học phù hợp.
        </p>
      )}
    </div>
  );
}
