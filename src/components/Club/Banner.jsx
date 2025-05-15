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

    return () => clearInterval(interval); // clear khi unmount
  }, []); // Xóa currentIndex từ dependency để tránh re-render liên tục

  const goToPrevious = () => {
    console.log("Previous button clicked"); // Debugging
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? gymImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    console.log("Next button clicked"); // Debugging
    setCurrentIndex((prevIndex) =>
      prevIndex === gymImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-full">
      {/* Lớp ảnh */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={gymImages[currentIndex]}
          alt={`Gym ${currentIndex + 1}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      {/* Overlay để đảm bảo nút có thể click được */}
      <div className="absolute inset-0 z-10 pointer-events-none"></div>

      {/* Nút điều hướng */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 flex space-x-4">
        {gymImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              console.log(`Changing to slide ${index + 1}`); // Debugging
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 pointer-events-auto ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Nút chuyển trái - Điều chỉnh z-index và thêm pointer-events-auto */}
      <button
        type="button"
        onClick={goToPrevious}
        className="absolute top-1/2 left-6 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-sm transition-all duration-300 z-30 pointer-events-auto"
        aria-label="Previous"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Nút chuyển phải - Điều chỉnh z-index và thêm pointer-events-auto */}
      <button
        type="button"
        onClick={goToNext}
        className="absolute top-1/2 right-6 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-sm transition-all duration-300 z-30 pointer-events-auto"
        aria-label="Next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 text-white"
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
      <div className="absolute bottom-2 right-4 z-30 bg-black/30 px-3 py-1 rounded-full text-white text-xs backdrop-blur-sm">
        {currentIndex + 1} / {gymImages.length}
      </div>
    </div>
  );
};

export default GymImageGallery;
