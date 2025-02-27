import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import TabelAntrianHarian from "../fragments/TabelAntrianHarian";
import { getDataLayananSemuaCabang } from "@/firebase/service";
import * as XLSX from "xlsx";
import { MdAdminPanelSettings } from "react-icons/md";

export default function Layout() {
  const [data, setData] = useState<any>(undefined);

  useEffect(() => {
    getDataLayananSemuaCabang().then((res: any) => {
      // Asumsi: res merupakan array data
      const groupKey = (item: any) => {
        return item.data.layanan.includes("REBOUND") ? "rebound" : "others";
      };
      const grouped = res.reduce((acc: any, cur: any) => {
        const key = groupKey(cur);
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

  const handleExport = () => {
    const sheetData = data.flatMap((item: any) => [
      ["GERAI", item.gerai, ""], // Baris judul gerai
      ["ANTRIAN", "NAMA", "NAMA LAYANAN", "NAMA MOTOR"], // Header kolom
      ...item.data.map((row: any, i: number) => [
        i + 1,
        row.nama,
        row.layanan,
        row.motor,
        row.bagianMotor,
        row.harga,
      ]),
      [""], // Baris kosong sebagai pemisah antar gerai
    ]);
    function getFormattedDate(date: Date) {
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

  // const menuItems = [
  //   {
  //     name: "Dashboard",
  //     icon: <LayoutDashboard className="h-4 w-4" />,
  //     path: "/",
  //   },
  //   { name: "Users", icon: <Users className="h-4 w-4" />, path: "/users" },
  //   {
  //     name: "Products",
  //     icon: <Package className="h-4 w-4" />,
  //     path: "/products",
  //   },
  //   {
  //     name: "Analytics",
  //     icon: <BarChart4 className="h-4 w-4" />,
  //     path: "/analytics",
  //   },
  //   { name: "Finance", icon: <Wallet className="h-4 w-4" />, path: "/finance" },
  //   {
  //     name: "Settings",
  //     icon: <Settings className="h-4 w-4" />,
  //     path: "/settings",
  //   },
  // ];

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-orange-500 border-b py-4 pl-7 flex items-center justify-between fixed w-full">
          <div className="flex items-center gap-4">
            <h2 className=" text-xl font-bold text-white flex gap-1 items-center">
              <MdAdminPanelSettings /> Dashboard Admin
            </h2>
          </div>
        </header>
        <div className="flex items-center justify-center p-4 gap-4 mt-[4em]">
          <h1 className="text-2xl font-bold flex">Tabel Data Antrian</h1>
          <Button
            onClick={handleExport}
            className="w-fit text-xl bg-green-600 text-white"
          >
            <DownloadIcon />
          </Button>
        </div>
        <TabelAntrianHarian data={data && data} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
