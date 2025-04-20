import React, { useRef, useState } from "react";

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

const servicesPerPage = 4;

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (direction) => {
    if (direction === "left") {
      setCurrentIndex((prev) =>
        prev === 0 ? services.length - servicesPerPage : prev - servicesPerPage
      );
    } else {
      setCurrentIndex((prev) =>
        prev + servicesPerPage >= services.length ? 0 : prev + servicesPerPage
      );
    }
  };

  const displayedServices = services.slice(
    currentIndex,
    currentIndex + servicesPerPage
  );

  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Banner */}
      <section className="relative bg-black text-white py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Siêu Sale Chớp Nhoáng</h2>
        <p className="text-lg">GYM - YOGA - ZUMBA - DANCE</p>
        <div className="mt-6">
          <span className="bg-white text-black px-4 py-2 rounded font-semibold mr-2">
            Thẻ GYM 0₫
          </span>
          <span className="bg-white text-black px-4 py-2 rounded font-semibold">
            Tặng thêm 1 thẻ cho bạn đồng hành
          </span>
        </div>
      </section>

      {/* Giới thiệu và tin tức */}
      <section className="py-16 px-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div>
            <h3 className="text-2xl font-bold mb-4">GIỚI THIỆU VỀ TMN GYM</h3>
            <p className="text-justify text-gray-700 leading-relaxed">
              TMN Gym là hệ thống phòng tập hiện đại ra đời với sứ mệnh giúp
              cộng đồng nâng cao sức khỏe, cải thiện vóc dáng và rèn luyện tinh
              thần kỷ luật. Với niềm tin rằng mỗi người đều có thể trở thành
              phiên bản tốt hơn của chính mình, TMN không chỉ mang đến những
              thiết bị tập luyện chất lượng cao mà còn xây dựng một môi trường
              năng động, chuyên nghiệp và đầy cảm hứng.
              <br />
              <br />
              Tại TMN, chúng tôi tập trung vào việc hỗ trợ học viên đạt được mục
              tiêu cá nhân thông qua các lớp tập chuyên sâu như Gym cá nhân,
              Yoga, GroupX, Cardio... với đội ngũ huấn luyện viên giàu kinh
              nghiệm và tận tâm. Không chỉ là nơi để rèn luyện thể chất, TMN còn
              là nơi kết nối cộng đồng yêu thích thể thao, cùng nhau chinh phục
              những giới hạn mới.
              <br />
              <br />
              Chúng tôi tin rằng, sự kiên trì và nỗ lực mỗi ngày sẽ tạo nên sự
              thay đổi tích cực lâu dài cho cơ thể và tinh thần.
            </p>
          </div>

          <div className="bg-gray-100 py-10 px-4 rounded-xl">
            <h3 className="text-2xl font-bold mb-6">
              TIN TỨC & KIẾN THỨC SỨC KHỎE
            </h3>
            <div className="space-y-6">
              <NewsCard
                title="Tập Gym Buổi Sáng: Lợi Ích Đáng Kể Cho Sức Khỏe"
                image="/news1.jpg"
                description="Tập gym vào buổi sáng giúp cải thiện năng lượng và tinh thần suốt cả ngày."
                link="https://center.gymaster.vn/5-loi-ich-bat-ngo-khi-ban-tap-gym-buoi-sang/?utm_source=chatgpt.com"
              />
              <NewsCard
                title="Dinh Dưỡng Sau Khi Tập: Tối Ưu Hóa Quá Trình Hồi Phục"
                image="/news2.jpg"
                description="Sau khi tập luyện, cơ thể cần protein và carb để phục hồi và tái tạo năng lượng."
                link="https://www.vinmec.com/vie/bai-viet/nen-gi-sau-khi-tap-luyen-de-dat-ket-qua-toi-uu-vi?utm_source=chatgpt.com"
              />
              <NewsCard
                title="Yoga Buổi Sáng: Khởi Đầu Ngày Mới Tràn Đầy Năng Lượng"
                image="/news4.jpg"
                description="Tập yoga vào buổi sáng giúp giảm căng thẳng, tăng trí nhớ và sự tập trung."
                link="https://laodong.vn/suc-khoe/5-loi-ich-tuyet-voi-cua-viec-tap-yoga-vao-buoi-sang-1484108.ldo?utm_source=chatgpt.com"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Dịch vụ */}
      <section className="py-16 px-6 bg-gray-100">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          CÁC DỊCH VỤ CỦA CHÚNG TÔI
        </h3>
        <div className="relative">
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out z-10"
            onClick={() => handleScroll("left")}
          >
            &#8592;
          </button>

          <div className="flex space-x-4 overflow-hidden py-4 justify-center">
            {displayedServices.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                image={service.image}
              />
            ))}
          </div>

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out z-10"
            onClick={() => handleScroll("right")}
          >
            &#8594;
          </button>
        </div>

        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({
            length: Math.ceil(services.length / servicesPerPage),
          }).map((_, i) => (
            <span
              key={i}
              className={`block w-3 h-3 rounded-full ${
                i === Math.floor(currentIndex / servicesPerPage)
                  ? "bg-gray-800"
                  : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ title, image }) {
  return (
    <div className="relative w-64 rounded-lg overflow-hidden shadow-lg group cursor-pointer transition-transform transform hover:scale-105">
      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover group-hover:scale-110 transition-transform"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h4 className="text-white text-xl font-semibold">{title}</h4>
      </div>
    </div>
  );
}

function NewsCard({ title, image, description, link }) {
  return (
    <div className="flex items-start space-x-4">
      <img src={image} alt={title} className="w-24 h-24 object-cover rounded" />
      <div>
        <a
          href={link}
          className="text-lg font-semibold text-gray-800 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {title}
        </a>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
