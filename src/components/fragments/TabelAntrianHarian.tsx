import React from "react";

interface TabelAntrianHarianProps {
  data: any[];
}

const TabelAntrianHarian: React.FC<TabelAntrianHarianProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">Tidak ada data antrian.</p>
    );
  }
  console.log(data)

  return (
    <div className="mt-6">
      {data.map((item: any, index: number) => (
        <div key={index} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Gerai: {item.gerai}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 border-b">NO</th>
                  <th className="py-2 px-4 border-b">NAMA</th>
                  <th className="py-2 px-4 border-b">PLAT</th>
                  <th className="py-2 px-4 border-b">NO WA</th>
                  <th className="py-2 px-4 border-b">LAYANAN</th>
                  <th className="py-2 px-4 border-b">JENIS MOTOR</th>
                  <th className="py-2 px-4 border-b">BAGIAN MOTOR</th>
                  <th className="py-2 px-4 border-b">MOTOR</th>
                  <th className="py-2 px-4 border-b">TOTAL HARGA</th>
                  <th className="py-2 px-4 border-b">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {item.data.map((row: any, i: number) => {
                  // Validasi status
                  const validStatuses = ["PROGRESS", "FINISH", "CANCELED"];
                  const displayStatus = validStatuses.includes(row.status)
                    ? row.status
                    : "PROGRESS";

                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-center">
                        {i + 1}
                      </td>
                      <td className="py-2 px-4 border-b">{row.nama}</td>
                      <td className="py-2 px-4 border-b">{row.plat}</td>
                      <td className="py-2 px-4 border-b">{row.noWA}</td>
                      <td className="py-2 px-4 border-b">{row.layanan}</td>
                      <td className="py-2 px-4 border-b">{row.jenisMotor}</td>
                      <td className="py-2 px-4 border-b">{row.bagianMotor}</td>
                      <td className="py-2 px-4 border-b">{row.motor}</td>
                      <td className="py-2 px-4 border-b">
                        Rp {row.totalHarga.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2 px-4 border-b">{displayStatus}</td>
                    </tr>
<<<<<<< HEAD
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
=======
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
>>>>>>> 779958a45086e399c5e2a32852ec5007782f8021
    </div>
  );
};

export default TabelAntrianHarian;
