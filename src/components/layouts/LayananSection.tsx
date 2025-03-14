import { useState } from "react";

export default function LayananSection() {
  const [index, setIndex] = useState(0);
  const SEMUA_LAYANAN = [
    {
      nama: "REBOUND",
      image:"./layanan/rebound.png",
      desc: "Mengoptimalkan kemampuan shock absorber untuk kembali ke posisi semula setelah mengalami penekanan atau benturan",
    },
    {
      nama: "DOWNSIZE",
      image:"./layanan/downsize.png",
      desc: "Mengoptimalkan suspensi dengan mengganti shock absorber berat dengan model yang lebih ringan dan kompak, sehingga mengurangi total beban kendaraan",
    },
    {
      nama: "MAINTENANCE",
      image:"./layanan/maintenance.png",
      desc: "Merupakan perawatan rutin untuk memastikan semua komponen suspensi, khususnya shock absorber, tetap bekerja optimal.",
    },
    {
      nama: "PAKET REBOUND & DOWNSIZE",
      image:"./layanan/paket.png",
      desc: "Kombinasi ini ideal bagi kendaraan yang ingin mendapatkan performa suspensi maksimal dengan respons cepat serta pengurangan berat total",
    },
  ];
  return (
    <div>
       <img src="./layanan-mekanik.jpg" className="w-full h-full object-cover object-center absolute top-0 opacity-15" alt="" />
    <div className="container mx-auto tablet:max-w-6xl tablet:px-10 relative">
      <div className="px-4">
        {/* Headings */}
        <div className="mb-2">
          <h2 className="text-2xl text-gray-800 font-medium">LAYANAN KAMI</h2>
        </div>
        <div className="mb-6">
          <h1 className="text-3xl tablet:text:4xl text-gray-800 font-bold">
            PILIH LAYANAN SUSPENSI ANDA
          </h1>
        </div>
      </div>

      {/* Product slider */}
      <div className="relative flex">
        {/* Navigation arrow - Previous */}
          <button
            onClick={() => index > 0&&setIndex(index - 1)}
            className="absolute left-12 tablet:left-0 bottom-0 tablet:top-1/2 tablet:-translate-y-1/2 -translate-x-12 z-10 bg-yellow-300 p-4 border border-gray-600 hover:bg-gray-100 h-fit"
            aria-label="Previous slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 19L8 12L15 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

        {/* Product content grid */}
        <div className="flex w-full items-center ">
          {/* Racing motorcycle image - left side */}
          <div className="w-4/5">
          <div className="relative">
          {/* <span className="bg-black w-full h-full absolute top-0 opacity-20"></span> */}
            <img
              src={SEMUA_LAYANAN[index].image}
              alt="Racing motorcycle on track"
              className="w-full h-96 object-cover object-center rounded-xl"
              />
              </div>
          </div>

          {/* Product image - right side */}
          <div className="w-2/5 bg-white shadow-lg flex flex-col gap-2  tablet:p-5">
            <span className="bg-black tablet:text-2xl text-sm text-white tablet:pl-3 text-center py-3 uppercase font-medium hover:bg-gray-800 transition-colors">
              {SEMUA_LAYANAN[index].nama}
            </span>
            <p className="text-xs tablet:text-lg text-gray-800 px-1 pb-5">
              {SEMUA_LAYANAN[index].desc.toLowerCase()}
            </p>
          </div>
        </div>

        {/* Navigation arrow - Next */}
        {index < SEMUA_LAYANAN.length - 1 && (
          <button
            className="absolute tablet:top-1/2 tablet:-translate-y-1/2 right-12 bottom-0 tablet:right-0 translate-x-12 z-10 bg-yellow-300 p-4 border border-gray-600 hover:bg-gray-100 h-fit"
            onClick={() => setIndex(index + 1)}
            aria-label="Next slide"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 5L16 12L9 19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
    </div>
  );
}
