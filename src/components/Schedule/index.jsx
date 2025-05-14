import { useState, useEffect } from "react";

export default function ViewSchedule() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [userRegistrations, setUserRegistrations] = useState([]); // Thêm state lưu đăng ký của user

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
    // Load user từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const id = parsedUser._id || parsedUser.id;
      if (id) {
        setUserId(id);
      } else {
        console.warn("Không tìm thấy user id!");
      }
    }

    const fetchClasses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/schedules");
        const data = await res.json();
        setClasses(data);
      } catch (error) {
        console.error("Lỗi load lịch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Thêm useEffect để lấy danh sách lớp học đã đăng ký của user
  useEffect(() => {
    // Chỉ fetch khi có userId
    if (!userId) return;

    const fetchUserRegistrations = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `http://localhost:5000/api/registrations/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Không thể lấy danh sách đăng ký");
        }

        const data = await res.json();

        // Lưu danh sách ID các lịch đã đăng ký
        const registeredScheduleIds = data.map(
          (reg) => reg.schedule._id || reg.schedule
        );

        setUserRegistrations(registeredScheduleIds);
      } catch (error) {
        console.error("Lỗi khi lấy đăng ký của user:", error);
      }
    };

    fetchUserRegistrations();
  }, [userId]);

  const handleRegister = async (scheduleId) => {
    if (!userId) {
      setMessage("⚠️ Bạn cần đăng nhập trước khi đăng ký!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

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
        // Thêm schedule vừa đăng ký vào danh sách đã đăng ký
        setUserRegistrations((prev) => [...prev, scheduleId]);
        setMessage("🎉 Đăng ký thành công!");
      } else {
        setMessage(`⚠️ ${result.message || "Đăng ký thất bại"}`);
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      setMessage("❌ Lỗi hệ thống!");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  // Lọc các lớp học chưa đăng ký và phù hợp với bộ lọc
  const filteredClasses = classes.filter((cls) => {
    // Kiểm tra xem người dùng đã đăng ký lớp này chưa
    const alreadyRegistered = userRegistrations.includes(cls._id);

    // Nếu đã đăng ký rồi thì không hiển thị
    if (alreadyRegistered) return false;

    // Lọc theo các tiêu chí khác
    return (
      cls.className?.toLowerCase().includes(search.toLowerCase()) &&
      (filterService === "" || cls.service === filterService)
    );
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return <p className="text-center py-10">Đang tải lịch tập...</p>;
  }

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

      {/* Thông báo cho người dùng biết đã lọc các lớp đã đăng ký */}
      {userId && (
        <div className="text-sm text-blue-600 italic">
          * Lịch tập bạn đã đăng ký sẽ không hiển thị tại đây. Xem tại "Lịch của
          tôi".
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
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
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            {userId && userRegistrations.length > 0
              ? "Bạn đã đăng ký tất cả các lớp phù hợp hoặc không tìm thấy lớp phù hợp với bộ lọc."
              : "Không tìm thấy lớp học phù hợp."}
          </p>
        )}
      </div>
    </div>
  );
}
