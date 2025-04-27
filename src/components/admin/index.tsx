import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAntrianByGeraiAndDate } from "@/utils/ggAPI";
import { getAuthToken, decodeToken, removeAuthToken } from "@/utils/auth";
import Swal from "sweetalert2";
import NavbarDashboard from "../fragments/NavbarDashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Definisi tipe untuk data antrian
interface Antrian {
  totalHarga: number;
  status: "PROGRESS" | "FINISHED" | "CANCELLED";
  gerai?: { id: number; name: string };
}

function getFormattedDate(date: Date): string {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`; // Format DD-MM-YY
}

export default function DashboardAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userGeraiId, setUserGeraiId] = useState<number | null>(null); // Ubah ke number | null
  const [userGeraiName, setUserGeraiName] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalAntrian: 0,
    progress: 0,
    finished: 0,
    cancelled: 0,
    pendapatanBersih: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Diperlukan",
        text: "Silakan login terlebih dahulu.",
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
        text: "Silakan login ulang.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/auth/login", { replace: true });
      });
      return;
    }

    setUserRole(decoded.role);
    setUserGeraiId(decoded.geraiId ? Number(decoded.geraiId) : null); // Konversi ke number
    setUserName(decoded.username || "Admin");
    setUserGeraiName(decoded.gerai?.name || "");
  }, [navigate]);

  useEffect(() => {
    if (userRole === "ADMIN" && userGeraiId) {
      fetchDailyData(getFormattedDate(new Date()));
    } else if (userRole === "ADMIN" && !userGeraiId) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Gerai Tidak Ditemukan",
        text: "Akun Anda tidak terkait dengan gerai. Silakan hubungi administrator.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }, [userRole, userGeraiId]);

  const fetchDailyData = async (date: string) => {
    try {
      setIsLoading(true);
      if (!userGeraiId) {
        throw new Error("ID gerai tidak ditemukan");
      }
      console.log("Fetching data with params:", { date, geraiId: userGeraiId });
      const rawData: Antrian[] = await getAntrianByGeraiAndDate(
        date,
        userGeraiId
      ); // Gunakan number
      console.log("Raw data harian dari API:", rawData);

      if (!Array.isArray(rawData) || rawData.length === 0) {
        setStats({
          totalAntrian: 0,
          progress: 0,
          finished: 0,
          cancelled: 0,
          pendapatanBersih: 0,
        });
        Swal.fire({
          icon: "info",
          title: "Tidak Ada Data",
          text: `Tidak ada antrian untuk gerai ini pada tanggal ${date}.`,
          timer: 2000,
          showConfirmButton: false,
        });
        setIsLoading(false);
        return;
      }

      const geraiName = rawData[0].gerai?.name || "";
      if (geraiName && !userGeraiName) {
        setUserGeraiName(geraiName);
      }

      const flatData = rawData.map((item) => ({
        totalHarga: item.totalHarga || 0,
        status: item.status || "PROGRESS",
      }));

      const stats = {
        totalAntrian: flatData.length,
        progress: flatData.filter((item) => item.status === "PROGRESS").length,
        finished: flatData.filter((item) => item.status === "FINISHED").length,
        cancelled: flatData.filter((item) => item.status === "CANCELLED")
          .length,
        pendapatanBersih: flatData
          .filter((item) => item.status === "FINISHED")
          .reduce((sum, item) => sum + (item.totalHarga || 0), 0),
      };
      console.log("Calculated stats:", stats);
      setStats(stats);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching daily data:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memuat Data",
        text: "Terjadi kesalahan saat mengambil data antrian. Silakan coba lagi.",
        timer: 2000,
        showConfirmButton: false,
      });
      setStats({
        totalAntrian: 0,
        progress: 0,
        finished: 0,
        cancelled: 0,
        pendapatanBersih: 0,
      });
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: ["Hari Ini"],
    datasets: [
      {
        label: "Total Antrian",
        data: [stats.totalAntrian],
        backgroundColor: "rgba(255, 87, 34, 0.7)", // Oranye
        borderColor: "rgba(255, 87, 34, 1)",
        borderWidth: 1,
        borderRadius: 5,
        barThickness: 40,
        yAxisID: "y-antrian",
      },
      {
        label: "Pendapatan Bersih (Rp)",
        data: [stats.pendapatanBersih],
        backgroundColor: "rgba(33, 150, 243, 0.7)", // Biru
        borderColor: "rgba(33, 150, 243, 1)",
        borderWidth: 1,
        borderRadius: 5,
        barThickness: 40,
        yAxisID: "y-pendapatan",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 14,
            weight: "bold" as const,
          },
          color: "#333",
          padding: 15,
        },
      },
      title: {
        display: true,
        text: "Statistik Harian: Antrian dan Pendapatan Bersih",
        font: {
          size: 20,
          weight: "bold" as const,
        },
        color: "#1a1a1a",
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            if (label === "Pendapatan Bersih (Rp)") {
              return `${label}: Rp ${value.toLocaleString("id-ID")}`;
            }
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      "y-antrian": {
        type: "linear" as const,
        position: "left" as const,
        beginAtZero: true,
        title: {
          display: true,
          text: "Jumlah Antrian",
          font: { size: 14, weight: "bold" as const },
          color: "#555",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#555",
          font: { size: 12 },
          stepSize: 1,
        },
      },
      "y-pendapatan": {
        type: "linear" as const,
        position: "right" as const,
        beginAtZero: true,
        title: {
          display: true,
          text: "Pendapatan Bersih (Rp)",
          font: { size: 14, weight: "bold" as const },
          color: "#555",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          callback: (value: any) => `Rp ${value.toLocaleString("id-ID")}`,
          color: "#555",
          font: { size: 12 },
        },
      },
      x: {
        title: {
          display: true,
          text: "Tanggal",
          font: { size: 14, weight: "bold" as const },
          color: "#555",
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "#555",
          font: { size: 12 },
        },
      },
    },
  };

  if (!userRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarDashboard userRole={userRole} />
      <div className="mt-[5rem] w-full px-6">
        {location.pathname === "/dashboard-admin" && (
          <>
            <h1 className="text-2xl flex justify-start font-semibold text-gray-800 mt-10">
              Selamat datang kembali, {userName} ({userGeraiName || "Memuat..."}
              )
            </h1>

            {/* Statistik Ringkas */}
            {userRole === "ADMIN" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-white p-4 rounded-md shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Total Antrian
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoading ? "Memuat..." : stats.totalAntrian}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-md shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Dalam Progres
                  </h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {isLoading ? "Memuat..." : stats.progress}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-md shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Selesai
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {isLoading ? "Memuat..." : stats.finished}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-md shadow-md">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Dibatalkan
                  </h3>
                  <p className="text-2xl font-bold text-red-600">
                    {isLoading ? "Memuat..." : stats.cancelled}
                  </p>
                </div>
              </div>
            )}

            {/* Grafik */}
            {userRole === "ADMIN" && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                <div style={{ height: "400px" }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
