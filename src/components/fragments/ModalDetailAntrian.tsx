import {
  X,
  Wrench,
//   ChevronRight,
  Settings,
  Gauge,
//   CheckCircle2,
//   Calendar,
//   Phone,
} from "lucide-react";
import { FaTools } from "react-icons/fa";

interface ModalProps {
  setCloseModal: (data: any) => void;
  data: any;
  // tambahkan props lain di sini jika perlu
}

export default function ModalDetailAntrian({
  setCloseModal,
  data,
}: ModalProps) {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
  // Close modal
  const dataCustomer = data[0];

  // Services list with icons
  const services = [
    {
      name: dataCustomer.layanan,
      icon: "⚙️",
    },
    {
      name: dataCustomer.bagian_motor,
      icon: "🔧",
    },
    {
      name: dataCustomer.bagian_motor2 || "-",
      icon: "🔧",
    },
    //  {
    //   name: "Fork Oil Change & Rebuild",
    //   icon: "⚙️"
    // },
    // {
    //   name: "Custom Suspension Setup",
    //   icon: "🛠️"
    // },
    // {
    //   name: "Race Suspension Tuning",
    //   icon: "🏁"
    // },
    // {
    //   name: "Lowering & Raising Kits",
    //   icon: "📏"
    // }
  ];
  function closeModal() {
    setCloseModal(false);
  }


  return (
    <div>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 p-4 z-50">
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
                    DETAIL ANTRIAN
                  </h2>
                  {/* <p className="text-yellow-300 text-xs font-medium">PERFORMANCE WORKSHOP</p> */}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="bg-black bg-opacity-30 rounded-full p-1 text-white hover:bg-opacity-50 focus:outline-none z-10"
              >
                <X size={20} />
              </button>

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
                <h4 className="font-bold text-yellow-400 mb-3 flex items-center">
                  <Wrench size={16} className="mr-2" />
                  LAYANAN ANDA
                </h4>
                <ul className="space-y-2">
                  {services.map((service, index) => (
                    <li
                      key={index}
                      className="flex items-center py-2 border-b border-gray-700 last:border-0"
                    >
                      <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-lg">
                        {service.icon}
                      </div>
                      <span className="text-gray-200">{service.name}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-yellow-500 text-lg mt-3 font-bold">
                  HARGA : {dataCustomer.harga_service?"Rp. "+dataCustomer.harga_service.toLocaleString():"Service belum dipilih"}
                </p>
              </div>

              {/* Form Fields */}
              <div className="bg-gray-800 rounded-lg p-4 border-t-2 border-orange-500">
                <h4 className="font-bold text-yellow-400 mb-4 flex items-center">
                  ⚙️ SPAREPART
                </h4>

                <div className="mb-4 relative">
                  <label
                    className="text-gray-300 text-sm font-bold mb-2 flex items-center"
                    htmlFor="name"
                  >
                    <div className="w-1 h-4 bg-yellow-500 mr-2"></div>
                    Sparepart
                  </label>
                  <p>{dataCustomer.sparepart}</p>
                </div>
                <p className="text-yellow-500 text-lg mt-3 font-bold">
                  HARGA : Rp. {dataCustomer.harga_sparepart?dataCustomer.harga_sparepart.toLocaleString():0}
                </p>
              </div>

              {/* Form Fields */}
              <div>
                
                <p  className="bg-gradient-to-r from-orange-800 to-orange-600 font-bold py-2 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 focus:outline-none flex items-center shadow-lg text-xl text-white mt-5">
                  TOTAL HARGA : Rp. {(dataCustomer.harga_sparepart + dataCustomer.harga_service).toLocaleString()}
                </p>
              </div>

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
        </div>
      
    </div>
  );
}
