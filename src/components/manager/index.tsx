import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken, decodeToken, removeAuthToken } from "@/utils/auth";
import { getDailyTrendAll, getAllExpensesAll, getGerais } from "@/utils/ggAPI";
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
import { FaWallet, FaFileInvoice } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardCEO() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalCleanIncome: 0,
    totalPengeluaran: 0,
  });
  const [chartData, setChartData] = useState<{
    labels: string[];
    grossRevenue: number[];
    netRevenue: number[];
    expenses: number[];
  }>({ labels: [], grossRevenue: [], netRevenue: [], expenses: [] });

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
      try {
        const now = new Date();
        const startDate = formatDateForAPIStandard(
          new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
        ); // 7 hari terakhir
        const endDate = formatDateForAPIStandard(now);

        // Ambil daftar gerai
        const geraiList = await getGerais();
        console.log("getGerais response:", geraiList);

        // Ambil data pengeluaran untuk stats
        const expensesResponse = await getAllExpensesAll(startDate, endDate);
        console.log("expensesResponse for stats:", expensesResponse);

        const totalPengeluaran = expensesResponse.data.reduce(
          (acc: number, gerai: { data: { amount: number }[] }) =>
            acc +
            gerai.data.reduce(
              (sum: number, item: { amount: number }) =>
                sum + (item.amount || 0),
              0
            ),
          0
        );

        // Ambil data pendapatan bersih untuk stats
        const dailyTrendResponse = await getDailyTrendAll(startDate, endDate);
        console.log("dailyTrendResponse for stats:", dailyTrendResponse);
        const totalCleanIncome = dailyTrendResponse.data.reduce(
          (acc: number, gerai: { data: { netRevenue: number }[] }) =>
            acc +
            gerai.data.reduce(
              (sum: number, item: { netRevenue: number }) =>
                sum + (item.netRevenue || 0),
              0
            ),
          0
        );

        // Pendapatan kotor = pendapatan bersih + pengeluaran
        const totalIncome = totalCleanIncome + totalPengeluaran;

        setStats({
          totalIncome,
          totalCleanIncome,
          totalPengeluaran,
        });

        // Ambil data untuk grafik
        await fetchChartData(startDate, endDate);
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

  const fetchChartData = async (
    startDate: string,
    endDate: string,
  ) => {
    try {
      // Ambil data pendapatan bersih dari dailyTrendAll
      const dailyTrendResponse = await getDailyTrendAll(startDate, endDate);
      console.log("dailyTrendResponse:", dailyTrendResponse);

      // Ambil data pengeluaran dari getAllExpensesAll
      const expensesResponse = await getAllExpensesAll(startDate, endDate);
      console.log("expensesResponse:", expensesResponse);

      // Buat daftar tanggal untuk sumbu X (7 hari terakhir)
      const labels: string[] = [];
      const grossRevenue: number[] = [];
      const netRevenue: number[] = [];
      const expenses: number[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(formatDateForAPIStandard(date));
      }

      // Inisialisasi data per tanggal
      labels.forEach(() => {
        grossRevenue.push(0);
        netRevenue.push(0);
        expenses.push(0);
      });

      // Proses pendapatan bersih dari dailyTrendAll
      dailyTrendResponse.data.forEach((gerai) => {
        gerai.data.forEach((item) => {
          const date = item.date.split("T")[0]; // Ambil YYYY-MM-DD
          const index = labels.indexOf(date);
          if (index !== -1) {
            netRevenue[index] += item.netRevenue || 0;
            console.log(
              `Adding netRevenue for ${date}: ${item.netRevenue} (gerai: ${gerai.gerai})`
            );
          }
        });
      });

      // Proses pengeluaran dari getAllExpensesAll
      expensesResponse.data.forEach(
        (gerai: {
          gerai_id: number;
          data: { date: string; amount: number }[];
        }) => {
          gerai.data.forEach((item) => {
            const date = item.date.split(" ")[0]; // Ambil YYYY-MM-DD dari "2025-05-21 00:00:00"
            const index = labels.indexOf(date);
            if (index !== -1) {
              expenses[index] += item.amount || 0;
              console.log(
                `Adding expense for ${date}: ${item.amount} (gerai_id: ${gerai.gerai_id})`
              );
            }
          });
        }
      );

      // Pendapatan kotor = pendapatan bersih + pengeluaran
      labels.forEach((_, index) => {
        grossRevenue[index] = netRevenue[index] + expenses[index];
      });

      console.log("Chart data before set:", {
        labels,
        grossRevenue,
        netRevenue,
        expenses,
      });
      setChartData({ labels, grossRevenue, netRevenue, expenses });
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartData({
        labels: Array(7).fill(""),
        grossRevenue: Array(7).fill(0),
        netRevenue: Array(7).fill(0),
        expenses: Array(7).fill(0),
      });
    }
  };

  const financialChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Pendapatan Kotor",
        data: chartData.grossRevenue,
        backgroundColor: "rgba(59, 130, 246, 0.6)", // Biru lembut
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Pendapatan Bersih",
        data: chartData.netRevenue,
        backgroundColor: "rgba(16, 185, 129, 0.6)", // Hijau lembut
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
      {
        label: "Pengeluaran",
        data: chartData.expenses,
        backgroundColor: "rgba(239, 68, 68, 0.6)", // Merah lembut
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Tren Keuangan Harian (Semua Gerai)" },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Jumlah (Rp)" },
        suggestedMax: 1000000,
      },
      x: { title: { display: true, text: "Tanggal" } },
    },
    barPercentage: 0.3,
    categoryPercentage: 0.9,
  };

  if (!userRole) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarDashboard userRole={userRole} />
      <main className="mt-20 px-6 flex-1">
        <h1 className="text-2xl font-semibold text-gray-800 mt-10">
          Selamat datang kembali, Pak {userName?.toUpperCase()}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-50 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-2">
              <FaWallet className="text-green-600 text-lg transform hover:scale-110 transition-transform duration-200" />
              <h3 className="text-sm font-medium text-gray-600">
                Total Pendapatan
              </h3>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold text-green-600">
                  Rp {stats.totalCleanIncome.toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-gray-500">
                  <s>Rp {stats.totalIncome.toLocaleString("id-ID")}</s>
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-50 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center space-x-2">
              <FaFileInvoice className="text-red-600 text-lg transform hover:scale-110 transition-transform duration-200" />
              <h3 className="text-sm font-medium text-gray-600">
                Total Pengeluaran
              </h3>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-red-600">
                Rp {stats.totalPengeluaran.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-50">
          <Bar data={financialChartData} options={chartOptions} />
        </div>
      </main>
    </div>
  );
}
