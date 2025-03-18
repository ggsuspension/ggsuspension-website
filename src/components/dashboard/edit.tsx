import { useEffect, useState } from "react";
import { Download, LayoutDashboard, Wallet } from "lucide-react";
import TabelAntrianHarianEdit from "../fragments/TabelAntrianHarianEdit";
import * as XLSX from "xlsx";
import FinancePage from "../pages/FinancePage";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/init";
import { Link, useLocation } from "react-router-dom";

// Fungsi untuk format tanggal ke DD-MM-YY
function getFormattedDate(date: Date): string {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
}

export default function EditAntrian() {
  const location = useLocation();
  const [data, setData] = useState<any>(undefined);
  const [geraiList, setGeraiList] = useState<string[]>([]);
  const [selectedGerai, setSelectedGerai] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0] // Default: YYYY-MM-DD
  );

  useEffect(() => {
    if (selectedDate) {
      fetchData(getFormattedDate(new Date(selectedDate)));
    }
  }, [selectedDate, selectedGerai]);

  const fetchData = async (date: string) => {
    try {
      const res = await getDocs(collection(firestore, `data-layanan-${date}`));
      const rawData = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const grouped = rawData.reduce((acc: Record<string, any>, cur: any) => {
        const key = cur.gerai;
        cur.data = { ...cur.data, id: cur.id };

        if (!acc[key]) {
          acc[key] = {
            id: cur.id,
            data: [cur.data],
            gerai: cur.gerai,
            status: cur.status,
          };
        } else {
          acc[key].data.push(cur.data);
        }

        return acc;
      }, {});

      const output = Object.values(grouped);
      setGeraiList([...new Set(output.map((item: any) => item.gerai))]);

      setData(
        selectedGerai
          ? output.filter((item: any) => item.gerai === selectedGerai)
          : output
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleExport = () => {
    if (!data) return;

    const formattedDate = getFormattedDate(new Date(selectedDate));
    const geraiName = selectedGerai
      ? selectedGerai.replace(/\s+/g, "_")
      : "Semua_Gerai";

    const sheetData = data.flatMap((item: any) => [
      ["GERAI", item.gerai, ""],
      [
        "NO",
        "NAMA",
        "PLAT",
        "NO WA",
        "LAYANAN",
        "JENIS MOTOR",
        "BAGIAN MOTOR",
        "BAGIAN MOTOR LAINNYA",
        "MOTOR",
        "SEAL",
        "HARGA LAYANAN",
        "HARGA SEAL",
        "TOTAL HARGA",
        "SUDAH CHAT?",
        "SUMBER INFORMASI",
        "STATUS",
      ],
      ...item.data.map((row: any, i: number) => [
        i + 1,
        row.nama,
        row.plat,
        row.noWA,
        row.layanan,
        row.jenisMotor,
        row.bagianMotor,
        row.bagianMotor2,
        row.motor,
        row.seal,
        row.hargaLayanan,
        row.hargaSeal,
        row.totalHarga,
        row.info.toUpperCase(),
        row.sumber_info.toUpperCase(),
        item.status,
      ]),
      [""],
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Penamaan file sesuai gerai dan tanggal
    const fileName = `data_antrian_${geraiName}_${formattedDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: "/admin",
    },
    {
      name: "Finance",
      icon: <Wallet className="h-4 w-4" />,
      path: "/admin/finance",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-orange-500 border-b py-4 px-6 flex items-center justify-between w-full fixed top-0 left-0 z-50">
        <div className="flex items-center gap-3">
          <img
            src="./LOGO%20REMAKE.png"
            className="w-10 h-10 bg-orange-500 shadow-lg"
            alt="Logo"
          />
          <h2 className="text-2xl font-bold text-white">Dashboard Admin</h2>
        </div>
        <nav className="flex gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-2 p-2 text-white hover:bg-orange-600 transition"
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </header>

      {/* Konten */}
      <div className="mt-[5rem] w-full px-6">
        {/* Tabel Data Antrian */}
        {location.pathname === "/admin/edit" && (
          <>
            <h1 className="text-xl flex justify-center font-semibold text-gray-800 mt-10">
              Tabel Data Antrian ({getFormattedDate(new Date(selectedDate))})
            </h1>
            <div className="flex gap-4 items-center mt-2 justify-center">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border p-2"
              />
              <select
                onChange={(e) => setSelectedGerai(e.target.value)}
                value={selectedGerai}
                className="border p-2"
              >
                <option value="">Semua Gerai</option>
                {geraiList.map((gerai) => (
                  <option key={gerai} value={gerai}>
                    {gerai}
                  </option>
                ))}
              </select>
              <button
                onClick={handleExport}
                className="flex items-center bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </button>
            </div>
            <TabelAntrianHarianEdit data={data} />
          </>
        )}
        {location.pathname === "/admin/finance" && <FinancePage />}
      </div>
    </div>
  );
}
