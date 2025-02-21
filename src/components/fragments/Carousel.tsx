import { CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { GiHand } from "react-icons/gi";

const HeaderCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [
    "./mekanik.jpg",
    "./foto%20gerai%20pusat.jpg",
    "./banner-website-punggung.webp",
  ];

  // Auto slide setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Handle click dot
  const goToSlide = (index: any) => {
    setActiveIndex(index);
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute w-full h-full bg-black z-20 opacity-70"></div>
      {/* Images */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt={`Slide ${index + 1}`}
            className="h-full w-full object-cover"
          />
         {index==1&& <span className="absolute z-20 top-1/4 left-2 tablet:left-12 text-yellow-400 font-bold flex flex-col">
            <p className="font-extrabold tablet:text-[5em] text-[2.5em] text-white">
              TERSEDIA DI :
            </p>
            <div className="flex tablet:gap-12 gap-5 justify-between w-full">
              <span className="flex flex-col">
                <p className="tablet:text-5xl text-xl flex gap-2 items-center">
                  <CheckCircle /> BEKASI
                </p>
                <p className="tablet:text-5xl text-xl flex gap-2 items-center">
                  <CheckCircle /> TANGERANG
                </p>
                <p className="tablet:text-5xl text-xl flex gap-2 items-center ">
                  <CheckCircle /> DEPOK
                </p>
                <p className="tablet:text-5xl text-xl flex gap-2 items-center ">
                  <CheckCircle /> CIKARANG
                </p>
              </span>
              <span>
                <p className="tablet:text-5xl text-xl flex gap-2 items-center ">
                  <CheckCircle /> JAKSEL
                </p>
                <p className="tablet:text-5xl text-xl flex gap-2 items-center ">
                  <CheckCircle /> JAKTIM
                </p>
                <p className="tablet:text-5xl text-xl flex gap-2 items-center ">
                  <CheckCircle /> BOGOR
                </p>
              </span>
            </div>
          </span>}
         {index==2&& <span className="absolute z-20 top-1/4 left-2 tablet:left-12 text-yellow-400 font-bold flex flex-col">
            <p className="font-extrabold tablet:text-[5em] text-[2.5em]">
              PROMO REBOUND
            </p>
          </span>}
         {index==0&& <span className="absolute z-20 top-1/4 left-2 tablet:left-12 text-white font-bold flex flex-col tablet:top-1/4">
            <p className="font-extrabold tablet:text-[5em] text-[2.5em]">
              SELAMAT DATANG DI
            </p>
            <p className="top-1/4 font-extrabold tablet:text-[5em] text-yellow-400 text-[1.8em] flex gap-2 items-center">
              GG SUSPENSION <GiHand className="rotate-12" />
            </p>
          </span>}
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute z-20 bottom-6 left-1/2 flex -translate-x-1/2 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-colors ${
              index === activeIndex ? "bg-white" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderCarousel;
