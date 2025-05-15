import { getAntrianByGeraiAndDate } from "@/utils/ggAPI";
import { getCookie } from "@/utils/getCookie";
import { useEffect, useState } from "react";
import { FaMotorcycle, FaUserAlt, FaClock } from "react-icons/fa";
import Navbar from "../fragments/Navbar";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Settings,
  ChevronRight,
  Activity,
  Layers,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Antrian } from "@/types";
import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/utils/realtime";
import ModalDetailAntrian from "../fragments/ModalDetailAntrian";
import { BsTools } from "react-icons/bs";

// Interface untuk presence data
interface PresenceData {
  user: string;
  online_at: string;
}

// Buat fungsi untuk mendapatkan channel
const getChannel = (): RealtimeChannel => {
  return supabase.channel("test-channel");
};

export default function AntrianSaya() {
  const [data, setData] = useState<Antrian[]>([]);
  const [detailCustomer, setDetailCustomer] = useState<Antrian[]>([]);
  const [currentDateFormatted, setCurrentDateFormatted] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { gerai } = useParams<{ gerai: string }>();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  let getCookiePelanggan: any = getCookie("pelangganGGSuspension");
  getCookiePelanggan = getCookiePelanggan ? JSON.parse(getCookiePelanggan) : {};

  const timeZoneMap: { [key: string]: { zone: string; label: string } } = {
    BEKASI: { zone: "Asia/Jakarta", label: "WIB" },
    JAKARTA: { zone: "Asia/Jakarta", label: "WIB" },
    BANDUNG: { zone: "Asia/Jakarta", label: "WIB" },
    BALI: { zone: "Asia/Makassar", label: "WITA" },
    MAKASSAR: { zone: "Asia/Makassar", label: "WITA" },
    PAPUA: { zone: "Asia/Jayapura", label: "WIT" },
    AMBON: { zone: "Asia/Jayapura", label: "WIT" },
  };

  const getTimeZoneInfo = (geraiName: string) => {
    const normalizedGerai = geraiName?.toUpperCase();
    return (
      timeZoneMap[normalizedGerai] || { zone: "Asia/Jakarta", label: "WIB" }
    );
  };

  const formatDateForAPI = (date: Date): string => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };

  const formatDateForDisplay = (
    dateString: string,
    timeZone: string
  ): string => {
    const [day, month, year] = dateString.split("-");
    const date = new Date(`20${year}-${month}-${day}`);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone,
    };
    return date.toLocaleString("id-ID", options).replace(",", "");
  };

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);
      try {
        const targetGerai = gerai || getCookiePelanggan.gerai;
        if (!targetGerai) {
          setError("Gerai tidak ditemukan di URL atau cookie");
          setData([]);
          return;
        }
        const currentDate = new Date();
        const formattedDate = formatDateForAPI(currentDate);
        const timeZoneInfo = getTimeZoneInfo(targetGerai);
        setCurrentDateFormatted(
          formatDateForDisplay(formattedDate, timeZoneInfo.zone)
        );
        const res = await getAntrianByGeraiAndDate(
          currentDate.toISOString(),
          targetGerai
        );
        if (!Array.isArray(res)) {
          console.error("Data dari API bukan array:", res);
          setError("Data antrian tidak valid");
          setData([]);
          return;
        }

        const sortedData = res
          .map((item: any) => {
            return {
              ...item,
              nama: item.nama || "N/A",
              motor: item.motor || { id: 0, name: "N/A" },
              motorPart: item.motor_part ||
                item.motorPart || {
                  id: 0,
                  service: "N/A",
                  subcategory: item.subcategory || {
                    id: 0,
                    name: "N/A",
                    category: item.category || { id: 0, name: "N/A" },
                  },
                },
              createdAt:
                item.created_at || item.waktu || new Date().toISOString(),
              waktu: new Date(
                item.created_at || item.waktu || Date.now()
              ).getTime(),
              gerai: item.gerai || { id: 0, name: targetGerai || "N/A" },
              status: item.status || "Unknown",
            };
          })
          .sort((a: any, b: any) => a.waktu - b.waktu);
        setData(sortedData);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Gagal mengambil data antrian";
        console.error("Gagal mengambil data antrian:", error);
        setError(errorMessage);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [gerai]);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const newChannel = getChannel();
    setChannel(newChannel);
    newChannel
      .on("broadcast", { event: "message" }, (payload: any) => {
        if (payload.payload.data.gerai.toLowerCase() == gerai?.toLowerCase())
          setData([...data, payload.payload.data]);
      })
      .on("broadcast", { event: "sparepart" }, (payload: any) => {
       if(payload.payload.data.toLowerCase()==gerai?.toLowerCase()){
         window.location.reload();
       };
      }
      //   if (payload.payload.gerai.toLowerCase() == gerai?.toLowerCase())
      //     setData([...data, payload.payload.data]);
      // }\
    )
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
          setStatus(newState);
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
  }, [data]);

  useEffect(() => {
    if (channel && status === "SUBSCRIBED") {
      channel.track({
        online_at: new Date().toISOString(),
      });
    }
  }, [channel, status]);

  function handleDetail(id: number) {
    const dataCustomer = data.filter((item: any) => item.id === id);
    setDetailCustomer(dataCustomer);
    setModal(true);
  }

  const currentGerai = (gerai || getCookiePelanggan.gerai)?.toUpperCase();

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

      <Navbar />

      {modal && (
        <ModalDetailAntrian
          setCloseModal={(data: any) => setModal(data)}
          data={detailCustomer}
        />
      )}

      <div className="container mx-auto flex flex-col gap-3 p-4 pt-12 z-10 relative">
        <Link
          to="/antrian"
          className="flex items-center gap-2 text-white hover:text-yellow-300 mt-16 transition duration-300 bg-black bg-opacity-20 p-3 rounded-lg w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">Kembali</span>
        </Link>

        <div className="relative mt-8 mb-6">
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
            ANTRIAN{" "}
            {currentGerai && (
              <>
                <span className="bg-yellow-500 text-black px-2 py-1 rounded mx-1 shadow-inner">
                  {currentGerai}
                </span>
              </>
            )}
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

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-black bg-opacity-20 rounded-lg text-white">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-medium">Loading...</p>
          </div>
        ) : data.length > 0 ? (
          <div className="bg-black bg-opacity-80 rounded-lg shadow-xl p-4 border-l-4 border-yellow-500 relative overflow-hidden">
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
                <CalendarDays className="text-yellow-500" size={20} />
              </div>
              <h2 className="text-xl tablet:text-2xl font-bold text-black">
                {currentDateFormatted}
              </h2>
              <div className="bg-black rounded-full p-2">
                <Activity className="text-orange-500" size={20} />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm tablet:text-lg border-b-2 border-orange-500">
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
                    <th className="p-3 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Layers className="text-yellow-500" />
                        <span>Status</span>
                      </div>
                    </th>
                    <th className="p-3 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Settings className="text-yellow-500" />
                        <span>Action</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: Antrian, index: number) => (
                    <tr
                      key={index}
                      className={`font-medium text-white border-b border-gray-700 transition-colors hover:bg-gray-800`}
                    >
                      <td className="p-3">
                        <span className="block text-sm tablet:text-base">
                          {String(item.nama || "N/A").toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center mt-1">
                          <FaClock className="mr-1" />{" "}
                          {new Date(item.createdAt).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="block text-sm tablet:text-base">
                            {String(
                              item.motor?.name || item.motor || "N/A"
                            ).toUpperCase()}
                          </span>
                        </div>
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
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleDetail(item.id)}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-medium py-1 px-3 rounded flex items-center gap-1 hover:from-yellow-600 hover:to-orange-600 transition-all mx-auto"
                        >
                          Detail
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-black bg-opacity-50 text-center p-8 rounded-lg shadow-lg border-l-4 border-yellow-500">
            <div className="inline-block p-4 bg-orange-500 rounded-full mb-4">
              <FaMotorcycle size={32} className="text-white" />
            </div>
            <p className="text-xl text-white font-bold">
              Tidak ada antrian untuk gerai ini.
            </p>
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
