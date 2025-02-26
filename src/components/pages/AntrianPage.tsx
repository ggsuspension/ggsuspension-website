import { getDataLayananSemuaCabang } from "@/firebase/service";
import { useEffect, useState } from "react";
import { BsCamera } from "react-icons/bs";
import { useParams } from "react-router-dom";
import QRScanner from "../fragments/ScanQR";
import { getCookie } from "@/utils/getCookie";

export default function AntrianPage() {
  const [data, setData] = useState<any>(undefined);
  const gerai = useParams().gerai;
  const [isWantScan, setIsWantScan] = useState(false);
let getCookiePelanggan:any = getCookie("pelangganGGSuspension");
getCookiePelanggan = getCookiePelanggan ? JSON.parse(getCookiePelanggan) : "";

  useEffect(() => {
    getDataLayananSemuaCabang().then((res) => {
      const filteredData = res.filter(
        (item) => item.gerai.toLowerCase() == gerai
      );
      setData(filteredData);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-orange-500">
      {!isWantScan ? (
        <div className="flex flex-col bg-white w-3/4 mx-auto mt-12 p-5 rounded-xl">
          <h1 className="text-3xl font-bold text-white bg-green-600 w-fit py-2 px-6 rounded-xl self-center">List Antrian</h1>
          {getCookiePelanggan.status==false&& <span
            onClick={() => setIsWantScan(true)}
            className="flex items-center gap-1 font-bold"
          >
            Scan <BsCamera />
          </span>}
          <div className="w-full p-4 rounded-lg">
            {/* <select onClick={(e: any) => setGerai(e.target.value)} name="" id="">
        <option value="">Pilih Gerai</option>
        <option value="BEKASI">BEKASI</option>
        <option value="DEPOK">DEPOK</option>
        <option value="TANGERANG">TANGERANG</option>
        <option value="CIKARANG">CIKARANG</option>
        <option value="JAKSEL">JAKSEL</option>
        <option value="BOGOR">BOGOR</option>
        <option value="JAKTIM">JAKTIM</option>
      </select> */}
            <div>
              <div>
                <h2 className="text-2xl font-bold text-green-700">GERAI {gerai?.toUpperCase()}</h2>
                <table className="w-full border-collapse border border-gray-300 mb-4">
                  <thead>
                    <tr className="bg-orange-400 text-xl">
                      <th className="border p-2">Nomor</th>
                      <th className="border p-2">Nama</th>
                      <th className="border p-2">Layanan</th>
                      <th className="border p-2">Motor</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  {data &&
                    data.map((row: any, index: number) => (
                      <tbody key={index}>
                        <tr className="font-semibold">
                          <td className="border text-center">{index + 1}</td>
                          <td className="border p-2">{row.data.nama.toUpperCase()}</td>
                          <td className="border p-2">{row.data.layanan}</td>
                          <td className="border p-2">{row.data.motor.toUpperCase()}</td>
                          <td className="border p-2">
                            {row.status ? (
                              <span className="flex items-center font-bold text-green-600 gap-1">
                                <span className="bg-green-500 w-5 h-5 rounded-full" />
                                Finish
                              </span>
                            ) : (
                              <span className="flex items-center font-bold text-yellow-500 gap-1">
                                <span className="bg-yellow-500 w-5 h-5 rounded-full" />
                                Progress
                              </span>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <QRScanner />
      )}
    </div>
  );
}
