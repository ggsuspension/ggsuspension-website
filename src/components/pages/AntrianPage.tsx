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
      const filteredData = res
        .filter((item) => item.gerai.toLowerCase() == gerai)
        .sort((a, b) => a.data.waktu - b.data.waktu);
      setData(filteredData);
    });
  }, []);
  const isSameId =
    data && data.filter((item: any) => item.id == getCookiePelanggan.id);

  return (
    <div className="flex flex-col min-h-screen bg-orange-500 px-4">
      {!isWantScan ? (
        <div className="flex flex-col tablet:w-5/6 tablet:p-4 bg-white mx-auto mt-12 rounded-xl p-2">
          <h1 className="tablet:text-3xl text-2xl font-bold text-white bg-green-600 w-fit py-2 px-6 rounded-xl self-center">
            List Antrian
          </h1>
          {isSameId &&
            isSameId.length > 0 &&
            getCookiePelanggan.status == false && (
              <>
                <p
                  onClick={() => setIsWantScan(true)}
                  className="flex items-center gap-1 font-bold self-center text-xl absolute right-5 top-3 tablet:right-[7em]"
                >
                  {" "}
                  SCAN FINISH <BsCamera />
                </p>
              </>
            )}
          <div className="w-full rounded-lg">
            <div>
              <div>
                <h2 className="text-xl font-bold italic mt-3 pl-3">
                  GERAI {gerai?.toUpperCase()}
                </h2>
                <table className="w-full border-collapse border border-gray-500 mb-4 tablet:text-xl">
                  <thead>
                    <tr className="bg-gray-100 text-lg tablet:text-xl">
                      <th className="border p-2">No</th>
                      <th className="border p-2">Nama</th>
                      <th className="border p-2">Motor</th>
                      <th className="border p-2">Status</th>
                    </tr>
                  </thead>
                  {data ? (
                    data.map((row: any, index: number) => (
                      <tbody key={index}>
                        <tr className="font-semibold text-center">
                          <td className="border p-2">{index + 1}</td>
                          <td className="border p-2">
                            {row.data.nama.toUpperCase()}
                          </td>
                          <td className="border p-2">
                            {row.data.motor.toUpperCase()}
                          </td>
                          <td className="border p-2">
                            {row.status ? (
                              <span className="flex items-center font-bold text-green-600 gap-1 justify-center">
                                <span className="bg-green-500 w-5 h-5 rounded-full" />
                                Finish
                              </span>
                            ) : (
                              <span className="flex items-center font-bold text-yellow-500 gap-1 justify-center">
                                <span className="bg-yellow-500 w-5 h-5 rounded-full" />
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
