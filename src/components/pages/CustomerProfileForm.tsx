import { useEffect, useState } from "react";
import { addCustomer, getGerais } from "@/utils/ggAPI";
import { Gerai } from "@/types";
import { QRCodeSVG } from "qrcode.react";
import {
  CalendarDays,
  Settings,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { FaMotorcycle, FaUserAlt, FaClock } from "react-icons/fa";
import { BsTools } from "react-icons/bs";
import { FRONTEND_URL } from "@/utils/ggsAPI";

const CustomerProfileForm = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gerais, setGerais] = useState<Gerai[]>([]);
  const [hasChatAdmin, setHasChatAdmin] = useState(false);
  const [isSuccessSubmit, setIsSuccessSubmit] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [geraiData] = await Promise.all([getGerais()]);
        setGerais(geraiData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Gagal memuat data";
        setError(`Gagal memuat data: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setIsLoading(true);
    setIsSubmit(true);
    const result = await addCustomer({
      nama: e.target.nama.value,
      plat_motor: e.target.plat.value,
      gerai: e.target.gerai.value,
      noWA: e.target.noWA.value,
      sudah_chat: hasChatAdmin
        ? e.target.isChatAdmin.value.toUpperCase() +
          " " +
          e.target.sosmed.value.toUpperCase()
        : e.target.isChatAdmin.value.toUpperCase(),
      sumber_info: e.target.sumber_info.value,
    });
    if (result.success) {
      setCustomerData(result.data);
      setIsLoading(false);
      setIsSubmit(false);
      setIsSuccessSubmit(true);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-600 to-orange-500 relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
        <svg
          className="absolute left-0 top-0 h-full w-1/3"
          viewBox="0 0 100 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10,10 L10,790 M30,10 L30,790 M50,10 L50,790 M70,10 L70,790 M90,10 L90,790"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="1 20"
          />
        </svg>
        <svg
          className="absolute right-0 top-0 h-full w-1/3"
          viewBox="0 0 100 800"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10,10 L10,790 M30,10 L30,790 M50,10 L50,790 M70,10 L70,790 M90,10 L90,790"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="1 20"
          />
        </svg>
        <svg
          className="absolute left-1/4 top-20 w-1/2"
          viewBox="0 0 200 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,50 Q50,0 100,50 Q150,100 200,50"
            stroke="white"
            strokeWidth="4"
            fill="none"
          />
        </svg>
        <svg
          className="absolute left-1/4 bottom-20 w-1/2"
          viewBox="0 0 200 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,50 Q50,0 100,50 Q150,100 200,50"
            stroke="white"
            strokeWidth="4"
            fill="none"
          />
        </svg>
      </div>

      {isSubmit && (
        <div className="h-full w-full fixed z-10 bg-black top-0 opacity-70"></div>
      )}

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-20">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="container mx-auto flex flex-col gap-3 p-4 pt-12 z-10 relative min-h-screen">
        <div className="relative mt-16 mb-6">
          <div className="absolute -top-6 -left-2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center z-10 shadow-lg">
            <Settings
              size={28}
              className="text-black animate-spin-slow"
              style={{ animationDuration: "15s" }}
            />
          </div>
          <div className="absolute -top-6 -right-2 w-12 h-12 bg-black rounded-full flex items-center justify-center z-10 shadow-lg">
            <BsTools size={20} className="text-orange-500" />
          </div>

          <h1 className="text-3xl tablet:text-5xl font-bold text-center text-white mb-2 tracking-widest flex items-center justify-center gap-3 bg-black bg-opacity-30 py-6 rounded-lg shadow-lg border-b-4 border-yellow-500">
            DATA DIRI{" "}
            <span className="bg-yellow-500 text-black px-2 py-1 rounded mx-1 shadow-inner">
              CUSTOMER
            </span>
            <FaMotorcycle className="inline text-yellow-400" />
          </h1>

          {/* Decorative suspension line */}
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
            <svg
              width="200"
              height="6"
              viewBox="0 0 200 6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,3 C20,0 40,6 60,3 C80,0 100,6 120,3 C140,0 160,6 180,3 C190,1 200,3 200,3"
                stroke="black"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {error && (
          <div className="bg-red-900 border-l-4 border-red-400 text-white px-6 py-4 rounded-lg shadow-lg mb-6 flex items-start">
            <XCircle className="mr-3 flex-shrink-0 text-red-400" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-black bg-opacity-80 rounded-lg shadow-xl p-6 border-l-4 border-yellow-500 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,50 C25,30 75,70 100,50 M0,30 C25,10 75,50 100,30 M0,70 C25,50 75,90 100,70"
                stroke="white"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>

          {/* Date header */}
          <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-lg p-3 shadow-lg">
            <div className="bg-black rounded-full p-2">
              <FaUserAlt className="text-yellow-500" size={20} />
            </div>
            <h2 className="text-xl tablet:text-2xl font-bold text-black">
              Form Pendaftaran
            </h2>
            <div className="bg-black rounded-full p-2">
              <Activity className="text-orange-500" size={20} />
            </div>
          </div>

          {isSuccessSubmit ? (
            <div className="flex flex-col items-center justify-center bg-black bg-opacity-50 p-6 rounded-lg text-white">
              <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
                <QRCodeSVG
                  value={`${FRONTEND_URL}/#/customer?id=${
                    customerData.id
                  }&gerai=${customerData.gerai.toLowerCase()}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-2xl font-bold text-yellow-500 mb-2">
                Scan QR Code untuk Customer
              </p>
              <div className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium mb-2">
                User ID: {customerData?.id}
              </div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <CheckCircle2 size={24} className="text-green-500" />
                <span className="text-green-400 font-medium">
                  Berhasil Ditambahkan
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-white">
              <div className="flex gap-2 tablet:gap-4">
                <div className="w-full">
                  <label className="flex items-center gap-2 mb-2 font-medium">
                    <FaUserAlt className="text-yellow-500" />
                    Nama
                  </label>
                  <input
                    type="text"
                    name="nama"
                    placeholder="Nama Customer"
                    required
                    className="w-full px-4 py-3 bg-slate-800 backdrop-blur-sm rounded-lg border border-orange-500/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="w-full">
                  <label className="flex items-center gap-2 mb-2 font-medium">
                    <FaMotorcycle className="text-yellow-500" />
                    Plat Motor
                  </label>
                  <input
                    type="text"
                    placeholder="Plat Nomor"
                    required
                    name="plat"
                    className="w-full px-4 py-3 bg-slate-800 backdrop-blur-sm rounded-lg border border-orange-500/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 font-medium">
                  <FaClock className="text-yellow-500" />
                  No WhatsApp
                </label>
                <div className="flex items-center gap-3">
                  <span>+62</span>
                  <input
                    type="text"
                    placeholder="8123456789"
                    required
                    name="noWA"
                    pattern="\[0-9]{9,12}"
                    title="Nomor WA harus diawali +62 dan memiliki 9-12 digit"
                    className="w-full px-4 py-3 bg-slate-800 backdrop-blur-sm rounded-lg border border-orange-500/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 font-medium">
                  <Settings className="text-yellow-500" />
                  Lokasi Gerai
                </label>
                <select
                  required
                  className="w-full px-4 py-3 bg-slate-800 backdrop-blur-sm rounded-lg border border-orange-500/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  name="gerai"
                >
                  <option value="">Pilih Lokasi Gerai</option>
                  {gerais.map((gerai) => (
                    <option key={gerai.id} value={gerai.name}>
                      {gerai.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg border-l-2 border-yellow-500">
                <p className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <Activity size={20} />
                  Sudah Chat Admin?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black bg-opacity-40 p-3 rounded-lg">
                    <span className="flex items-center">
                      <input
                        id="default-radio-2"
                        type="radio"
                        value="sudah"
                        name="isChatAdmin"
                        onChange={() => setHasChatAdmin(true)}
                        required
                        className="w-5 h-5 text-yellow-600 bg-gray-800 border-gray-800 focus:ring-yellow-500"
                      />
                      <label
                        htmlFor="default-radio-2"
                        className="ms-2 text-white font-medium"
                      >
                        Sudah Chat
                      </label>
                    </span>

                    {hasChatAdmin && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <span className="flex items-center">
                          <input
                            required
                            id="IG"
                            type="radio"
                            value="IG"
                            name="sosmed"
                            className="w-4 h-4 text-yellow-600 bg-gray-800 border-gray-700 focus:ring-yellow-500"
                          />
                          <label
                            htmlFor="IG"
                            className="ms-2 text-sm text-white"
                          >
                            IG
                          </label>
                        </span>
                        <span className="flex items-center">
                          <input
                            required
                            id="Tiktok"
                            type="radio"
                            value="Tiktok"
                            name="sosmed"
                            className="w-4 h-4 text-yellow-600 bg-gray-800 border-gray-700 focus:ring-yellow-500"
                          />
                          <label
                            htmlFor="Tiktok"
                            className="ms-2 text-sm text-white"
                          >
                            Tiktok
                          </label>
                        </span>
                        <span className="flex items-center">
                          <input
                            required
                            id="WA"
                            type="radio"
                            value="WA"
                            name="sosmed"
                            className="w-4 h-4 text-yellow-600 bg-gray-800 border-gray-700 focus:ring-yellow-500"
                          />
                          <label
                            htmlFor="WA"
                            className="ms-2 text-sm text-white"
                          >
                            WA
                          </label>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-black bg-opacity-40 p-3 rounded-lg">
                    <span className="flex items-center">
                      <input
                        required
                        id="datang"
                        type="radio"
                        value="datang langsung"
                        name="isChatAdmin"
                        onChange={() => setHasChatAdmin(false)}
                        className="w-5 h-5 text-yellow-600 bg-gray-800 border-gray-800 focus:ring-yellow-500"
                      />
                      <label
                        htmlFor="datang"
                        className="ms-2 text-white font-medium"
                      >
                        Datang Langsung
                      </label>
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg border-l-2 border-yellow-500">
                <h2 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <CalendarDays size={20} />
                  Sumber Informasi
                </h2>
                <div className="grid grid-cols-2 gap-4 tablet:grid-cols-4">
                  <div className="bg-black bg-opacity-40 p-3 rounded-lg">
                    <span className="flex items-center">
                      <input
                        required
                        id="IG2"
                        name="sumber_info"
                        value="IG"
                        type="radio"
                        className="w-4 h-4 text-yellow-600 bg-gray-800 border-gray-700 focus:ring-yellow-500"
                      />
                      <label htmlFor="IG2" className="ms-2 text-white">
                        Instagram
                      </label>
                    </span>
                  </div>
                  <div className="bg-black bg-opacity-40 p-3 rounded-lg">
                    <span className="flex items-center">
                      <input
                        id="Tiktok2"
                        name="sumber_info"
                        value="Tiktok"
                        type="radio"
                        className="w-4 h-4 text-yellow-600 bg-gray-800 border-gray-700 focus:ring-yellow-500"
                      />
                      <label htmlFor="Tiktok2" className="ms-2 text-white">
                        Tiktok
                      </label>
                    </span>
                  </div>
                  <div className="bg-black bg-opacity-40 p-3 rounded-lg">
                    <span className="flex items-center">
                      <input
                        id="Facebook"
                        name="sumber_info"
                        value="Facebook"
                        type="radio"
                        className="w-4 h-4 text-yellow-600 bg-gray-800 border-gray-700 focus:ring-yellow-500"
                      />
                      <label htmlFor="Facebook" className="ms-2 text-white">
                        Facebook
                      </label>
                    </span>
                  </div>
                  <div className="bg-black bg-opacity-40 p-3 rounded-lg">
                    <span className="flex items-center">
                      <input
                        id="Youtube"
                        name="sumber_info"
                        value="Youtube"
                        type="radio"
                        className="w-4 h-4 text-yellow-600 bg-gray-800 border-gray-700 focus:ring-yellow-500"
                      />
                      <label htmlFor="Youtube" className="ms-2 text-white">
                        Youtube
                      </label>
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-lg transition-all duration-300 uppercase tracking-wider cursor-pointer hover:from-yellow-600 hover:to-orange-600 shadow-lg text-lg flex items-center justify-center gap-2"
                disabled={isSubmit || isLoading}
              >
                <CheckCircle2 size={20} />
                KIRIM
              </button>
            </form>
          )}
        </div>

        {/* Decorative footer */}
        <div className="h-3 bg-black mt-6 flex rounded-full overflow-hidden">
          <div className="w-1/5 h-full bg-orange-500"></div>
          <div className="w-1/5 h-full bg-yellow-500"></div>
          <div className="w-1/5 h-full bg-orange-500"></div>
          <div className="w-1/5 h-full bg-yellow-500"></div>
          <div className="w-1/5 h-full bg-orange-500"></div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileForm;
