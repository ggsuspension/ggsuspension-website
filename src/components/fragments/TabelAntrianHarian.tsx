import React from "react";

interface TabelAntrianHarianProps {
  data: any;
}

const TabelAntrianHarian: React.FC<TabelAntrianHarianProps> = ({ data }) => {
  const hasilObjectPerGerai = data.data.reduce(
    (dataAwal: any, dataAkhir: any) => {
      if (!dataAwal[dataAkhir.gerai])
        dataAwal[dataAkhir.gerai] = [dataAkhir];
      else
        dataAwal[dataAkhir.gerai] = [
          ...dataAwal[dataAkhir.gerai],
          dataAkhir,
        ];
      return dataAwal;
    },
    {}
  );

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">Tidak ada data antrian.</p>
    );
  }



  return (
    <div className="mt-6">
      {Object.keys(hasilObjectPerGerai).map((gerai: any, index: number) => (
        <div key={index} className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Gerai: {gerai}
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
                  <th className="py-2 px-4 border-b">BAGIAN MOTOR LAIN</th>
                  <th className="py-2 px-4 border-b">MOTOR</th>
                  <th className="py-2 px-4 border-b">SPAREPART</th>
                  <th className="py-2 px-4 border-b">HARGA LAYANAN</th>
                  <th className="py-2 px-4 border-b">HARGA SPAREPART</th>
                  <th className="py-2 px-4 border-b">TOTAL HARGA</th>
                  <th className="py-2 px-4 border-b">STATUS</th>
                </tr>
              </thead>
              {hasilObjectPerGerai[gerai].map(
                (item: any, indexArray: number) => (
                  <tbody key={indexArray}>
                    <tr className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-center">
                        {indexArray + 1}
                      </td>
                      <td className="py-2 px-4 border-b">{item.nama}</td>
                      <td className="py-2 px-4 border-b">{item.plat_motor}</td>
                      <td className="py-2 px-4 border-b">{item.noWA}</td>
                      <td className="py-2 px-4 border-b">{item.layanan}</td>
                      <td className="py-2 px-4 border-b">{item.jenis_motor}</td>
                      <td className="py-2 px-4 border-b">{item.bagian_motor}</td>
                      <td className="py-2 px-4 border-b">{item.bagian_motor2}</td>
                      <td className="py-2 px-4 border-b">{item.motor}</td>
                      <td className="py-2 px-4 border-b">{item.sparepart}</td>
                      <td className="py-2 px-4 border-b">
                        Rp {item.harga_service}
                      </td>
                      <td className="py-2 px-4 border-b">
                        Rp {item.harga_sparepart||0}
                      </td>
                      <td className="py-2 px-4 border-b">
                        Rp {item.harga_service +item.harga_sparepart}
                      </td>
                      <td className="py-2 px-4 border-b">{item.status}</td>
                    </tr>
                  </tbody>
                )
              )}
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabelAntrianHarian;
