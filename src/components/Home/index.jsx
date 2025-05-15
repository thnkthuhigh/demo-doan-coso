import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import servicesData from "../Services/data/services.json";

// Import background pattern - Thêm vào public hoặc assets folder
// const backgroundPattern = "/assets/gym-pattern.png";

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ file JSON và format lại để hiển thị
    const formattedServices = servicesData.services.map((service) => ({
      id: service.id,
      title: service.title,
      image: service.mainImage || service.image,
    }));
    setServices(formattedServices);
  }, []);

  const servicesPerPage = 4;

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
    <div className="bg-white text-gray-800 font-sans relative">
      {/* Background chìm cho toàn trang */}
      <div
        className="fixed inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("https://img.freepik.com/premium-vector/fitness-gym-seamless-pattern-sport-accessories-dumbbells-sneakers-fitness-tracker-bottle-sportswear_115739-686.jpg")`,
          backgroundSize: "400px",
          backgroundRepeat: "repeat",
          filter: "grayscale(40%)",
        }}
      ></div>

      {/* Hero Section nâng cấp */}
      <section className="relative h-[90vh] bg-gradient-to-r from-blue-900 to-purple-900 text-white overflow-hidden">
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/carbon-fibre.png")`,
            backgroundRepeat: "repeat",
          }}
        ></div>

        {/* Hero content with animated shapes */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -right-20 w-96 h-96 bg-purple-600 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>

        <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-center leading-tight tracking-tight">
            <span className="block">KHÁM PHÁ</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              SỨC MẠNH TIỀM ẨN
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-lg text-center mb-10 text-gray-200">
            Trở thành phiên bản tốt nhất của chính mình với các dịch vụ đẳng cấp
            từ TMN Gym
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/schedule"
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              BẮT ĐẦU NGAY
            </Link>
            <Link
              to="/services"
              className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-blue-900 transition-all duration-300"
            >
              KHÁM PHÁ DỊCH VỤ
            </Link>
          </div>

          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <div className="animate-bounce">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 13L12 18L17 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 7L12 12L17 7"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Promotion Banner - Siêu Sale */}
      <section className="relative py-16 bg-gradient-to-r from-blue-800 to-purple-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/diamond-upholstery.png")`,
          }}
        ></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900/70 to-gray-800/70 p-8 rounded-3xl backdrop-blur-sm border border-gray-700/50 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <span className="inline-block px-4 py-1 bg-red-500 text-white text-xs uppercase tracking-wider rounded-full mb-4 font-bold">
                  Khuyến mãi đặc biệt
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  SIÊU SALE THÁNG 5
                </h2>
                <p className="text-gray-300 mb-6">
                  Cơ hội cuối cùng để sở hữu thẻ tập với ưu đãi lên đến 50% và
                  nhiều quà tặng hấp dẫn
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-1 rounded-2xl shadow-lg">
                <div className="bg-gray-900 rounded-xl p-6 text-center space-y-4">
                  <div className="font-mono font-bold">
                    <div className="text-sm text-gray-400">GIẢM TỚI</div>
                    <div className="text-5xl text-yellow-400">50%</div>
                    <div className="text-sm text-gray-400">CHỈ CÒN</div>
                    <div className="countdown-timer flex justify-center space-x-2 text-2xl">
                      <span className="bg-gray-800 px-2 py-1 rounded">05</span>
                      <span>:</span>
                      <span className="bg-gray-800 px-2 py-1 rounded">23</span>
                      <span>:</span>
                      <span className="bg-gray-800 px-2 py-1 rounded">59</span>
                    </div>
                  </div>
                  <Link
                    to="/services"
                    className="block w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300"
                  >
                    ĐĂNG KÝ NGAY
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Giới thiệu & Tin tức - Thiết kế nâng cấp */}
      <section className="relative py-20 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Giới thiệu */}
            <div className="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-3xl font-bold mb-8 text-gray-800 relative inline-block">
                GIỚI THIỆU VỀ TMN GYM
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"></span>
              </h3>

              <div className="relative mb-8 aspect-video rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3ltfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60"
                  alt="TMN Gym"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h4 className="text-xl font-bold">Không gian hiện đại</h4>
                    <p>Thiết bị đạt chuẩn quốc tế</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-8">
                TMN Gym là hệ thống phòng tập hiện đại ra đời với sứ mệnh giúp
                cộng đồng nâng cao sức khỏe, cải thiện vóc dáng và rèn luyện
                tinh thần kỷ luật. Với đội ngũ huấn luyện viên chuyên nghiệp
                cùng hệ thống trang thiết bị đạt chuẩn quốc tế, chúng tôi cam
                kết mang đến trải nghiệm tập luyện tuyệt vời nhất cho khách
                hàng.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center bg-gray-50 p-4 rounded-xl">
                  <div className="p-3 bg-blue-100 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold">Thiết bị hiện đại</h5>
                    <p className="text-sm text-gray-600">Tiêu chuẩn quốc tế</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 p-4 rounded-xl">
                  <div className="p-3 bg-green-100 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-green-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold">HLV chuyên nghiệp</h5>
                    <p className="text-sm text-gray-600">Đầy kinh nghiệm</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 p-4 rounded-xl">
                  <div className="p-3 bg-yellow-100 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-yellow-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold">Giờ mở cửa</h5>
                    <p className="text-sm text-gray-600">5:00 - 22:00</p>
                  </div>
                </div>
                <div className="flex items-center bg-gray-50 p-4 rounded-xl">
                  <div className="p-3 bg-purple-100 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-700"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold">Lớp học nhóm</h5>
                    <p className="text-sm text-gray-600">Đa dạng loại hình</p>
                  </div>
                </div>
              </div>

              <Link
                to="/club"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/30"
              >
                <span>Tìm hiểu thêm</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>

            {/* Tin tức */}
            <div className="bg-white bg-opacity-90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-3xl font-bold mb-8 text-gray-800 relative inline-block">
                TIN TỨC & KIẾN THỨC
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></span>
              </h3>

              <div className="space-y-6">
                <NewsCardEnhanced
                  title="Tập Gym Buổi Sáng: Lợi Ích Đáng Kể Cho Sức Khỏe"
                  image="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=300&fit=crop"
                  description="Tập gym vào buổi sáng giúp cải thiện năng lượng và tinh thần suốt cả ngày, tăng tỉ lệ đốt cháy calo, và cải thiện giấc ngủ."
                  link="https://center.gymaster.vn/5-loi-ich-bat-ngo-khi-ban-tap-gym-buoi-sang/"
                  date="15 Th5, 2023"
                  category="Sức khỏe"
                />

                <NewsCardEnhanced
                  title="Dinh Dưỡng Sau Khi Tập: Tối Ưu Hóa Quá Trình Hồi Phục"
                  image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop"
                  description="Sau khi tập luyện, cơ thể cần protein và carb để phục hồi và tái tạo năng lượng. Bổ sung đúng thời điểm sẽ tăng hiệu quả."
                  link="https://www.vinmec.com/vie/bai-viet/nen-gi-sau-khi-tap-luyen-de-dat-ket-qua-toi-uu-vi"
                  date="10 Th5, 2023"
                  category="Dinh dưỡng"
                />

                <NewsCardEnhanced
                  title="Yoga Buổi Sáng: Khởi Đầu Ngày Mới Tràn Đầy Năng Lượng"
                  image="https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=400&h=300&fit=crop"
                  description="Tập yoga vào buổi sáng giúp giảm căng thẳng, tăng trí nhớ và sự tập trung, đồng thời cải thiện sự linh hoạt của cơ thể."
                  link="https://laodong.vn/suc-khoe/5-loi-ich-tuyet-voi-cua-viec-tap-yoga-vao-buoi-sang-1484108.ldo"
                  date="5 Th5, 2023"
                  category="Yoga"
                />
              </div>

              <div className="mt-8 text-center">
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                >
                  <span>Xem tất cả bài viết</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dịch vụ - Thiết kế nâng cấp */}
      <section className="relative py-20 bg-gray-900 text-white z-10">
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/escheresque-dark.png")`,
          }}
        ></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              DỊCH VỤ ĐẲNG CẤP
            </h2>
            <p className="text-lg text-gray-300">
              Chúng tôi cung cấp đa dạng các dịch vụ tập luyện để đáp ứng mọi
              nhu cầu của bạn, từ người mới bắt đầu đến vận động viên chuyên
              nghiệp
            </p>
          </div>

          <div className="relative">
            <button
              className="absolute left-0 md:-left-10 top-1/2 transform -translate-y-1/2 bg-white/10 text-white w-12 h-12 rounded-full shadow-lg hover:bg-white/20 transition duration-300 ease-in-out z-10 flex items-center justify-center backdrop-blur-sm"
              onClick={() => handleScroll("left")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex space-x-8 overflow-hidden py-8 px-2">
              {displayedServices.map((service) => (
                <ServiceCardEnhanced
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  image={service.image}
                />
              ))}
            </div>

            <button
              className="absolute right-0 md:-right-10 top-1/2 transform -translate-y-1/2 bg-white/10 text-white w-12 h-12 rounded-full shadow-lg hover:bg-white/20 transition duration-300 ease-in-out z-10 flex items-center justify-center backdrop-blur-sm"
              onClick={() => handleScroll("right")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Indicator */}
          <div className="mt-12 flex justify-center space-x-3">
            {Array.from({
              length: Math.ceil(services.length / servicesPerPage),
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * servicesPerPage)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  i === Math.floor(currentIndex / servicesPerPage)
                    ? "bg-white"
                    : "bg-gray-600 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-blue-500/30 transition duration-300 transform hover:-translate-y-1"
            >
              XEM TẤT CẢ DỊCH VỤ
            </Link>
          </div>
        </div>
      </section>

      {/* Section thêm - Huấn luyện viên nổi bật - Nâng cấp */}
      <section className="relative py-20 px-6 bg-white z-10">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-4xl font-bold mb-6 text-gray-800">
              HUẤN LUYỆN VIÊN NỔI BẬT
            </h3>
            <p className="text-gray-600">
              Đội ngũ huấn luyện viên chuyên nghiệp, giàu kinh nghiệm và đam mê
              sẽ đồng hành cùng bạn trên hành trình chinh phục mục tiêu sức khỏe
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <TrainerCardEnhanced
              name="Nguyễn Văn A"
              specialty="Strength & Conditioning"
              image="https://images.unsplash.com/photo-1567013127542-490d757e6349?q=80&w=250&auto=format&fit=crop"
              experience="8 năm kinh nghiệm"
              socialLinks={{
                facebook: "https://facebook.com",
                instagram: "https://instagram.com",
                youtube: "https://youtube.com",
              }}
            />
            <TrainerCardEnhanced
              name="Trần Thị B"
              specialty="Yoga & Pilates"
              image="https://images.unsplash.com/photo-1642914459698-593897ca5118?q=80&w=250&auto=format&fit=crop"
              experience="10 năm kinh nghiệm"
              socialLinks={{
                facebook: "https://facebook.com",
                instagram: "https://instagram.com",
              }}
            />
            <TrainerCardEnhanced
              name="Lê Minh C"
              specialty="Boxing & MMA"
              image="https://images.unsplash.com/photo-1522075782449-e45a34f1ddfb?q=80&w=250&auto=format&fit=crop"
              experience="7 năm kinh nghiệm"
              socialLinks={{
                facebook: "https://facebook.com",
                youtube: "https://youtube.com",
              }}
            />
            <TrainerCardEnhanced
              name="Phạm Thị D"
              specialty="Dance & Zumba"
              image="https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?q=80&w=250&auto=format&fit=crop"
              experience="6 năm kinh nghiệm"
              socialLinks={{
                instagram: "https://instagram.com",
                youtube: "https://youtube.com",
              }}
            />
          </div>

          <div className="text-center mt-12">
            <Link
              to="/trainers"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              <span>Xem tất cả huấn luyện viên</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Thống kê - Section mới */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white z-10">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/use-your-illusion.png")`,
          }}
        ></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-8 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:transform hover:scale-105">
              <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-blue-100">
                1,500+
              </div>
              <div className="text-gray-300">Thành viên</div>
            </div>
            <div className="p-8 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:transform hover:scale-105">
              <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-purple-100">
                25+
              </div>
              <div className="text-gray-300">Huấn luyện viên</div>
            </div>
            <div className="p-8 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:transform hover:scale-105">
              <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-pink-100">
                150+
              </div>
              <div className="text-gray-300">Lớp học hàng tuần</div>
            </div>
            <div className="p-8 backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all hover:transform hover:scale-105">
              <div className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">
                10+
              </div>
              <div className="text-gray-300">Năm kinh nghiệm</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial - Section mới */}
      <section className="relative py-20 px-6 bg-gray-50 z-10">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-4xl font-bold mb-6 text-gray-800">
              PHẢN HỒI CỦA HỌC VIÊN
            </h3>
            <p className="text-gray-600">
              Hãy lắng nghe những chia sẻ từ các học viên về hành trình thay đổi
              bản thân cùng TMN Gym
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Nguyễn Thị A"
              avatar="https://randomuser.me/api/portraits/women/44.jpg"
              occupation="Nhân viên văn phòng"
              testimonial="Tôi đã giảm 12kg sau 4 tháng tập luyện tại TMN Gym với sự hướng dẫn nhiệt tình từ HLV. Không chỉ thay đổi về ngoại hình, sức khỏe của tôi cũng được cải thiện rõ rệt."
              rating={5}
            />
            <TestimonialCard
              name="Trần Văn B"
              avatar="https://randomuser.me/api/portraits/men/32.jpg"
              occupation="Kỹ sư phần mềm"
              testimonial="Lịch tập được điều chỉnh phù hợp với thời gian bận rộn của tôi. HLV rất nhiệt tình và chuyên nghiệp. Sau 3 tháng, tôi đã tăng được 5kg cơ và giảm 6% mỡ."
              rating={5}
            />
            <TestimonialCard
              name="Phạm Hồng C"
              avatar="https://randomuser.me/api/portraits/women/68.jpg"
              occupation="Giáo viên"
              testimonial="Tôi tham gia lớp Yoga đã được 1 năm. Không gian tập luyện thoáng mát, sạch sẽ. Giáo viên hướng dẫn tận tâm. Stress giảm hẳn và tôi luôn cảm thấy tràn đầy năng lượng."
              rating={4}
            />
          </div>

          <div className="text-center mt-12">
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              <span>Xem thêm đánh giá</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section - Nâng cấp */}
      <section className="relative py-20 bg-gradient-to-r from-blue-800 to-purple-900 text-white overflow-hidden z-10">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("https://www.transparenttextures.com/patterns/brushed-alum-dark.png")`,
          }}
        ></div>

        {/* Animated elements */}
        <div className="absolute top-0 left-10 w-64 h-64 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

        <style jsx>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-4xl md:text-5xl font-bold mb-6">
              BẮT ĐẦU HÀNH TRÌNH CHINH PHỤC BẢN THÂN NGAY HÔM NAY
            </h3>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Đăng ký tham quan cơ sở và nhận tư vấn miễn phí từ chuyên gia.
              Chúng tôi cam kết đồng hành cùng bạn trên con đường chinh phục mục
              tiêu.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/schedule"
                className="bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 transition duration-300 transform hover:scale-105"
              >
                ĐĂNG KÝ NGAY
              </Link>
              <Link
                to="/contact"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition duration-300"
              >
                LIÊN HỆ TƯ VẤN
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Card Dịch Vụ - Thiết kế mới đẹp hơn
function ServiceCardEnhanced({ id, title, image }) {
  return (
    <Link
      to={`/services/${id}`}
      className="block w-80 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-all duration-500 transform hover:scale-105"
    >
      <div className="relative h-96 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:opacity-90 transition-opacity duration-300"></div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white transition-all duration-500">
          <div className="transform transition-all duration-500 group-hover:translate-y-0">
            <div className="flex items-center mb-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <span className="px-3 py-1 bg-blue-600 text-xs uppercase tracking-wider rounded-full">
                Dịch vụ
              </span>
            </div>

            <h4 className="text-2xl font-bold mb-2 transform group-hover:translate-y-0 transition-transform duration-500">
              {title}
            </h4>

            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mb-4 transform scale-0 group-hover:scale-100 transition-transform duration-500 origin-left"></div>

            <p className="text-white/80 mb-6 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
              Khám phá dịch vụ {title} tại TMN Gym với các chương trình tập
              luyện chuyên biệt
            </p>

            <div className="transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-200">
              <span className="inline-flex items-center text-white font-medium">
                <span>Xem chi tiết</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Card Tin Tức - Thiết kế mới
function NewsCardEnhanced({ title, image, description, link, date, category }) {
  return (
    <div className="group hover:bg-gray-50 rounded-xl transition duration-300 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </div>
        <div className="col-span-2 p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                {category}
              </span>
              <span className="text-xs text-gray-500">{date}</span>
            </div>

            <a
              href={link}
              className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition duration-300 line-clamp-2 mb-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {title}
            </a>

            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {description}
            </p>
          </div>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition duration-300 mt-auto group"
          >
            <span>Đọc thêm</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

// Card Huấn Luyện Viên - Thiết kế mới
function TrainerCardEnhanced({
  name,
  specialty,
  image,
  experience,
  socialLinks,
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group border border-gray-100">
      <div className="relative overflow-hidden">
        <div className="h-80 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

        <div className="absolute bottom-0 left-0 w-full p-6 text-white transform translate-y-1/4 group-hover:translate-y-0 transition-transform duration-500">
          <h4 className="font-bold text-xl mb-1">{name}</h4>
          <p className="text-yellow-400 font-medium mb-4">{specialty}</p>

          <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {socialLinks?.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            )}
            {socialLinks?.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-400 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            )}
            {socialLinks?.youtube && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-700 text-sm">{experience}</p>
        <div className="mt-4 flex justify-between items-center">
          <button className="text-blue-600 text-sm hover:text-blue-800 transition duration-300 font-medium">
            Xem hồ sơ
          </button>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            Chứng nhận ISO
          </span>
        </div>
      </div>
    </div>
  );
}

// TestimonialCard - New Component
function TestimonialCard({ name, avatar, occupation, testimonial, rating }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="flex items-center mb-4">
        <img
          src={avatar}
          alt={name}
          className="h-14 w-14 rounded-full object-cover border-2 border-blue-500"
        />
        <div className="ml-4">
          <h4 className="font-bold text-gray-800">{name}</h4>
          <p className="text-sm text-gray-500">{occupation}</p>
        </div>
      </div>

      <div className="mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-yellow-400">
            {i < rating ? "★" : "☆"}
          </span>
        ))}
      </div>

      <p className="text-gray-700 italic mb-4">"{testimonial}"</p>

      <div className="flex justify-end">
        <svg
          className="h-6 w-6 text-blue-400 opacity-50"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
    </div>
  );
}
