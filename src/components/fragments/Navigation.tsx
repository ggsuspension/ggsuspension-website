import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
// import { FaInstagram } from "react-icons/fa6";
// import { PiTiktokLogoBold } from "react-icons/pi";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
  }, []);

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-2 tablet:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center tablet:gap-2 gap-1">
            <img src="./LOGO%20REMAKE.png" className="tablet:w-10 tablet:h-10 w-6 h-6" alt="" />
            <h1 className="text-lg tablet:text-3xl font-bold text-orange-600">
              GG Suspension
            </h1>
          </div>
          <div className="flex gap-1 tablet:gap-5">
          <div className="flex items-center text-xs tablet:text-lg">
            <FaLocationDot className="text-red-500"/><select name="location" className="w-[6.8em] tablet:w-full" id="">
              <option value="">Pilih Gerai</option>
              <option value="Bekasi">Bekasi</option>
              <option value="Tangerang">Tangerang</option>
              <option value="Depok">Depok</option>
              <option value="Cikarang">Cikarang</option>
              <option value="Jaksel">Jaksel</option>
              <option value="Jaktim">Jaktim</option>
              <option value="Bogor">Bogor</option>
            </select>
          </div>

          <div className="flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <p className="text-xs font-semibold tablet:text-lg p-1  bg-orange-500 rounded-md text-white">Menu</p>
                // <Menu className="h-6 w-6 bg-orange-500 rounded-md text-white tablet:bg-white tablet:text-black tablet:h-8 tablet:w-8" />
              )}
            </button>
          </div>
          </div>
          {/* <span className='flex tablet:gap-3 gap-1'>
            <a className="hover:cursor-pointer" href="https://www.instagram.com/officialggsuspension/">
              <FaInstagram className='bg-gradient-to-br from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white tablet:text-4xl text-2xl rounded-full p-1'/>
            </a>
            <a className="hover:cursor-pointer" href="https://www.tiktok.com/@officialggsuspension">
            <PiTiktokLogoBold className='hover:cursor-pointer bg-gradient-to-br from-[#69C9D0] to-[#EE1D52] text-white tablet:text-4xl text-2xl rounded-full p-1'/>
            </a>              
            </span> */}
        </div>
        {isMenuOpen && (
          <div className="">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#about" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Tentang Kami</a>
              <a href="#services" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Layanan</a>
              <a href="#harga" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Cek Harga</a>
              <a href="#testimoni" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Testimoni</a>
              <a href="#article" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Artikel & Tips</a>
              <a href="#contact" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Kontak</a>
              <a href="#article" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Customer Support</a>
            </div>
          </div>)}
      </div>
    </nav>
  );
};
