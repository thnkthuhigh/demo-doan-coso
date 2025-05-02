import React, { useState } from "react";
import { Link } from "react-router-dom";

// Danh sách dịch vụ (đã thêm id)
const services = [
  {
    id: "1",
    title: "FITNESS",
    image:
      "https://media.gettyimages.com/id/546825853/photo/older-hispanic-woman-lifting-weights-in-living-room.jpg?s=612x612&w=0&k=20&c=ZWrlJG-qQUNjLLYh2RrvLIMLi7E_nYf1Fx3-cea4OVM=",
  },
  {
    id: "2",
    title: "DANCE COVER",
    image:
      "https://media.gettyimages.com/id/1030366566/photo/sensual-couple-performing-an-artistic.jpg?s=612x612&w=0&k=20&c=9vhwAHZZNWP9FcC20VzhmpEcisbjurotlqjNzT-Hfbk=",
  },
  {
    id: "3",
    title: "ZUMBA",
    image:
      "https://media.gettyimages.com/id/680886440/photo/exercising-at-the-gym.jpg?s=612x612&w=0&k=20&c=qc3lPk3k-yzz_HKhbuRtN8rfQDR8d3mDD6Xyv1YFC8E=",
  },
  {
    id: "4",
    title: "PERSONAL TRAINER",
    image:
      "https://media.gettyimages.com/id/1392310150/photo/young-man-helping-his-girlfriend-during-her-sports-training-in-a-health-club.jpg?s=612x612&w=0&k=20&c=db1uW5yKg04GawBIoAcFjHyy1TRnEd1OVAFfYaN76kY=",
  },
  {
    id: "5",
    title: "YOGA",
    image:
      "https://media.gettyimages.com/id/2155324511/photo/diverse-group-of-students-doing-crescent-lunge-pose-during-yoga-class.jpg?s=612x612&w=0&k=20&c=o59qnl_-jc8qhA0Gr3FTpnF6qTjguqlTr1AaZ4VOioA=",
  },
  {
    id: "6",
    title: "MUAY THAI",
    image:
      "https://media.gettyimages.com/id/618981846/photo/boxing-her-way-to-a-ripper-body.jpg?s=612x612&w=0&k=20&c=2SnDLdpS0VUHaNWmlrFlzHZReyHtezVEZhDLxWPatQs=",
  },
  {
    id: "7",
    title: "BOXING",
    image:
      "https://media.gettyimages.com/id/481686206/photo/boxing-power.jpg?s=612x612&w=0&k=20&c=-zms0hnbqMWKd4oCRY_-99_aYNtvrEweZEMsgCgl_wE=",
  },
  {
    id: "8",
    title: "CYCLING",
    image:
      "https://media.gettyimages.com/id/909443742/photo/happy-black-athlete-practicing-on-exercise-bike-in-a-health-club.jpg?s=612x612&w=0&k=20&c=kceZHR0QxwGYan2a7HiFoM8kzxV196t_u7PZT5buYr4=",
  },
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

      {/* Giới thiệu & Tin tức */}
      <section className="py-16 px-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* Giới thiệu */}
          <div>
            <h3 className="text-2xl font-bold mb-4">GIỚI THIỆU VỀ TMN GYM</h3>
            <p className="text-justify text-gray-700 leading-relaxed">
              TMN Gym là hệ thống phòng tập hiện đại ra đời với sứ mệnh giúp
              cộng đồng nâng cao sức khỏe, cải thiện vóc dáng và rèn luyện tinh
              thần kỷ luật...
            </p>
          </div>

          {/* Tin tức */}
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
            {displayedServices.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
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

        {/* Indicator */}
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

// Card Dịch Vụ
function ServiceCard({ id, title, image }) {
  return (
    <Link
      to={`/services/${id}`}
      className="relative w-64 rounded-lg overflow-hidden shadow-lg group cursor-pointer transition-transform transform hover:scale-105"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover group-hover:scale-110 transition-transform"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <h4 className="text-white text-xl font-semibold">{title}</h4>
      </div>
    </Link>
  );
}

// Card Tin Tức
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
