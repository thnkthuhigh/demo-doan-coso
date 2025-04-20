import React, { useEffect, useState } from "react";

// Danh sách ảnh Gym (dùng link ảnh thật hoặc base64)
const gymImages = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUVVgCt7VC1B3VLxInsGPJ9Yg6u4v0j6YeRA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLRTX_xGhNnJIX7ZQ-Ju0s78dvlBASouHorw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8ATiUg17HuXkHqkRB436JTxNVqh55NdWSZQ&s",
  // Thêm ảnh khác nếu muốn
];

const GymImageBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Chuyển ảnh tự động sau 5 giây
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval); // clear khi unmount
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? gymImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === gymImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full max-w-full mx-auto overflow-hidden">
      {/* Tiêu đề banner */}

      {/* Banner ảnh */}
      <div className="relative w-full h-[400px]">
        <img
          src={gymImages[currentIndex]}
          alt={`Gym ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-lg shadow-lg transition-all duration-1000"
        />

        {/* Nút chuyển trái */}
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300"
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8 text-gray-800"
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
          onClick={goToNext}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300"
          aria-label="Next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8 text-gray-800"
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
    </div>
  );
};

export default GymImageBanner;
