import React from "react";
const TabelAntrianHarian: React.FC<{ data: any }> = ({data}) => {

  return (
    <div className="w-full p-4 bg-white shadow-lg rounded-lg">
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
          {data &&
            data.map((row: any, index: number) => (
              <div key={index}>
                <h2>GERAI {row.gerai}</h2>
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
                    {row.data.map((item:any, i: number) =>
                    <tbody key={i}>
                      <tr>
                        <td className="border p-2">{i + 1}</td>
                        <td className="border p-2">{item.nama}</td>
                        <td className="border p-2">{item.layanan}</td>
                        <td className="border p-2">{item.motor}</td>
                        <td className="border p-2">{item.status?<span className="flex items-center font-bold text-green-600 gap-1"><span className="bg-green-500 w-5 h-5 rounded-full"/>Finish</span>:<span className="flex items-center font-bold text-yellow-500 gap-1"><span className="bg-yellow-500 w-5 h-5 rounded-full"/>Progress</span>}</td>
                      </tr>
                    </tbody>)}
                  </table>
              </div>
            ))}
        </div>
      
    </div>
  );
};

export default TabelAntrianHarian;
