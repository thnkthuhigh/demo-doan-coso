import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import servicesData from "./data/services.json";
import { Star, Clock, Calendar, DollarSign, Users } from "lucide-react";
import ImageGallery from "./ImageGallery";
import AdvantagesList from "./AdvantagesList";
import InstructorCard from "./InstructorCard";
import FAQAccordion from "./FAQAccordion";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tìm dịch vụ theo id từ file JSON
    const foundService = servicesData.services.find((s) => s.id === id);
    if (foundService) {
      setService(foundService);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-700">
          Không tìm thấy dịch vụ
        </h2>
        <p className="mt-2 text-gray-500">
          Dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-white">
      {/* Hero Section */}
      <div className="relative h-96 rounded-xl overflow-hidden mb-8">
        <img
          src={service.mainImage}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {service.title}
          </h1>
          <p className="text-xl opacity-90">{service.shortDescription}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Giới thiệu
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {service.fullDescription}
            </p>
          </section>

          {/* Image Gallery */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hình ảnh</h2>
            <ImageGallery images={service.images} />
          </section>

          {/* Advantages */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ưu điểm nổi bật
            </h2>
            <AdvantagesList advantages={service.advantages} />
          </section>

          {/* Instructors */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Huấn luyện viên
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {service.instructors.map((instructor, idx) => (
                <InstructorCard key={idx} instructor={instructor} />
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Đánh giá từ học viên
            </h2>
            <div className="space-y-4">
              {service.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      {[...Array(5 - review.rating)].map((_, i) => (
                        <Star
                          key={i + review.rating}
                          size={18}
                          className="text-gray-300"
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{review.user}</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Câu hỏi thường gặp
            </h2>
            <FAQAccordion faqs={service.faq} />
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <DollarSign className="mr-2 text-green-600" size={20} />
              Học phí
            </h3>
            <div className="space-y-3">
              {service.priceRanges.map((price, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium">{price.name}</p>
                    <p className="text-sm text-gray-500">{price.duration}</p>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    {price.price}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => alert("Chức năng đăng ký sẽ được thêm sau!")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg mt-4 transition duration-200 font-medium"
            >
              Đăng ký ngay
            </button>
          </section>

          {/* Schedule */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="mr-2 text-blue-600" size={20} />
              Lịch học
            </h3>
            <div className="space-y-3">
              {service.schedule.map((sch, idx) => (
                <div key={idx} className="border-l-4 border-blue-600 pl-3 py-2">
                  <p className="font-medium">{sch.day}</p>
                  <p className="text-sm text-gray-600">{sch.time}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
            <h3 className="text-xl font-bold mb-2">Tư vấn miễn phí</h3>
            <p className="mb-4">
              Đăng ký nhận tư vấn từ chuyên gia về gói tập phù hợp với bạn
            </p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Họ và tên"
                className="w-full px-4 py-2 rounded bg-white bg-opacity-20 placeholder-white placeholder-opacity-70 outline-none focus:bg-opacity-30 transition"
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                className="w-full px-4 py-2 rounded bg-white bg-opacity-20 placeholder-white placeholder-opacity-70 outline-none focus:bg-opacity-30 transition"
              />
              <button
                className="w-full bg-white text-blue-600 font-medium py-2 px-4 rounded hover:bg-opacity-90 transition"
                onClick={() => alert("Chúng tôi sẽ liên hệ lại với bạn sớm!")}
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
