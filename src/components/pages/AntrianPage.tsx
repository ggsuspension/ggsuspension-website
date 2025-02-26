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
const getCookiePelanggan = getCookie("dataPelanggan");

  useEffect(() => {
    getDataLayananSemuaCabang().then((res) => {
      const filteredData = res.filter(
        (item) => item.gerai.toLowerCase() == gerai
      );
      setData(filteredData);
    });
  }, []);

  return (
    <div>
      {!isWantScan ? (
        <div>
          <h1 className="text-3xl font-bold underline">Antrian</h1>
          {!getCookiePelanggan && <span
            onClick={() => setIsWantScan(true)}
            className="flex items-center gap-1 font-bold"
          >
            Scan <BsCamera />
          </span>}
          <div className="w-full p-4 bg-white rounded-lg">
            <h1 className="text-xl font-bold mb-4">Tabel Data Antrian</h1>
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
                <h2>GERAI</h2>
                <table className="w-full border-collapse border border-gray-300 mb-4">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Nomor</th>
                      <th className="border p-2">Nama</th>
                      <th className="border p-2">Nama Layanan</th>
                      <th className="border p-2">Nama Motor</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  {data &&
                    data.map((row: any, index: number) => (
                      <tbody key={index}>
                        <tr>
                          <td className="border p-2">{index + 1}</td>
                          <td className="border p-2">{row.data.nama}</td>
                          <td className="border p-2">{row.data.layanan}</td>
                          <td className="border p-2">{row.data.motor}</td>
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
