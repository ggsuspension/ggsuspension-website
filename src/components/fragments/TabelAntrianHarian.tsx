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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabelAntrianHarian;
