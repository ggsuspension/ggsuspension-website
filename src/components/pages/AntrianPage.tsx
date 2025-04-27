import { getAntrianByGeraiAndDate } from "@/utils/ggAPI";
import { getCookie } from "@/utils/getCookie";
import { useEffect, useState } from "react";
import { FaMotorcycle } from "react-icons/fa";
import Navbar from "../fragments/Navbar";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Antrian } from "@/types";

// interface AntrianItem {
//   id: number;
//   nama: string | null;
//   motor: { id: number; name: string } | null;
//   motorPart: {
//     id: number;
//     service: string;
//     subcategory: {
//       id: number;
//       name: string;
//       category: { id: number; name: string } | null;
//     } | null;
//   } | null;
//   createdAt: string;
//   waktu: string;
//   status: string;
//   geraiId: number;
//   gerai: { id: number; name: string } | null;
// }

export default function AntrianSaya() {
  const [data, setData] = useState<Antrian[]>([]);
  const [currentDateFormatted, setCurrentDateFormatted] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { gerai } = useParams<{ gerai: string }>();
  let getCookiePelanggan: any = getCookie("pelangganGGSuspension");
  getCookiePelanggan = getCookiePelanggan ? JSON.parse(getCookiePelanggan) : {};

  console.log("Cookie pelanggan di Antrian Saya:", getCookiePelanggan);

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

  const formatTimeForDisplay = (
    dateString?: string,
    timeZone?: string
  ): string => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return "N/A";
    }
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timeZone || "Asia/Jakarta",
    };
    const timeZoneLabel = getTimeZoneInfo(
      gerai || getCookiePelanggan.gerai || "BEKASI"
    ).label;
    return `${date.toLocaleString("id-ID", options)} ${timeZoneLabel}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
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

        const res = await getAntrianByGeraiAndDate(formattedDate, targetGerai);
        console.log(
          `Data dari /api/antrian?date=${formattedDate}&gerai_id=${targetGerai}:`,
          res
        );

        if (!Array.isArray(res)) {
          console.error("Data dari API bukan array:", res);
          setError("Data antrian tidak valid");
          setData([]);
          return;
        }

        const sortedData = res
          .map((item: any) => {
            console.log("Mapping item:", item);
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

        console.log("Sorted Data:", sortedData);
        setData(sortedData);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Gagal mengambil data antrian";
        console.error("Gagal mengambil data antrian:", error);
        setError(errorMessage);
        setData([]);
      }
    };
    fetchData();
  }, [gerai]);

  const timeZoneInfo = getTimeZoneInfo(
    gerai || getCookiePelanggan.gerai || "BEKASI"
  );

  return (
    <div className="w-full mx-auto min-h-screen bg-orange-500">
      <Navbar />
      <div className="container mx-auto flex flex-col gap-3 p-2 pt-12 tablet:p-20">
        <Link
          to="/antrian"
          className="flex items-center gap-2 text-white hover:text-gray-800 mt-14 sm:mt-14"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-medium">Kembali</span>
        </Link>
        <h1 className="tablet:text-5xl tablet:mb-5 text-xl font-bold text-center text-white mt-12 tracking-widest">
          ANTRIAN GERAI{" "}
          {(gerai || getCookiePelanggan.gerai) &&
            String(gerai || getCookiePelanggan.gerai).toUpperCase()}{" "}
          <FaMotorcycle className="inline" />
        </h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
            {error}
          </div>
        )}
        {data.length > 0 ? (
          <div className="bg-white rounded-lg shadow-xl p-2">
            <p className="text-center text-lg font-semibold text-gray-800 mb-4">
              Tanggal: {currentDateFormatted}
            </p>
            <table className="w-full border-collapse border border-gray-500 mb-4 tablet:text-xl">
              <thead>
                <tr className="bg-gray-100 text-sm tablet:text-xl">
                  <th className="border p-2">No</th>
                  <th className="border p-2">Nama</th>
                  <th className="border p-2">Motor</th>
                  <th className="border p-2">Jenis Layanan</th>
                  <th className="border p-2">Gerai</th>
                  <th className="border p-2">Waktu Masuk</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item: Antrian, index: number) => (
                  <tr
                    key={item.id}
                    className="font-semibold text-center text-sm tablet:text-lg"
                  >
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">
                      {String(item.nama || "N/A").toUpperCase()}
                    </td>
                    <td className="border p-2">
                      {String(item.motor?.name || "N/A").toUpperCase()}
                    </td>
                    <td className="border p-2">
                      {String(
                        item.motorPart?.subcategory?.category?.name ||
                          item.motorPart?.subcategory?.name ||
                          item.motorPart?.service ||
                          "N/A"
                      ).toUpperCase()}
                    </td>
                    <td className="border p-2">
                      {String(item.gerai?.name || "N/A").toUpperCase()}
                    </td>
                    <td className="border p-2">
                      {formatTimeForDisplay(item.createdAt, timeZoneInfo.zone)}
                    </td>
                    <td className="border p-2">
                      {item.status === "FINISHED" ? (
                        <span className="flex items-center font-bold text-green-600 gap-1 justify-center">
                          <span className="bg-green-500 w-2 h-2 rounded-full" />
                          Finish
                        </span>
                      ) : item.status === "PROGRESS" ? (
                        <span className="flex items-center font-bold text-yellow-500 gap-1 justify-center">
                          <span className="bg-yellow-500 w-2 h-2 rounded-full" />
                          Progress
                        </span>
                      ) : (
                        <span className="flex items-center font-bold text-gray-500 gap-1 justify-center">
                          <span className="bg-gray-400 w-2 h-2 rounded-full" />
                          {item.status || "Unknown"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-xl text-yellow-400 font-bold">
            Tidak ada antrian untuk gerai ini.
          </p>
        )}
      </div>
    </div>
  );
}
