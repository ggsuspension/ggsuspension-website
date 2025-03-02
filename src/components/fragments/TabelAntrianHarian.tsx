import React from "react";

const TabelAntrianHarian: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="tablet:w-3/4 w-full mx-auto min-h-screen p-4 rounded-lg">
      <div className="flex flex-col gap-[5em]">
        {data &&
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
                      <th className="border p-2 block md:table-cell">Antrian</th>
                      <th className="border p-2 block md:table-cell">Nama</th>
                      <th className="border p-2 block md:table-cell">No WA</th>
                      <th className="border p-2 block md:table-cell">
                        Layanan
                      </th>
                      <th className="border p-2 block md:table-cell">
                        Bagian Motor
                      </th>
                      <th className="border p-2 block md:table-cell">Motor</th>
                      <th className="border p-2 block md:table-cell">Seal</th>
                      <th className="border p-2 block md:table-cell">HargaLayanan</th>
                      <th className="border p-2 block md:table-cell">HargaSeal</th>
                      <th className="border p-2 block md:table-cell">Total Harga</th>
                      <th className="border p-2 block md:table-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody className="block md:table-row-group">
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
                          {item.bagianMotor.toUpperCase()}
                        </td>
                        <td
                          className="border p-2 block md:table-cell"
                          data-label="Motor"
                        >
                          {item.jenisMotor.toUpperCase()}
                        </td>
                        <td
                          className="border p-2 block md:table-cell"
                          data-label="Harga"
                        >
                          {item.seal=="false"?"-":item.seal}
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
                          className="border p-2 block md:table-cell"
                          data-label="Harga"
                        >
                          {item.totalHarga}
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
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TabelAntrianHarian;
