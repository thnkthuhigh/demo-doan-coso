import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Danh sách ảnh Gym chất lượng cao hơn
const gymImages = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
];

const GymImageGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Chuyển ảnh tự động sau 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    console.log("Previous button clicked");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? gymImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    console.log("Next button clicked");
    setCurrentIndex((prevIndex) =>
      prevIndex === gymImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Lớp ảnh */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={gymImages[currentIndex]}
          alt={`Gym ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Vintage Overlay cho text nổi bật */}
      <div className="absolute inset-0 banner-overlay-vintage z-20"></div>

      {/* Alternative overlay cho contrast tốt hơn */}
      <div className="absolute inset-0 bg-gradient-to-b from-vintage-dark/40 via-transparent to-vintage-dark/60 z-20"></div>

      {/* Content overlay để text nổi bật */}
      <div className="absolute inset-0 z-25">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white px-8 max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold vintage-heading text-shadow-strong mb-6"
            >
              Royal Fitness Club
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl text-vintage-cream vintage-sans text-shadow-soft mb-8 leading-relaxed"
            >
              Nơi khởi nguồn cho hành trình hoàn thiện bản thân
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <button className="btn-vintage-gold btn-lg px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all duration-300">
                <span>Khám phá ngay</span>
                <svg
                  className="w-6 h-6 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
              <button className="btn-vintage-secondary btn-lg px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-vintage-dark transform hover:scale-105 transition-all duration-300">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3l14 9-14 9V3z"
                  />
                </svg>
                <span>Xem video</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Controls với z-index cao hơn */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-40 flex space-x-4">
        {gymImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              console.log(`Changing to slide ${index + 1}`);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 pointer-events-auto border border-white/30 ${
              index === currentIndex
                ? "bg-vintage-gold scale-125 shadow-golden"
                : "bg-white/40 hover:bg-white/70 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Nút chuyển trái */}
      <button
        type="button"
        onClick={goToPrevious}
        className="absolute top-1/2 left-6 -translate-y-1/2 bg-vintage-dark/30 hover:bg-vintage-dark/50 p-4 rounded-full backdrop-blur-sm transition-all duration-300 z-40 pointer-events-auto border border-white/20 hover:border-white/40 group"
        aria-label="Previous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 text-white group-hover:text-vintage-gold transition-colors"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Nút chuyển phải */}
      <button
        type="button"
        onClick={goToNext}
        className="absolute top-1/2 right-6 -translate-y-1/2 bg-vintage-dark/30 hover:bg-vintage-dark/50 p-4 rounded-full backdrop-blur-sm transition-all duration-300 z-40 pointer-events-auto border border-white/20 hover:border-white/40 group"
        aria-label="Next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 text-white group-hover:text-vintage-gold transition-colors"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Hiển thị vị trí hiện tại */}
      <div className="absolute bottom-4 right-6 z-40 bg-vintage-dark/40 px-4 py-2 rounded-full text-white text-sm backdrop-blur-sm border border-white/20 vintage-sans">
        <span className="text-vintage-gold font-semibold">
          {currentIndex + 1}
        </span>
        <span className="mx-1">/</span>
        <span>{gymImages.length}</span>
      </div>

      {/* Gradient borders cho style vintage */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-vintage-gold to-transparent z-30"></div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-vintage-gold to-transparent z-30"></div>
    </div>
  );
};

export default GymImageGallery;
