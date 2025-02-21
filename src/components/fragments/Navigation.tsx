import { FaInstagram } from "react-icons/fa6";
import { PiTiktokLogoBold } from "react-icons/pi";

export const Navigation = () => {

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-2 tablet:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <img src="./LOGO%20REMAKE.png" className="w-8 h-8" alt="" />
            <h1 className="text-xl tablet:text-3xl font-bold text-orange-600">
              GG Suspension
            </h1>
          </div>

          <span className='flex tablet:gap-3 gap-1'>
            <a className="hover:cursor-pointer" href="https://www.instagram.com/officialggsuspension/">
              <FaInstagram className='bg-gradient-to-br from-[#FEDA75] via-[#D62976] to-[#4F5BD5] text-white tablet:text-4xl text-2xl rounded-full p-1'/>
            </a>
            <a className="hover:cursor-pointer" href="https://www.tiktok.com/@officialggsuspension">
            <PiTiktokLogoBold className='hover:cursor-pointer bg-gradient-to-br from-[#69C9D0] to-[#EE1D52] text-white tablet:text-4xl text-2xl rounded-full p-1'/>
            </a>              
            </span>
        </div>
      </div>
    </nav>
  );
};
