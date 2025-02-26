import {
  LayoutDashboard,
  Users,
  Settings,
  Package,
  Wallet,
  BarChart4,
  ChevronLeft,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TabelAntrianHarian from "../fragments/TabelAntrianHarian";
import { getDataLayananSemuaCabang } from "@/firebase/service";
import * as XLSX from "xlsx";

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [data, setData] = useState<any>(undefined);
  const listGerai = [
    "BEKASI",
    "DEPOK",
    "TANGERANG",
    "CIKARANG",
    "JAKSEL",
    "BOGOR",
    "JAKTIM",
  ];

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

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      path: "/",
    },
    { name: "Users", icon: <Users className="h-4 w-4" />, path: "/users" },
    {
      name: "Products",
      icon: <Package className="h-4 w-4" />,
      path: "/products",
    },
    {
      name: "Analytics",
      icon: <BarChart4 className="h-4 w-4" />,
      path: "/analytics",
    },
    { name: "Finance", icon: <Wallet className="h-4 w-4" />, path: "/finance" },
    {
      name: "Settings",
      icon: <Settings className="h-4 w-4" />,
      path: "/settings",
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`bg-background border-r ${
          isCollapsed ? "w-[60px]" : "w-64"
        } transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <ChevronLeft className={`h-4 w-4 ${isCollapsed && "rotate-180"}`} />
          </Button>
        </div>

        <nav className="p-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 p-2 rounded hover:bg-muted transition-colors"
            >
              {item.icon}
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Dashboard Overview</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full h-8 w-8">
                  <span className="sr-only">User menu</span>
                  <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                    JD
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <Button onClick={handleExport} className="w-full bg-blue-500 text-white">
        Download Excel
      </Button>
        <TabelAntrianHarian data={data&&data}/>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
