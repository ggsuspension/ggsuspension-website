import { setCancelNow, setFinishNow } from "@/firebase/service";
import React from "react";

const TabelAntrianHarian: React.FC<{ data: any }> = ({ data }) => {
  function handleFinishNow(data: any) {
    setFinishNow(data);
  }

  function handleCancel(id: string) {
    setCancelNow(id);
  }
  console.log(data)

  return (
    <div className="tablet:w-3/4 w-full mx-auto min-h-screen p-4 rounded-lg">
      <div className="flex flex-col gap-[5em]">
        {data ? (
          data.map((row: any, index: number) => (
            <div
              className="bg-white p-5 w-full self-center rounded-lg shadow-xl"
              key={index}
            >
              <h2 className="text-xl sm:text-2xl font-bold italic mb-4">
                GERAI {row.gerai}
              </h2>
              {/* Pembungkus untuk scroll horizontal jika diperlukan */}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="block md:table-header-group">
                    <tr className="bg-gray-50 font-light text-sm sm:text-lg block md:table-row">
                      <th className="border p-2 block md:table-cell">
                        Antrian
                      </th>
                      <th className="border p-2 block md:table-cell">Nama</th>
                      <th className="border p-2 block md:table-cell">Plat</th>
                      <th className="border p-2 block md:table-cell">No WA</th>
                      <th className="border p-2 block md:table-cell">
                        Layanan
                      </th>
                      <th className="border p-2 block md:table-cell">
                        Jenis Motor
                      </th>
                      <th className="border p-2 block md:table-cell">
                        Bagian Motor
                      </th>
                      <th className="border p-2 block md:table-cell">
                        Bagian Motor Lainnya
                      </th>
                      <th className="border p-2 block md:table-cell">Motor</th>
                      <th className="border p-2 block md:table-cell">Seal</th>
                      <th className="border p-2 block md:table-cell">
                        HargaLayanan
                      </th>
                      <th className="border p-2 block md:table-cell">
                        HargaSeal
                      </th>
                      <th className="border p-2 block md:table-cell">
                        Total Harga
                      </th>
                      <th className="border p-2 block md:table-cell">
                        Sudah Chat?
                      </th>
                      <th className="border p-2 block md:table-cell">
                        Sumber Informasi
                      </th>
                      <th className="border p-2 block md:table-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody className="block md:table-row-group">
                    {row.data
                      .sort((a: any, b: any) => a.waktu - b.waktu)
                      .map((item: any, i: number) => (
                        <tr
                          key={i}
                          className="bg-white border-b block md:table-row text-center relative"
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
                            data-label="Nama"
                          >
                            {item.plat.toUpperCase()}
                          </td>
                          <td
                            className="border p-2 block md:table-cell"
                            data-label="No WA"
                          >
                            {item.noWA.toUpperCase()}
                          </td>
                          <td
                            className="border p-2 block md:table-cell"
                            data-label="Layanan"
                          >
                            {item.layanan}
                          </td>
                          <td
                            className="border p-2 block md:table-cell"
                            data-label="Bagian Motor"
                          >
                            {item.jenisMotor.toUpperCase()}
                          </td>
                          <td
                            className="border p-2 block md:table-cell"
                            data-label="Bagian Motor"
                          >
                            {item.bagianMotor.toUpperCase()}
                          </td>
                          <td
                            className="border p-2 block md:table-cell"
                            data-label="Bagian Motor"
                          >
                            {item.bagianMotor2
                              ? item.bagianMotor2.toUpperCase()
                              : "-"}
                          </td>
                          <td
                            className="border p-2 block md:table-cell"
                            data-label="Motor"
                          >
                            {item.motor.toUpperCase()}
                          </td>
                          <td
                            className="border p-2 block md:table-cell"
                            data-label="Harga"
                          >
                            {item.seal == "false"
                              ? "-"
                              : item.seal.toUpperCase()}
                          </td>
                          <td
                            className="border p-2 block md:table-cell"
                            data-label="Harga"
                          >
                            {item.hargaLayanan}
                          </td>
                          <td
                            className="border p-2 block md:table-cell"
                            data-label="Harga"
                          >
                            {item.hargaSeal}
                          </td>
                          <td
                            className="border p-2 block md:table-cell w-fit"
                            data-label="Harga"
                          >
                            {item.totalHarga
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                          </td>
                          <td
                            className="border p-2 block md:table-cell w-fit"
                            data-label="Harga"
                          >
                            {item.info.toUpperCase()}
                          </td>
                          <td
                            className="border p-2 block md:table-cell w-fit"
                            data-label="Harga"
                          >
                            {item.sumber_info
                              ? item.sumber_info.toUpperCase()
                              : ""}
                          </td>
                          <td
                            className="border p-2 block md:table-cell"
                            data-label="Status"
                          >
                            {row.status == true ? (
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
                          {!row.status && (
                            <div className="flex items-center  absolute top-1/2 -translate-y-1/2 ml-2 gap-2">
                              <span
                                onClick={() => handleFinishNow(item)}
                                className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1 text-center cursor-pointer"
                              >
                                Finish
                              </span>
                              <span
                                onClick={() => handleCancel(item.id)}
                                className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1 text-center cursor-pointer"
                              >
                                Cancel
                              </span>
                            </div>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xl text-center text-yellow-500 font-bold">
            loading....
          </p>
        )}
      </div>
    </div>
  );
};

export default TabelAntrianHarian;
