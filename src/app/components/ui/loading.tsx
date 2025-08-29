import React from 'react';
import Image from 'next/image';

const LoadingComponent: React.FC = () => {
  return (
    <div className="relative z-[999999] flex items-center justify-center h-screen bg-[#191a24] font-sans">
      <div className="flex flex-col items-center text-white container-animation">
        <div>
          <Image
            src="/images/logo.svg"
            alt="RoPhim Logo"
            width={300}
            height={50}
          />
        </div>
        <div className="text-center text-3xl text-gray-500 mt-6 font-bold">
          <span>Xem Phim Miễn Phí Cực Nhanh, Chất</span>
          <br />
          <span>Lượng Cao Và Cập Nhật Liên Tục</span>
        </div>
      </div>
      <style>
        {`
          @keyframes containerZoom {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
            75% {
              transform: scale(1.2);
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }

          .container-animation {
            animation: containerZoom 3s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default LoadingComponent;