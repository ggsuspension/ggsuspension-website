import {
  Settings,
  Gauge,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { FaTools } from "react-icons/fa";
import { MdOutlineWavingHand } from "react-icons/md";
export default function ModalWelcome() {
  const [isModal, setIsModal] = useState(true);

  return (
    <div>
     {isModal&& <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 p-4 z-50">
        <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all border-2 border-yellow-500">
          {/* Decorative elements */}
          <div className="absolute -top-2 -left-2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center z-10 shadow-lg">
            <Settings
              size={28}
              className="text-black animate-spin-slow"
              style={{ animationDuration: "15s" }}
            />
          </div>
          <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <FaTools size={28} className="text-white" />
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-5 flex justify-between items-center relative overflow-hidden">
            <div className="flex items-center z-10">
              <div className="bg-black rounded-full p-2 mr-3">
                <Gauge size={24} className="text-yellow-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-wider">
                  WELCOME
                </h2>
                {/* <p className="text-yellow-300 text-xs font-medium">PERFORMANCE WORKSHOP</p> */}
              </div>
            </div>

            {/* Decorative suspension patterns */}
            <div className="absolute top-0 right-0 opacity-10">
              <svg
                width="120"
                height="80"
                viewBox="0 0 120 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20,20 Q40,60 60,20 Q80,60 100,20 Q120,60 140,20"
                  stroke="white"
                  strokeWidth="4"
                />
                <path
                  d="M0,50 Q20,10 40,50 Q60,10 80,50 Q100,10 120,50"
                  stroke="white"
                  strokeWidth="4"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 bg-gradient-to-b from-gray-900 to-black text-white relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
              >
                <circle cx="50" cy="15" r="10" />
                <rect x="45" y="25" width="10" height="30" />
                <rect x="30" y="55" width="40" height="10" rx="5" />
                <rect x="45" y="65" width="10" height="20" />
              </svg>
            </div>

            {/* <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-1 h-6 bg-yellow-500 mr-2"></div>
              <h3 className="text-lg font-bold text-white">PERFORMANCE SUSPENSION</h3>
            </div>
            <p className="text-gray-300 ml-3 border-l-2 border-orange-500 pl-3">Experience the perfect balance of comfort and control with our expert suspension tuning services.</p>
          </div>
           */}
            {/* Services List */}
            <div className="mb-6 bg-gray-800 p-4 rounded-lg border-l-4 border-yellow-500 relative overflow-hidden">
              <svg
                className="absolute right-0 top-0 opacity-5 h-full"
                viewBox="0 0 100 200"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10,10 L10,190 M30,10 L30,190 M50,10 L50,190 M70,10 L70,190 M90,10 L90,190"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="1 10"
                />
              </svg>
              <p className="text-yellow-500 text-2xl tablet:text-3xl mt-3 font-bold">
                Selamat Datang di GG Suspension Masbro <MdOutlineWavingHand className="inline" />
              </p>
              <p className="text-lg tablet:text-2xl">Klik "OKE" untuk memilih service</p>
            </div>

            {/* Form Fields */}
              <p onClick={() => setIsModal(false)} className="bg-gradient-to-r from-orange-800 via-orange-600 to-yellow-500  font-bold py-2 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 focus:outline-none flex items-center shadow-lg text-2xl text-white mt-5 justify-center gap-2">
                OKE <CheckCircle />
              </p>

            {/* Footer */}
            {/* <div className="flex justify-between mt-6">
            <button 
              onClick={closeModal}
              className="py-2 px-6 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 focus:outline-none flex items-center"
            >
              <X size={16} className="mr-2" /> Cancel
            </button>
            <button 
              onClick={handleSubmit}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-2 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 focus:outline-none flex items-center shadow-lg"
            >
              Book Service <ChevronRight size={16} className="ml-1" />
            </button>
          </div> */}
          </div>

          {/* Footer accent elements */}
          <div className="h-3 bg-black flex">
            <div className="w-1/5 h-full bg-orange-500"></div>
            <div className="w-1/5 h-full bg-yellow-500"></div>
            <div className="w-1/5 h-full bg-orange-500"></div>
            <div className="w-1/5 h-full bg-yellow-500"></div>
            <div className="w-1/5 h-full bg-orange-500"></div>
          </div>

          {/* Decorative suspension illustration */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <svg
              width="100"
              height="6"
              viewBox="0 0 100 6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,3 C10,0 20,6 30,3 C40,0 50,6 60,3 C70,0 80,6 90,3 C95,1 100,3 100,3"
                stroke="orange"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>}
    </div>
  );
}
