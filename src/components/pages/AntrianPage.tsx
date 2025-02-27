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
  let getCookiePelanggan: any = getCookie("pelangganGGSuspension");
  getCookiePelanggan = getCookiePelanggan ? JSON.parse(getCookiePelanggan) : "";

  useEffect(() => {
    getDataLayananSemuaCabang().then((res) => {
      const filteredData = res.filter(
        (item) => item.gerai.toLowerCase() == gerai
      );
      setData(filteredData);
    });
  }, []);
  const isSameId =
    data && data.filter((item: any) => item.id == getCookiePelanggan.id);

  return (
    <div className="flex flex-col min-h-screen bg-orange-500">
      {!isWantScan ? (
        <div className="flex flex-col bg-white w-3/4 mx-auto mt-12 p-2 rounded-xl relative">
          <h1 className="tablet:text-3xl text-2xl font-bold text-white bg-green-600 w-fit py-2 px-6 rounded-xl self-center">
            List Antrian
          </h1>
          {isSameId &&
            isSameId.length > 0 &&
            getCookiePelanggan.status == false && (
              <>
                <p
                  onClick={() => setIsWantScan(true)}
                  className="flex items-center gap-1 font-bold self-center text-xl absolute right-5"
                >
                  {" "}
                  SCAN <BsCamera />
                </p>
                <span className="flex items-center gap-1 font-bold self-center text-xl">
                  <p className="text-sm text-red-600">
                    Scan kalau motor sudah selesai
                  </p>
                </span>
              </>
            )}
          <div className="w-full rounded-lg">
            <div>
              <div>
                <h2 className="text-xl font-bold italic mt-3">
                  GERAI {gerai?.toUpperCase()}
                </h2>
                <table className="w-full border-collapse border border-gray-300 mb-4">
                  <thead>
                    <tr className="bg-orange-500 text-lg text-white">
                      <th className="border p-2">Nama</th>
                      <th className="border p-2">Motor</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  {data ? (
                    data.map((row: any, index: number) => (
                      <tbody key={index}>
                        <tr className="font-semibold">
                          <td className="border p-2">
                            {row.data.nama.toUpperCase()}
                          </td>
                          <td className="border p-2">
                            {row.data.motor.toUpperCase()}
                          </td>
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
                    ))
                  ) : (
                    <p className="self-center w-full font-bold">loading...</p>
                  )}
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
