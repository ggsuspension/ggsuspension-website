import { getAntrianCustomer } from "@/utils/ggAPI";
import { getCookie } from "@/utils/getCookie";
import { useEffect, useState } from "react";
import { FaMotorcycle, FaUserAlt, FaTools } from "react-icons/fa";
import Navbar from "../fragments/Navbar";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  CalendarDays, 
  Settings, 
  ChevronRight, 
  Activity,
  Clock,
  CheckCircle2,
  XCircle 
} from "lucide-react";
import { formatDate } from "@/utils/date";
import { RiStore3Fill } from "react-icons/ri";
import { getChannel, supabase } from "@/utils/realtime";
import { RealtimeChannel } from "@supabase/supabase-js";

interface PresenceData {
  user: string;
  online_at: string;
}

export default function AntrianSemuaGerai() {
  const [data, setData] = useState<any>(undefined);
  const [dataCustomerNotFiltered, setDataCustomerNotFiltered] =
    useState<any>(undefined);
  let getCookiePelanggan: any = getCookie("pelangganGGSuspension");
  getCookiePelanggan = getCookiePelanggan ? JSON.parse(getCookiePelanggan) : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAntrianCustomer();
        setDataCustomerNotFiltered(res);
        const today = new Date();
        const filteredData = res.filter((item: any) => {
          return (
            item.created_at.split("T")[0] === today.toISOString().split("T")[0]
          );
        });
        if (filteredData.length === 0) {
          setData([]); // Set data kosong jika tidak ada antrian hari ini
          return;
        }

        // Kelompokkan data berdasarkan gerai
        const grouped = filteredData.reduce((acc: any, cur: any) => {
          const key = cur.gerai;
          if (!acc[key]) {
            acc[key] = {
              id: cur.id,
              data: [{ ...cur, waktu: new Date(cur.createdAt).getTime() }],
              gerai: cur.gerai,
              status: cur.status || false,
            };
          } else {
            acc[key].data.push({
              ...cur,
              waktu: new Date(cur.createdAt).getTime(),
            });
          }
          return acc;
        }, {});
        const output = Object.values(grouped);
        setData(output);
      } catch (error) {
        console.error("Gagal mengambil data antrian:", error);
        setData([]); // Set data kosong jika ada error
      }
    };
    fetchData();
  }, []);

  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const newChannel = getChannel();
    setChannel(newChannel);
    newChannel
      .on("broadcast", { event: "message" }, (payload: any) => {
        payload && window.location.reload();
      })
      .on(
        "presence",
        { event: "join" },
        ({ newPresences }: { newPresences: PresenceData[] }) => {
          console.log("User joined:", newPresences);
        }
      )
      .on(
        "presence",
        { event: "leave" },
        ({ leftPresences }: { leftPresences: PresenceData[] }) => {
          console.log("User left:", leftPresences);
        }
      )
      .on(
        "system",
        { event: "connection_state_change" },
        ({ old, new: newState }: { old: string; new: string }) => {
          console.log(`Connection state changed from ${old} to ${newState}`);
        }
      );

    newChannel.subscribe((status: string) => {
      if (status === "SUBSCRIBED") {
        newChannel.track({
          online_at: new Date().toISOString(),
        });
      }
    });

    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel);
      }
    };
  }, [dataCustomerNotFiltered]);

  useEffect(() => {
    if (channel && status === "SUBSCRIBED") {
      channel.track({
        online_at: new Date().toISOString(),
      });
    }
  }, [channel, status]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-600 to-orange-500 relative">
      {/* Decorative background elements */}
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

      <Navbar />
      
      <div className="container mx-auto flex flex-col gap-4 p-4 pt-14 tablet:p-8 relative z-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-white hover:text-yellow-300 mt-16 transition duration-300 bg-black bg-opacity-20 p-3 rounded-lg w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">Kembali</span>
        </Link>
        
        {/* Stylized Header */}
        <div className="relative mt-8 mb-6">
          <div className="absolute -top-6 -left-2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center z-10 shadow-lg">
            <Settings
              size={28}
              className="text-black animate-spin-slow"
              style={{ animationDuration: "15s" }}
            />
          </div>
          <div className="absolute -top-6 -right-2 w-12 h-12 bg-black rounded-full flex items-center justify-center z-10 shadow-lg">
            <FaTools size={20} className="text-orange-500" />
          </div>

          <h1 className="text-3xl tablet:text-5xl font-bold text-center text-white mb-2 tracking-widest flex items-center justify-center gap-3 bg-black bg-opacity-30 py-6 rounded-lg shadow-lg border-b-4 border-yellow-500">
            ANTRIAN SEMUA GERAI
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

        {/* Calendar Card */}
        <div className="flex justify-center items-center mb-4 p-0 relative">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-black rounded-full p-2">
              <CalendarDays className="text-yellow-500" size={24} />
            </div>
            <p className="text-xl tablet:text-2xl font-bold text-black">
              {formatDate(new Date())}
            </p>
            <div className="bg-black rounded-full p-2">
              <Activity className="text-orange-500" size={24} />
            </div>
          </div>
        </div>

        {/* Antrian Saya Button */}
        {getCookiePelanggan.gerai && (
          <div className="flex justify-center mb-4">
            <a
              className="bg-gradient-to-r from-yellow-600 to-orange-800 hover:from-yellow-500 hover:to-orange-700 px-6 py-3 text-white rounded-md tablet:text-xl font-bold flex items-center gap-2 shadow-lg transform hover:translate-y-1 transition-all duration-300 border-b-4 border-yellow-800"
              href={`/#/antrian/${getCookiePelanggan.gerai.toLowerCase()}`}
            >
              <FaUserAlt className="text-yellow-300" />
              Masuk Antrian Saya
              <ChevronRight size={20} />
            </a>
          </div>
        )}

        {/* Loading State */}
        {data === undefined ? (
          <div className="flex flex-col items-center justify-center p-12 bg-black bg-opacity-20 rounded-lg text-white">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-medium">Loading...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-black bg-opacity-50 text-center p-8 rounded-lg shadow-lg border-l-4 border-yellow-500">
            <div className="inline-block p-4 bg-orange-500 rounded-full mb-4">
              <FaMotorcycle size={32} className="text-white" />
            </div>
            <p className="text-xl text-white font-bold">
              Tidak ada antrian hari ini.
            </p>
          </div>
        ) : (
          // Gerai List
          <div className="grid grid-cols-1 gap-6">
            {data.map((row: any, index: number) => (
              <div 
                key={index}
                className="bg-black bg-opacity-80 rounded-lg shadow-xl p-4 border-l-4 border-yellow-500 relative overflow-hidden"
              >
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
                
                {/* Gerai Header */}
                <div className="flex items-center gap-3 mb-4 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-lg p-3 shadow-lg">
                  <div className="bg-black rounded-full p-2">
                    <RiStore3Fill className="text-yellow-500" size={24} />
                  </div>
                  <h2 className="text-xl tablet:text-2xl font-bold text-black tracking-wide">
                    GERAI {row.gerai}
                  </h2>
                </div>
                
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse mb-4">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm tablet:text-lg border-b-2 border-orange-500">
                        <th className="p-3 text-center">No</th>
                        <th className="p-3 text-left">
                          <div className="flex items-center gap-2">
                            <FaUserAlt className="text-yellow-500" />
                            <span>Nama</span>
                          </div>
                        </th>
                        <th className="p-3 text-left">
                          <div className="flex items-center gap-2">
                            <FaMotorcycle className="text-yellow-500" />
                            <span>Motor</span>
                          </div>
                        </th>
                        <th className="p-3 text-left">Layanan</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {row.data
                        .sort((a: any, b: any) => a.waktu - b.waktu)
                        .map((item: any, index: number) => (
                          <tr
                            key={index}
                            className="font-medium text-white border-b border-gray-700 transition-colors hover:bg-gray-800"
                          >
                            <td className="p-3 text-center text-lg font-bold">
                              <span className="inline-flex items-center justify-center bg-orange-500 text-black w-8 h-8 rounded-full">
                                {index + 1}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="block text-sm tablet:text-base">
                                {item.nama.toUpperCase()}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="block text-sm tablet:text-base">
                                {item.motor ? item.motor.toUpperCase() : "-"}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="block text-sm tablet:text-base">
                                {item.layanan ? item.layanan.toUpperCase() : "-"}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              {item.status === "FINISH" ? (
                                <span className="inline-flex items-center px-3 py-1 font-bold text-green-500 bg-green-900 bg-opacity-30 rounded-full gap-1">
                                  <CheckCircle2 size={16} />
                                  Finish
                                </span>
                              ) : item.status === "PROGRESS" ? (
                                <span className="inline-flex items-center px-3 py-1 font-bold text-yellow-500 bg-yellow-900 bg-opacity-30 rounded-full gap-1">
                                  <Clock size={16} />
                                  Progress
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1 font-bold text-red-500 bg-red-900 bg-opacity-30 rounded-full gap-1">
                                  <XCircle size={16} />
                                  Cancel
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
        
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
}