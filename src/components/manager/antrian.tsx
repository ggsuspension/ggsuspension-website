import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import TabelAntrianHarian from "../fragments/TabelAntrianHarian";
import * as XLSX from "xlsx";
import { useLocation, useNavigate } from "react-router-dom";
import { getAntrianByDateAndGerai } from "@/utils/ggAPI";
import { decodeToken, getAuthToken, removeAuthToken } from "@/utils/auth";
import Swal from "sweetalert2";
import NavbarDashboard from "../fragments/NavbarDashboard";

function getFormattedDate(date: Date): string {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
}

export default function LayoutManager() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<any[]>([]);
  const [geraiList, setGeraiList] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [selectedGerai, setSelectedGerai] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Diperlukan",
        text: "Silakan login terlebih dahulu untuk mengakses halaman ini.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/auth/login", { replace: true });
      });
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      removeAuthToken();
      Swal.fire({
        icon: "error",
        title: "Token Tidak Valid",
        text: "Token Anda tidak valid. Silakan login ulang.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/auth/login", { replace: true });
      });
      return;
    }

    setUserRole(decoded.role);
    if (decoded.role !== "CEO") {
      Swal.fire({
        icon: "warning",
        title: "Akses Ditolak",
        text: "Halaman ini hanya tersedia untuk CEO.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/ceo", { replace: true });
      });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (!userRole || userRole !== "CEO" || !selectedDate) {
      setData([]);
      setErrorMessage("Silakan pilih tanggal atau login sebagai CEO.");
      return;
    }

    fetchData(getFormattedDate(new Date(selectedDate)));
  }, [selectedDate, selectedGerai, userRole]);

  const fetchData = async (date: string) => {
    try {
      setData([]);
      setErrorMessage(null);

      const rawData = await getAntrianByDateAndGerai(date, selectedGerai);
      console.log("Raw data dari API:", rawData);

      if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
        setData([]);
        setErrorMessage(`Tidak ada data antrian untuk tanggal ${date}.`);
        return;
      }

      const filteredData = rawData.filter((item: any) => {
        const itemDate = new Date(item.waktu).toISOString().split("T")[0];
        const selectedDateISO = new Date(selectedDate)
          .toISOString()
          .split("T")[0];
        return itemDate === selectedDateISO;
      });

      console.log("Filtered data:", filteredData);

      if (filteredData.length === 0) {
        setData([]);
        setErrorMessage(`Tidak ada data antrian untuk tanggal ${date}.`);
        return;
      }

      const grouped = filteredData.reduce(
        (acc: Record<string, any>, cur: any) => {
          const key = cur.gerai || "Unknown Gerai";
          const dataItem = {
            id: cur.id,
            nama: cur.nama || "N/A",
            plat: cur.plat || "N/A",
            noWA: cur.noWA || "N/A",
            layanan: cur.details?.service || "N/A",
            jenisMotor: cur.details?.subcategory || "N/A",
            bagianMotor: cur.details?.motor?.motorPart?.bagianMotor || "N/A",
            bagianMotor2: "",
            motor: cur.details?.motor?.name || "N/A",
            seal:
              cur.details?.seals?.length > 0
                ? cur.details.seals[0].ccRange
                : cur.details?.seal
                ? "Yes"
                : "No",
            hargaLayanan: cur.details?.hargaLayanan || 0,
            hargaSeal: cur.details?.hargaSeal || 0,
            totalHarga: cur.totalHarga || 0,
            info: cur.info || "",
            sumber_info: cur.sumberInfo || "",
            waktu: cur.waktu || "N/A",
            status:
              cur.status === "FINISHED" ? "FINISH" : cur.status || "PROGRESS", // Normalisasi FINISHED ke FINISH
            gerai: cur.gerai || "N/A",
          };

          if (!acc[key]) {
            acc[key] = {
              id: cur.id,
              data: [dataItem],
              gerai: key,
              status:
                cur.status === "FINISHED" ? "FINISH" : cur.status || "PROGRESS",
            };
          } else {
            acc[key].data.push(dataItem);
          }
          return acc;
        },
        {}
      );

      const output = Object.values(grouped);
      console.log("Grouped data (sebelum dikirim ke tabel):", output);

      setGeraiList([...new Set(filteredData.map((item: any) => item.gerai))]);
      setData(
        selectedGerai
          ? output.filter((item: any) => item.gerai === selectedGerai)
          : output
      );
    } catch (error) {
      console.error("Error dalam fetchData:", error);
      setData([]);
      setErrorMessage("Gagal mengambil data antrian. Silakan coba lagi.");
    }
  };

  const handleExport = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Ada Data",
        text: "Tidak ada data untuk diekspor.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

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
        "TOTAL HARGA",
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
        `Rp ${row.totalHarga.toLocaleString("id-ID")}`,
        row.status,
      ]),
      [""],
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const fileName = `data_antrian_${geraiName}_${formattedDate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    console.log("Data berhasil diekspor ke:", fileName);
  };

  if (!userRole) {
    return null; // Tunggu autentikasi selesai
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarDashboard userRole={userRole} />
      <div className="mt-[6rem] w-full px-4 sm:px-6">
        {location.pathname === "/ceo-antrian" && (
          <>
            <h1 className="text-xl flex justify-center font-semibold text-gray-800">
              Tabel Data Antrian ({getFormattedDate(new Date(selectedDate))})
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 items-center mt-2 justify-center w-full max-w-3xl mx-auto">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto border p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <select
                onChange={(e) => setSelectedGerai(e.target.value)}
                value={selectedGerai}
                className="w-full sm:w-auto border p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                className="w-full sm:w-auto flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition shadow-md"
              >
                <Download className="w-5 h-5 mr-2" />
                Download
              </button>
            </div>
            {errorMessage ? (
              <p className="text-center text-red-600 mt-4">{errorMessage}</p>
            ) : data.length === 0 ? (
              <p className="text-center text-gray-600 mt-4">
                Tidak ada data untuk ditampilkan pada tanggal ini.
              </p>
            ) : (
              <TabelAntrianHarian data={data} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
