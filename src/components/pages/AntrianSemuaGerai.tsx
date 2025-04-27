import { getAllCustomers } from "@/utils/ggAPI";
import { getCookie } from "@/utils/getCookie";
import { useEffect, useState } from "react";
import { FaMotorcycle } from "react-icons/fa";
import Navbar from "../fragments/Navbar";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AntrianSemuaGerai() {
  const [data, setData] = useState<any>(undefined);
  let getCookiePelanggan: any = getCookie("pelangganGGSuspension");
  getCookiePelanggan = getCookiePelanggan ? JSON.parse(getCookiePelanggan) : "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllCustomers();
        console.log("Data dari /api/customers:", res);

        // Dapatkan tanggal hari ini dalam format yang sama dengan createdAt
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0)).getTime(); // Mulai hari ini
        const todayEnd = new Date(today.setHours(23, 59, 59, 999)).getTime(); // Akhir hari ini

        // Filter data hanya untuk hari ini
        const filteredData = res.filter((item: any) => {
          const itemDate = new Date(item.createdAt).getTime();
          return itemDate >= todayStart && itemDate <= todayEnd;
        });

        if (filteredData.length === 0) {
          console.log("Tidak ada antrian untuk hari ini.");
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

  return (
    <div className="w-full mx-auto min-h-screen bg-orange-500">
      <Navbar />
      <div className="container mx-auto flex flex-col gap-3 p-2 pt-12 tablet:p-20">
        <Link
          to="/"
          className="flex items-center gap-2 text-white hover:text-gray-800 mt-14 sm:mt-14"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-medium">Kembali</span>
        </Link>
        <h1 className="tablet:text-5xl tablet:mb-5 text-xl font-bold text-center text-white mt-12 tracking-widest">
          LIST ANTRIAN HARI INI SEMUA GERAI <FaMotorcycle className="inline" />
        </h1>
        {getCookiePelanggan.gerai ? (
          <a
            className="bg-orange-800 hover:bg-orange-600 w-fit px-4 py-1 text-white rounded-md text-xs tablet:text-lg self-center tablet:-mt-3 mb-3"
            href={`/#/antrian/${getCookiePelanggan.gerai.toLowerCase()}`}
          >
            Masuk Antrian Saya
          </a>
        ) : (
          <a
            className="bg-orange-800 hover:bg-orange-600 w-fit px-4 py-1 text-white rounded-md text-xs tablet:text-lg self-center tablet:-mt-3 mb-3"
            href="/#/scan"
          >
            Scan Sekarang
          </a>
        )}
        {data === undefined ? (
          <p className="text-center text-xl text-yellow-400 font-bold">
            loading...
          </p>
        ) : data.length === 0 ? (
          <p className="text-center text-xl text-yellow-400 font-bold">
            Tidak ada antrian hari ini.
          </p>
        ) : (
          data.map((row: any, index: number) => (
            <div className="bg-white rounded-lg shadow-xl p-2" key={index}>
              <h2 className="text-xl sm:text-2xl font-bold italic mb-2 tablet:mb-3">
                GERAI {row.gerai}
              </h2>
              <table className="w-full border-collapse border border-gray-500 mb-4 tablet:text-xl">
                <thead>
                  <tr className="bg-gray-100 text-sm tablet:text-xl">
                    <th className="border p-2">No</th>
                    <th className="border p-2">Nama</th>
                    <th className="border p-2">Motor</th>
                    <th className="border p-2">Jenis Motor</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {row.data
                    .sort((a: any, b: any) => a.waktu - b.waktu)
                    .map((item: any, index: number) => (
                      <tr
                        key={index}
                        className="font-semibold text-center text-sm tablet:text-lg"
                      >
                        <td className="border p-2">{index + 1}</td>
                        <td className="border p-2">
                          {item.nama.toUpperCase()}
                        </td>
                        <td className="border p-2">
                          {item.motor.toUpperCase()}
                        </td>
                        <td className="border p-2">
                          {item.subcategory.toUpperCase()}
                        </td>
                        <td className="border p-2">
                          {item.status ? (
                            <span className="flex items-center font-bold text-green-600 gap-1 justify-center">
                              <span className="bg-green-500 w-2 h-2 rounded-full" />
                              Finish
                            </span>
                          ) : (
                            <span className="flex items-center font-bold text-yellow-500 gap-1 justify-center">
                              <span className="bg-yellow-500 w-2 h-2 rounded-full" />
                              Progress
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
