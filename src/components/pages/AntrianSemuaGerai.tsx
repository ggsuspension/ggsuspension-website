import { getDataLayananSemuaCabang } from "@/firebase/service";
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
    getDataLayananSemuaCabang(null).then((res: any) => {
      const grouped = res.reduce((acc: any, cur: any) => {
        const key = cur.gerai;
        if (!acc[key]) {
          // Buat objek grup baru dengan struktur output yang diinginkan
          acc[key] = {
            id: cur.id, // ambil id dari item pertama di grup
            data: [cur.data], // masukkan data awal sebagai array
            gerai: cur.gerai, // ambil gerai dari item pertama
            status: cur.status, // ambil status dari item pertama
          };
        } else {
          // Jika grup sudah ada, cukup tambahkan data-nya ke array
          acc[key].data.push(cur.data);
        }
        return acc;
      }, {});
      const output = Object.values(grouped);
      setData(output);
    });
  }, []);

  return (
    <div className="w-full mx-auto min-h-screen bg-orange-500">
      {/* <NewNavigation/> */}
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
          LIST ANTRIAN SEMUA GERAI <FaMotorcycle className="inline" />
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
        {data ? (
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
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                {row ? (
                  row.data
                    .sort((a: any, b: any) => a.waktu - b.waktu)
                    .map((item: any, index: number) => (
                      <tbody key={index}>
                        <tr className="font-semibold text-center text-sm tablet:text-lg">
                          <td className="border p-2">{index + 1}</td>
                          <td className="border p-2">
                            {item.nama.toUpperCase()}
                          </td>
                          <td className="border p-2">
                            {item.motor.toUpperCase()}
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
                      </tbody>
                    ))
                ) : (
                  <tbody>
                    <tr>
                      <td className="self-center w-full font-bold">
                        loading...
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
              {/* Pembungkus untuk scroll horizontal jika diperlukan */}
              {/* <div className="overflow-x-auto">
              <div className="flex flex-col">
                <div className="block md:table-header-group">
                  
                </div>
                <div className="flex  md:table-row-group">
                  {row.data.map((item: any, i: number) => (
                    <tr
                      key={i}
                      className="bg-white border-b block md:table-row text-center"
                    >
                      <td
                        className="border p-2 text-center block md:table-cell"
                        data-label="Nomor"
                      >
                        {i + 1}
                      </td>
                      <td
                        className="border p-2 block md:table-cell"
                        data-label="Nama"
                      >
                        {item.nama.toUpperCase()}
                      </td>
                      <td
                        className="border p-2 block md:table-cell"
                        data-label="Layanan"
                      >
                        {item.layanan}
                      </td>
                      <td
                        className="border p-2 block md:table-cell"
                        data-label="Status"
                      >
                        {item.status==true ? (
                          <span className="flex items-center font-semibold text-green-600 gap-1 justify-center">
                            <span className="bg-green-500 w-5 h-5 rounded-full" />
                            FINISH
                          </span>
                        ) : (
                          <span className="flex items-center text-yellow-500 gap-1 font-semibold justify-center">
                            <span className="bg-yellow-500 w-5 h-5 rounded-full" />
                            PROGRESS
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </div>
              </div>
            </div> */}
            </div>
          ))
        ) : (
          <p className="text-center text-xl text-yellow-400 font-bold">
            loading...
          </p>
        )}
      </div>
    </div>
  );
}
