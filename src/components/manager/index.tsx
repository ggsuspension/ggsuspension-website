import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken, decodeToken, removeAuthToken } from "@/utils/auth";
import {
  getTotalPendapatan,
  getAllExpenses,
  formatDateForAPI,
  getAntrianCustomer,
} from "@/utils/ggAPI";
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

function getWeekDays(): string[] {
  const today = new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toLocaleDateString("id-ID", { weekday: "long" }));
  }
  return days;
}

interface GeraiStats {
  gerai: string;
  income: number;
  pengeluaran: number;
}

export default function DashboardCEO() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalIncome: 0, totalPengeluaran: 0 });
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  const geraiData: Array<GeraiStats> = [];

  useEffect(() => {
    const initializeUser = () => {
      const token = getAuthToken();
      if (!token) {
        showSwalWarning(
          "Login Diperlukan",
          "Silakan login terlebih dahulu.",
          "/auth/login"
        );
        return;
      }

      const decoded = decodeToken(token);
      if (!decoded) {
        removeAuthToken();
        showSwalWarning(
          "Token Tidak Valid",
          "Silakan login ulang.",
          "/auth/login"
        );
        return;
      }

      setUserRole(decoded.role);
      setUserName(decoded.username || "CEO");

      if (decoded.role !== "CEO") {
        showSwalWarning(
          "Akses Ditolak",
          "Halaman ini hanya untuk CEO.",
          "/dashboard-admin"
        );
      }
    };

    initializeUser();
  }, [navigate]);

  const formatDateForAPIStandard = (date: Date): string => {
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (userRole !== "CEO") return;

    const fetchData = async () => {
      const now = new Date();
      let totalRevenue: any = await getAntrianCustomer();
      totalRevenue = totalRevenue.reduce((acc: any, item: any) => {
        acc += item.harga_service;
        acc += item.harga_sparepart;
        return acc;
      }, 0);
      await getAllExpenses(
        undefined,
        "2025-04-24",
        formatDateForAPIStandard(now)
      );
      console.log("totalRevenue = ", totalRevenue);
      setStats({
        totalIncome: totalRevenue,
        totalPengeluaran: 0,
      });
      try {
        await Promise.all([fetchWeeklyData()]);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Memuat Data",
          text: "Terjadi kesalahan saat memuat data. Silakan coba lagi.",
        });
      }
    };

    fetchData();
  }, [userRole]);

  const showSwalWarning = (title: string, text: string, redirectTo: string) => {
    Swal.fire({
      icon: "warning",
      title,
      text,
      timer: 1500,
      showConfirmButton: false,
    }).then(() => navigate(redirectTo, { replace: true }));
  };

  // const fetchDailyData = async () => {
  //   try {
  //     const today = formatDateForAPI(new Date());
  //     const res = await getTotalPendapatan("2025-04-26", "2025-04-26");
  //     console.log("HASILNYA", res);
  //     // const [totalIncome, expenses] = await Promise.all([
  //     //   getTotalPendapatan(today, today),
  //     //   getAllExpenses(undefined, today, today),
  //     // ]);

  //     // setStats({
  //     //   totalIncome,
  //     //   totalPengeluaran: expenses.total || 0,
  //     // });
  //   } catch (error) {
  //     console.error("Error fetching daily data:", error);
  //     setStats({ totalIncome: 0, totalPengeluaran: 0 });
  //   }
  // };

  const fetchWeeklyData = async () => {
    try {
      const today = new Date();
      const weekData: number[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formattedDate = formatDateForAPI(date);
        const dailyIncome = await getTotalPendapatan(
          formattedDate,
          formattedDate
        );
        weekData.push(dailyIncome);
      }
      setWeeklyData(weekData);
    } catch (error) {
      console.error("Error fetching weekly data:", error);
      setWeeklyData(Array(7).fill(0));
    }
  };

  // const fetchGeraiData = async (geraiList: Gerai[]) => {
  //   try {
  //     const today = formatDateForAPI(new Date());
  //     const [pendapatanResponse, expensesResponse] = await Promise.all([
  //       getPendapatanPerGerai(today, today),
  //       getAllExpenses(undefined, today, today),
  //     ]);

  //     const pendapatanData = pendapatanResponse.data || [];
  //     const expensesData = expensesResponse.data || [];

  //     const geraiStats: Record<
  //       string,
  //       { income: number; pengeluaran: number }
  //     > = {};
  //     geraiList.forEach((gerai) => {
  //       geraiStats[gerai.name] = { income: 0, pengeluaran: 0 };
  //     });

  //     pendapatanData.forEach(
  //       (item: { gerai: string; totalRevenue: number }) => {
  //         if (geraiStats[item.gerai]) {
  //           geraiStats[item.gerai].income = item.totalRevenue || 0;
  //         }
  //       }
  //     );

  //     expensesData.forEach((item: { geraiId: number; amount: number }) => {
  //       const gerai =
  //         geraiList.find((g) => g.id === item.geraiId)?.name || "Unknown Gerai";
  //       geraiStats[gerai] = geraiStats[gerai] || { income: 0, pengeluaran: 0 };
  //       geraiStats[gerai].pengeluaran += item.amount || 0;
  //     });

  //     const geraiArray = Object.entries(geraiStats).map(([gerai, data]) => ({
  //       gerai,
  //       income: data.income,
  //       pengeluaran: data.pengeluaran,
  //     }));

  //     setGeraiData(geraiArray);
  //   } catch (error) {
  //     console.error("Error fetching gerai data:", error);
  //     setGeraiData(
  //       geraiList.map((gerai) => ({
  //         gerai: gerai.name,
  //         income: 0,
  //         pengeluaran: 0,
  //       }))
  //     );
  //   }
  // };

  const weeklyChartData = {
    labels: getWeekDays(),
    datasets: [
      {
        label: "Total Income",
        data: weeklyData.length ? weeklyData : Array(7).fill(0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const geraiChartData = {
    labels: geraiData.map((item) => item.gerai),
    datasets: [
      {
        label: "Income",
        data: geraiData.map((item) => item.income),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Pengeluaran",
        data: geraiData.map((item) => item.pengeluaran),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Income Mingguan (Semua Gerai)" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Jumlah (Rp)" } },
    },
  };

  const geraiChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Income dan Pengeluaran per Gerai" },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Jumlah (Rp)" } },
    },
  };

  if (!userRole) return null;
  console.log("TOTAL HARGA", stats.totalIncome);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarDashboard userRole={userRole} />
      <main className="mt-20 px-6 flex-1">
        <h1 className="text-2xl font-semibold text-gray-800 mt-10">
          Selamat datang kembali, Pak {userName?.toUpperCase()}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Income
            </h3>
            <p className="text-2xl font-bold text-green-600">
              Rp {stats.totalIncome.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Pengeluaran
            </h3>
            <p className="text-2xl font-bold text-red-600">
              Rp {stats.totalPengeluaran.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <Bar data={weeklyChartData} options={chartOptions} />
        </div>

        {geraiData.length > 0 && (
          <>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <Bar data={geraiChartData} options={geraiChartOptions} />
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Income dan Pengeluaran per Gerai
              </h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 border-b">Gerai</th>
                    <th className="p-3 border-b">Income (Rp)</th>
                    <th className="p-3 border-b">Pengeluaran (Rp)</th>
                  </tr>
                </thead>
                <tbody>
                  {geraiData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">{item.gerai}</td>
                      <td className="p-3 text-green-600">
                        {item.income.toLocaleString("id-ID")}
                      </td>
                      <td className="p-3 text-red-600">
                        {item.pengeluaran.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
