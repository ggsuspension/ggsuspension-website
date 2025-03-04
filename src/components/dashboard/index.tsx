import { DownloadIcon, LayoutDashboard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import TabelAntrianHarian from "../fragments/TabelAntrianHarian";
import { getDataLayananSemuaCabang } from "@/firebase/service";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import FinancePage from "../pages/FinancePage";


export default function Layout() {
  const [data, setData] = useState<any>(undefined);
  const url=window.location.hash;
  function getFormattedDate(date: Date) {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }
  const today = new Date();
  

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

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: "/admin",
    },
    // { name: "Users", icon: <Users className="h-4 w-4" />, path: "/users" },
    // {
    //   name: "Products",
    //   icon: <Package className="h-4 w-4" />,
    //   path: "/products",
    // },
    // {
    //   name: "Analytics",
    //   icon: <BarChart4 className="h-4 w-4" />,
    //   path: "/analytics",
    // },
    { name: "Finance", icon: <Wallet className="h-4 w-4" />, path: "/admin/finance" },
    // {
    //   name: "Settings",
    //   icon: <Settings className="h-4 w-4" />,
    //   path: "/settings",
    // },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-orange-500 border-b py-4 pl-7 flex items-center justify-between fixed w-full">
          <div className="flex items-center gap-4">
            <h2 className=" text-xl font-bold text-white flex gap-2 items-center">
              <img
                src="./LOGO%20REMAKE.png"
                className="w-8 p-1 bg-white rounded-full"
                alt=""
              />{" "}
              Dashboard Admin
            </h2>
          </div>
          <nav className="p-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors text-white"
            >
              {item.icon}
              <span className="text-white">{item.name}</span>
            </Link>
          ))}
        </nav>
        </header>
        <div className="flex items-center justify-center p-4 gap-4 mt-[8em]">
          <h1 className="text-2xl font-bold flex">Tabel Data Antrian {getFormattedDate(today)}</h1>
          <Button
            onClick={handleExport}
            className="w-fit text-xl bg-green-600 text-white"
            >
            Download <DownloadIcon />
          </Button>
        </div>
        {url=="#/admin"?<TabelAntrianHarian data={data && data} />:<FinancePage/>}
      </div>
    </div>
  );
}
