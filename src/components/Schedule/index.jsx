import { useState } from "react";

const classes = [
  {
    name: "Fitness Buổi Sáng",
    time: "06:30 - 07:30",
    trainer: "Nguyễn Văn A",
    room: "Phòng Fitness 1",
    service: "FITNESS",
  },
  {
    name: "Dance Cover Cơ Bản",
    time: "08:00 - 09:00",
    trainer: "Trần Thị B",
    room: "Phòng Dance 1",
    service: "DANCE COVER",
  },
  {
    name: "Zumba Sôi Động",
    time: "09:30 - 10:30",
    trainer: "Lê Văn C",
    room: "Phòng Zumba 1",
    service: "ZUMBA",
  },
  {
    name: "Personal Trainer Sáng",
    time: "11:00 - 12:00",
    trainer: "Nguyễn Thị D",
    room: "Phòng PT 1",
    service: "PERSONAL TRAINER",
  },
  {
    name: "Yoga Thư Giãn",
    time: "15:00 - 16:00",
    trainer: "Phạm Văn E",
    room: "Phòng Yoga 1",
    service: "YOGA",
  },
  {
    name: "Muay Thai Cơ Bản",
    time: "06:30 - 07:30",
    trainer: "Nguyễn Thị F",
    room: "Phòng Muay Thai 1",
    service: "MUAY THAI",
  },
  {
    name: "Boxing Cường Độ Cao",
    time: "17:00 - 18:00",
    trainer: "Lê Minh G",
    room: "Phòng Boxing 1",
    service: "BOXING",
  },
  {
    name: "Cycling Thể Dục",
    time: "06:00 - 07:00",
    trainer: "Trần Anh H",
    room: "Phòng Cycling 1",
    service: "CYCLING",
  },
];

export default function ViewSchedule() {
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("");

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterService === "" || cls.service === filterService)
  );

  const services = [
    { title: "FITNESS", image: "/fitness.jpg" },
    { title: "DANCE COVER", image: "/dancecover.jpg" },
    { title: "ZUMBA", image: "/zumba.jpg" },
    { title: "PERSONAL TRAINER", image: "/trainer.jpg" },
    { title: "YOGA", image: "/yoga.jpg" },
    { title: "MUAY THAI", image: "/muaythai.jpg" },
    { title: "BOXING", image: "/boxing.jpg" },
    { title: "CYCLING", image: "/cyclling.jpg" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Lịch Tập</h1>

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
          {services.map((s, index) => (
            <option key={index} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition duration-300"
          >
            <h2 className="text-xl font-semibold">{cls.name}</h2>
            <p>⏰ {cls.time}</p>
            <p>🏋️‍♂️ Huấn luyện viên: {cls.trainer}</p>
            <p>🏠 Phòng tập: {cls.room}</p>
            <p>
              📌 Dịch vụ: <span className="font-medium">{cls.service}</span>
            </p>
          </div>
        ))}
        {filteredClasses.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            Không tìm thấy lớp học phù hợp.
          </p>
        )}
      </div>
    </div>
  );
}
