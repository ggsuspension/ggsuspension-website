import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa6";
import { PiTiktokLogoBold } from "react-icons/pi";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-2 tablet:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img src="./LOGO%20REMAKE.png" className="w-8 h-8" alt="" />
            <h1 className="text-xl tablet:text-3xl font-bold text-orange-600">
              GG Suspension
            </h1>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Beranda</a>
              <a href="#about" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Tentang Kami</a>
              <a href="#services" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Layanan</a>
              <a href="#harga" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Cek Harga</a>
              <a href="#testimoni" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Testimoni</a>
              <a href="#article" className="block px-3 py-2 text-gray-600 hover:text-blue-600">Artikel & Tips</a>
            </div>
          </div>)}
      </div>
    </nav>
  );
};
