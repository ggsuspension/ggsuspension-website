import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { getDataLayananSemuaCabang } from "@/firebase/service";

/**
 * TextToExcel component
 *
 * This component renders a table with input fields for adding data about customers.
 * The user can add new rows to the table by clicking the "Tambah Baris" button.
 * The user can download the data in Excel format by clicking the "Download Excel" button.
 *
 * @returns {JSX.Element}
 */
const TabelAntrianHarian: React.FC = () => {
  const [data, setData] = useState<any>(undefined);

  useEffect(() => {
    getDataLayananSemuaCabang().then((res) => {
      const result = listGerai.map(gerai => {
        const filteredData = res
          .filter(item => item.gerai === gerai)
          .map(item => item.data);
      
        return { gerai, data: filteredData };
      });
      setData(result); 
    });
  }, []);
  const handleExport = () => {
    const sheetData = data.flatMap((item: any) => [
      ["GERAI", item.gerai, ""], // Baris judul gerai
      ["ANTRIAN", "NAMA", "NAMA LAYANAN", "NAMA MOTOR"], // Header kolom
      ...item.data.map((row: any, i: number) => [
        i + 1,
        row.nama,
        row.layanan , // Pastikan tidak error jika layanan undefined
        row.motor,
      ]), 
      [""], // Baris kosong sebagai pemisah antar gerai
    ]);
    function getFormattedDate(date:Date) {
      const day = ("0" + date.getDate()).slice(-2);
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear().toString().slice(-2);
      return `${day}-${month}-${year}`;
    }
    
    const today = new Date();
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `data_antrian-${getFormattedDate(today)}.xlsx`);
  };
  const listGerai = [
    "BEKASI",
    "DEPOK",
    "TANGERANG",
    "CIKARANG",
    "JAKSEL",
    "BOGOR",
    "JAKTIM",
  ];

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
                        <td className="border p-2">{item.status}</td>
                      </tr>
                    </tbody>)}
                  </table>
              </div>
            ))}
        </div>
      <Button onClick={handleExport} className="w-full bg-blue-500 text-white">
        Download Excel
      </Button>
    </div>
  );
};

export default TabelAntrianHarian;
