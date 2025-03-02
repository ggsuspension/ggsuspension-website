import { getDataLayananSemuaCabang } from "@/firebase/service";
import { useEffect, useState } from "react";

export default function AntrianSemuaGerai() {
  const [data, setData] = useState<any>(undefined);
  useEffect(() => {
    getDataLayananSemuaCabang().then((res: any) => {
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
    <div className="tablet:w-3/4 w-full mx-auto min-h-screen p-4 rounded-lg bg-orange-500">
    <div className="flex flex-col gap-[3em] p-2">
      {data &&
        data.map((row: any, index: number) => (
          <div
            className="bg-white rounded-lg shadow-xl p-2"
            key={index}
          >
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
                    row.data.map((item: any, index: number) => (
                      <tbody key={index}>
                        <tr className="font-semibold text-center text-sm tablet:text-lg">
                          <td className="border p-2">
                            {index+1}
                          </td>
                          <td className="border p-2">
                            {item.nama.toUpperCase()}
                          </td>
                          <td className="border p-2">
                            {item.motor.toUpperCase()}
                          </td>
                          <td className="border p-2">
                            {item.status ? (
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
                    <tbody ><tr><td className="self-center w-full font-bold">loading...</td></tr></tbody>
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
        ))}
    </div>
  </div>
  );
}
