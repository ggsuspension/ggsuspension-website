import { useEffect, useState, useMemo, useCallback } from "react";
import {
  getDailyTrend,
  createExpense,
  getAllExpenses,
  getGerais,
  getDailyIncomeExpense,
} from "@/utils/ggAPI";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Download, RefreshCw } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import NavbarDashboard from "../fragments/NavbarDashboard";
import { getAuthToken, decodeToken, removeAuthToken } from "@/utils/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { DecodedToken, Gerai, GeraiData, RevenueData } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type TimeRange = "day" | "month" | "year" | "total";

interface Expense {
  id?: number;
  geraiId: number;
  amount: number;
  date: string;
  description?: string;
  category: string;
}

const formatDateForAPIStandard = (date: Date): string => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (
  date: Date | string,
  isBackendTime: boolean = false
): string => {
  const inputDate = typeof date === "string" ? new Date(date) : date;
  const displayDate = isBackendTime
    ? new Date(inputDate.getTime() + 7 * 60 * 60 * 1000)
    : inputDate;

  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const day = dayNames[displayDate.getDay()];
  const dateNum = displayDate.getDate();
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const month = monthNames[displayDate.getMonth()];
  const year = displayDate.getFullYear();
  const hours = ("0" + displayDate.getHours()).slice(-2);
  const minutes = ("0" + displayDate.getMinutes()).slice(-2);

  return `${day}, ${dateNum} ${month} ${year}, ${hours}:${minutes} WIB`;
};

const fetchWithTimeout = (promise: Promise<any>, timeoutMs: number) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeoutMs)
    ),
  ]);
};

const fetchWithRetry = async (promise: Promise<any>, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchWithTimeout(promise, 5000);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

export default function Finance() {
  const navigate = useNavigate();
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [dataBiaya, setDataBiaya] = useState<any>({
    totalPendapatan: 0,
    totalPengeluaran: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [geraiData, setGeraiData] = useState<GeraiData[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userGeraiId, setUserGeraiId] = useState<string | null>(null);
  const [userGeraiName, setUserGeraiName] = useState<string | null>(null);
  const [additionalCosts, setAdditionalCosts] = useState<
    Record<
      string,
      {
        total: number;
        details: { amount: number; description: string; date: string }[];
      }
    >
  >({});
  let [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [categoryCost, setCategoryCost] = useState<string>("");
  const [newCost, setNewCost] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [gerais, setGerais] = useState<Gerai[]>([]);

  function getStartOfMonthIsoString(dateInput: any) {
    const date: any = dateInput ? new Date(dateInput) : new Date();
    if (isNaN(date)) {
      throw new Error("Input tanggal tidak valid");
    }
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  }

  function setTimeToMidnight(isoString: string) {
    // Regex untuk memisahkan tanggal, waktu, dan zona waktu
    const match = isoString.match(
      /^(\d{4}-\d{2}-\d{2})(T\d{2}:\d{2}:\d{2}(\.\d+)?)?([+-]\d{2}:\d{2}|Z)?$/
    );
    if (match) {
      // Ambil bagian tanggal
      const date = match[1];
      // Ambil zona waktu jika ada, kosong jika tidak ada
      const timeZone = match[4] || "";
      // Gabungkan tanggal dengan waktu 00:00:00 dan zona waktu
      return `${date}T00:00:00${timeZone}`;
    } else {
      throw new Error("Format ISO string tidak valid");
    }
  }

  function getEndOfMonthIsoString(dateInput: any) {
    const date: any = dateInput ? new Date(dateInput) : new Date();
    if (isNaN(date)) {
      throw new Error("Input tanggal tidak valid");
    }
    // Pindah ke bulan berikutnya, set tanggal ke 0 untuk dapatkan tanggal terakhir bulan ini
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    // Atur waktu ke akhir hari
    date.setHours(23, 59, 59, 999);
    return date.toISOString();
  }

  function getStartOfYearIsoString(dateInput: any) {
    const date: any = dateInput ? new Date(dateInput) : new Date();
    if (isNaN(date)) {
      throw new Error("Input tanggal tidak valid");
    }
    date.setMonth(0); // Januari (0-based)
    date.setDate(1); // Tanggal 1
    date.setHours(0, 0, 0, 0); // Jam 00:00:00
    return date.toISOString();
  }

  // Akhir tahun (dengan waktu)
  function getEndOfYearIsoString(dateInput: any) {
    const date: any = dateInput ? new Date(dateInput) : new Date();
    if (isNaN(date)) {
      throw new Error("Input tanggal tidak valid");
    }
    date.setMonth(11); // Desember (0-based)
    date.setDate(31); // Tanggal 31
    date.setHours(23, 59, 59, 999); // Jam 23:59:59.999
    return date.toISOString();
  }

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Diperlukan",
        text: "Silakan login terlebih dahulu.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/auth/login", { replace: true }));
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded || !decoded.geraiId) {
      removeAuthToken();
      Swal.fire({
        icon: "error",
        title: "Token Tidak Valid",
        text: "Silakan login ulang.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/auth/login", { replace: true }));
      return;
    }

    const validDecoded: DecodedToken = decoded;
    setUserRole(validDecoded.role);
    setUserGeraiId(validDecoded.geraiId.toString());
    const fetchInitialData = async () => {
      try {
        const dailyIncomeExpense = await getDailyIncomeExpense(
          new Date().toISOString().split("T")[0],
          validDecoded.geraiId
        );
        setDataBiaya({
          ...dataBiaya,
          totalPendapatan: dailyIncomeExpense
            ? parseInt(dailyIncomeExpense.total_revenue.split(".")[0])
            : 0,
        });
        setDataBiaya({
          ...dataBiaya,
          totalPengeluaran: dailyIncomeExpense
            ? parseInt(dailyIncomeExpense.total_expenses.split(".")[0])
            : 0,
        });
        if (timeRange == "day") {
          const expenses = await getAllExpenses(
            validDecoded.geraiId,
            setTimeToMidnight(new Date().toISOString()),
            new Date().toISOString()
          );
          setAllExpenses(expenses);
        } else if (timeRange == "month") {
          const expenses = await getAllExpenses(
            validDecoded.geraiId,
            getStartOfMonthIsoString(new Date()),
            getEndOfMonthIsoString(new Date())
          );
          setAllExpenses(expenses);
        } else if (timeRange == "year") {
          const expenses = await getAllExpenses(
            validDecoded.geraiId,
            getStartOfYearIsoString(new Date()),
            getEndOfYearIsoString(new Date())
          );
          setAllExpenses(expenses);
        }
        const geraiList = await getGerais();
        setGerais(geraiList);
        const userGerai = geraiList.find(
          (g: Gerai) => g.id === validDecoded.geraiId
        );
        if (!userGerai) {
          throw new Error("Gerai pengguna tidak ditemukan.");
        }
        setUserGeraiName(userGerai.name);
        setAdditionalCosts({
          [userGerai.name.toUpperCase()]: { total: 0, details: [] },
        });
      } catch (error: any) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    fetchInitialData();
  }, [navigate, timeRange]);

  const fetchData = useCallback(async () => {
    if (!userRole || !gerais.length || !userGeraiId || !userGeraiName) {
      return;
    }

    setLoading(true);

    try {
      const now = new Date("2025-04-26T00:00:00.000Z");
      let startDate = new Date(now);
      let endDate = new Date(now);

      switch (timeRange) {
        case "day":
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "month":
          startDate.setDate(1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "year":
          startDate.setMonth(0, 1);
          startDate.setHours(0, 0, 0, 0);
          endDate = new Date(now.getFullYear(), 11, 31);
          endDate.setHours(23, 59, 59, 999);
          break;
        case "total":
          startDate = new Date(2000, 0, 1);
          endDate.setHours(23, 59, 59, 999);
          break;
      }

      const formattedStartDate = formatDateForAPIStandard(startDate);
      const formattedEndDate = formatDateForAPIStandard(endDate);

      const [dailyTrendResponse, expensesResponse] = await Promise.all([
        fetchWithRetry(
          getDailyTrend(
            formattedStartDate,
            formattedEndDate,
            Number(userGeraiId)
          )
        ),
        fetchWithRetry(
          getAllExpenses(
            Number(userGeraiId),
            formattedStartDate,
            formattedEndDate
          )
        ),
      ]);

      if (!expensesResponse || expensesResponse.status !== 200) {
        throw new Error(
          `Invalid expenses response: Status ${
            expensesResponse?.status || "undefined"
          }, Data: ${JSON.stringify(expensesResponse?.data)}`
        );
      }

      const dailyTrend = dailyTrendResponse.data || [];
      const expenses = Array.isArray(expensesResponse.data)
        ? expensesResponse.data.map((item: any) => ({
            id: item.id,
            geraiId: item.geraiId,
            amount: item.amount,
            date: item.date,
            description: item.description,
            expenseCategoryId: item.expenseCategoryId,
          }))
        : [];

      if (expenses.length === 0) {
        console.warn("No expenses returned from API. Parameters:", {
          geraiId: Number(userGeraiId),
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          token: getAuthToken() ? "[REDACTED]" : null,
        });
      }

      const processedRevenueData =
        dailyTrend.length > 0
          ? dailyTrend.map((item: any) => ({
              date: item.date,
              total: parseFloat(item.netRevenue) || 0,
              gerai: item.gerai || userGeraiName,
            }))
          : [
              {
                date: formattedStartDate,
                total: 0,
                gerai: userGeraiName,
              },
            ];

      const expenseTotal = expenses.reduce(
        (sum: number, expense: Expense) => sum + (expense.amount || 0),
        0
      );
      const expenseMap = {
        [userGeraiName.toUpperCase()]: {
          total: expenseTotal,
          details: expenses.map((expense: Expense) => ({
            amount: expense.amount || 0,
            description: expense.description || "Tanpa deskripsi",
            date: expense.date
              ? expense.date.split("T")[0]
              : formattedStartDate,
          })),
        },
      };

      const uniqueDates = [
        ...new Set(processedRevenueData.map((d: RevenueData) => d.date)),
      ].sort();
      const lastDate =
        uniqueDates[uniqueDates.length - 1] || formattedStartDate;
      const previousDate = uniqueDates[uniqueDates.length - 2];

      const totalRevenue = processedRevenueData.reduce(
        (sum: number, item: RevenueData) => sum + item.total,
        0
      );

      const geraiData: GeraiData[] = [
        {
          name: userGeraiName,
          totalRevenue,
          lastDayRevenue:
            processedRevenueData.find((d: RevenueData) => d.date === lastDate)
              ?.total || 0,
          previousDayRevenue: previousDate
            ? processedRevenueData.find(
                (d: RevenueData) => d.date === previousDate
              )?.total || 0
            : 0,
          percentageChange: previousDate
            ? (((processedRevenueData.find(
                (d: RevenueData) => d.date === lastDate
              )?.total || 0) -
                (processedRevenueData.find(
                  (d: RevenueData) => d.date === previousDate
                )?.total || 0)) /
                (processedRevenueData.find(
                  (d: RevenueData) => d.date === previousDate
                )?.total || 1)) *
              100
            : (processedRevenueData.find(
                (d: RevenueData) => d.date === lastDate
              )?.total || 0) > 0
            ? 100
            : 0,
        },
      ];

      setRevenueData(processedRevenueData);
      setGeraiData(geraiData);
      setAdditionalCosts(expenseMap);
      setLastUpdated(formatDateForDisplay(new Date()));
    } catch (error: any) {
      console.error("Fetching data failed:", {
        message: error.message,
        response: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : null,
      });
      let errorMsg = "Gagal mengambil data dari server: " + error.message;
      if (error.response) {
        errorMsg += ` (Status: ${error.response.status}, Data: ${JSON.stringify(
          error.response.data
        )})`;
      }
      const formattedStartDate = formatDateForAPIStandard(new Date());
      setRevenueData([
        {
          date: formattedStartDate,
          total: 0,
          gerai: userGeraiName || "Unknown",
        },
      ]);
      setGeraiData([
        {
          name: userGeraiName || "Unknown",
          totalRevenue: 0,
          lastDayRevenue: 0,
          previousDayRevenue: 0,
          percentageChange: 0,
        },
      ]);
      setAdditionalCosts({
        [userGeraiName?.toUpperCase() || "UNKNOWN"]: { total: 0, details: [] },
      });
      setLastUpdated(formatDateForDisplay(new Date()));
    } finally {
      setLoading(false);
    }
  }, [timeRange, userRole, userGeraiId, gerais, userGeraiName]);

  useEffect(() => {
    const initialFetch = setTimeout(() => fetchData(), 500);

    let intervalId: NodeJS.Timeout | null = null;
    if (timeRange === "day") {
      intervalId = setInterval(() => fetchData(), 60000);
    }

    return () => {
      clearTimeout(initialFetch);
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData, timeRange]);

  const chartData = useMemo((): { labels: string[]; datasets: any[] } => {
    const uniqueDates = [
      ...new Set(revenueData.map((d: RevenueData) => d.date)),
    ].sort();

    return {
      labels: uniqueDates,
      datasets: [
        {
          label: userGeraiName || "Gerai",
          data: uniqueDates.map(
            (date) =>
              revenueData.find((d: RevenueData) => d.date === date)?.total || 0
          ),
          backgroundColor: "rgba(255, 159, 64, 0.6)",
          borderColor: "rgba(255, 159, 64, 1)",
          borderWidth: 2,
        },
      ],
    };
  }, [revenueData, userGeraiName]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" as const },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"line">) =>
            `${tooltipItem.dataset.label}: Rp ${Number(
              tooltipItem.raw
            ).toLocaleString("id-ID", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })} (Bersih)`,
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Tanggal" } },
      y: {
        title: { display: true, text: "Pendapatan Bersih (Rp)" },
        ticks: {
          callback: (value: string | number) =>
            `Rp ${
              typeof value === "number"
                ? value.toLocaleString("id-ID", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : value
            }`,
        },
      },
    },
  };

  const handleExport = () => {
    const data = [
      ["Laporan Pendapatan dan Pengeluaran Gerai", "", "", "", ""],
      ["Gerai", userGeraiName],
      [
        "Total Pendapatan Bersih",
        `Rp ${dataBiaya.totalPendapatan.toLocaleString("id-ID")}`,
      ],
      [
        "Total Pengeluaran",
        `Rp ${additionalCosts[
          userGeraiName?.toUpperCase() || "UNKNOWN"
        ].total.toLocaleString("id-ID")}`,
      ],
      [],
      ["Daftar Pengeluaran"],
      ["Tanggal", "Kategori", "Deskripsi", "Jumlah"],
      ...allExpenses.map((expense) => [
        formatDateForDisplay(expense.date, true),
        expense.description || "Tanpa deskripsi",
        `Rp ${(expense.amount || 0).toLocaleString("id-ID")}`,
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Finance Report");
    XLSX.writeFile(wb, `Laporan_Finance_${userGeraiName}_${timeRange}.xlsx`);
  };

  const handleAddCost = async () => {
    if (!newCost || isNaN(Number(newCost)) || Number(newCost) <= 0) {
      Swal.fire({
        icon: "error",
        title: "Input Tidak Valid",
        text: "Masukkan nominal pengeluaran yang valid (lebih dari 0).",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    if (!newDescription.trim()) {
      Swal.fire({
        icon: "error",
        title: "Deskripsi Kosong",
        text: "Masukkan deskripsi pengeluaran.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    const costValue = Number(newCost);
    const currentDate = formatDateForAPIStandard(new Date());
    const data = {
      geraiId: Number(userGeraiId),
      category: categoryCost.toUpperCase(),
      amount: costValue,
      description: newDescription,
      date: currentDate,
    };

    try {
      await createExpense(data);

      setAdditionalCosts((prev) => {
        const updatedCosts = { ...prev };
        const geraiKey = userGeraiName?.toUpperCase() || "UNKNOWN";
        if (!updatedCosts[geraiKey]) {
          updatedCosts[geraiKey] = { total: 0, details: [] };
        }
        updatedCosts[geraiKey].total += costValue;
        updatedCosts[geraiKey].details.push({
          amount: costValue,
          description: newDescription,
          date: currentDate,
        });
        return updatedCosts;
      });

      setAllExpenses((prev) => [
        ...prev,
        {
          geraiId: Number(userGeraiId),
          amount: costValue,
          date: currentDate + "T00:00:00.000Z",
          description: newDescription,
          category: categoryCost.toUpperCase(),
        },
      ]);

      setRevenueData((prev) => {
        const existingToday = prev.find(
          (item) => item.date === currentDate && item.gerai === userGeraiName
        );
        if (existingToday) {
          return prev.map((item) =>
            item.date === currentDate && item.gerai === userGeraiName
              ? { ...item, total: item.total - costValue }
              : item
          );
        } else {
          return [
            ...prev,
            {
              date: currentDate,
              gerai: userGeraiName || "Unknown",
              total: -costValue,
            },
          ];
        }
      });

      setGeraiData((prev) =>
        prev.map((gerai) => {
          const lastDayRevenue = gerai.lastDayRevenue ?? 0;
          const previousDayRevenue = gerai.previousDayRevenue ?? 0;
          return {
            ...gerai,
            totalRevenue: gerai.totalRevenue - costValue,
            lastDayRevenue:
              currentDate === chartData.labels[chartData.labels.length - 1]
                ? lastDayRevenue - costValue
                : lastDayRevenue,
            percentageChange:
              previousDayRevenue > 0
                ? ((lastDayRevenue -
                    (currentDate ===
                    chartData.labels[chartData.labels.length - 1]
                      ? costValue
                      : 0) -
                    previousDayRevenue) /
                    previousDayRevenue) *
                  100
                : lastDayRevenue -
                    (currentDate ===
                    chartData.labels[chartData.labels.length - 1]
                      ? costValue
                      : 0) >
                  0
                ? 100
                : 0,
          };
        })
      );

      setNewCost("");
      setNewDescription("");
      setCategoryCost("");

      Swal.fire({
        icon: "success",
        title: "Pengeluaran Ditambahkan",
        text: `Pengeluaran sebesar Rp ${costValue.toLocaleString(
          "id-ID"
        )} untuk ${newDescription} telah ditambahkan.`,
        timer: 1500,
        showConfirmButton: false,
      });

      if (timeRange === "day") {
        fetchData();
      }
    } catch (error: any) {
      console.error("Error saat createExpense:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menambah Pengeluaran",
        text: error.message || "Terjadi kesalahan saat menambah pengeluaran.",
      });
    }
  };

  const ExpenseTable = () => {
    if (allExpenses.length === 0) {
      return (
        <p className="text-gray-500 text-center">
          Tidak ada pengeluaran untuk periode ini. Coba ubah rentang waktu atau
          tambah pengeluaran baru.
        </p>
      );
    }

    return (
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Tanggal
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Kategori
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Deskripsi
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            {allExpenses.map((expense, idx) => (
              <tr key={expense.id || idx} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                  {formatDateForDisplay(expense.date || new Date(), true)}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                  {expense.category || "Tanpa kategori"}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                  {expense.description || "Tanpa deskripsi"}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                  Rp{" "}
                  {(expense.amount || 0).toLocaleString("id-ID", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!userRole || !userGeraiId || !userGeraiName) return null;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-slate-100">
      <NavbarDashboard userRole={userRole} />
      <div className="flex flex-col max-w-7xl mx-auto mt-20 gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
          <h1 className="text-2xl font-bold sm:text-xl mb-4 sm:mb-0 text-gray-800">
            Finance - {userGeraiName}
          </h1>
          <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:gap-4 w-full sm:w-auto justify-center">
            <Button
              onClick={() => setTimeRange("day")}
              className={`w-full sm:w-auto ${
                timeRange === "day"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-white text-zinc-800 hover:bg-orange-300"
              }`}
            >
              Hari Ini
            </Button>
            <Button
              onClick={() => setTimeRange("month")}
              className={`w-full sm:w-auto ${
                timeRange === "month"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-white text-zinc-800 hover:bg-orange-300"
              }`}
            >
              Bulan Ini
            </Button>
            <Button
              onClick={() => setTimeRange("year")}
              className={`w-full sm:w-auto ${
                timeRange === "year"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-white text-zinc-800 hover:bg-orange-300"
              }`}
            >
              Tahun Ini
            </Button>
            <Button
              onClick={() => setTimeRange("total")}
              className={`w-full sm:w-auto ${
                timeRange === "total"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-white text-zinc-800 hover:bg-orange-300"
              }`}
            >
              Total
            </Button>
            <Button
              onClick={handleExport}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center"
            >
              <Download className="mr-2 h-4 w-4" /> Export Laporan
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-50">
            <Clock className="animate-spin w-16 h-16 text-orange-600 mb-2" />
            <h1 className="font-semibold text-xl text-orange-600">
              Memuat Data...
            </h1>
            <p className="text-gray-600">
              Harap tunggu, ini mungkin memakan waktu.
            </p>
          </div>
        ) : (
          <>
            <Card className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-xl shadow-md">
              <CardHeader className="p-4 sm:p-5">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <CardTitle className="text-white text-lg sm:text-xl font-semibold">
                      Total Pendapatan Bersih - {userGeraiName}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {geraiData[0]?.percentageChange !== undefined && (
                        <Badge
                          className={`${
                            geraiData[0].percentageChange < 0
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          } px-2 py-1 text-xs`}
                        >
                          {geraiData[0].percentageChange < 0 ? (
                            <FaArrowDown className="mr-1 w-3 h-3" />
                          ) : (
                            <FaArrowUp className="mr-1 w-3 h-3" />
                          )}
                          {Math.abs(geraiData[0].percentageChange).toFixed(2)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-white text-2xl sm:text-3xl font-bold">
                    Rp{" "}
                    {(
                      dataBiaya.totalPendapatan - dataBiaya.totalPengeluaran ||
                      0
                    ).toLocaleString("id-ID", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-2 text-white text-sm flex-wrap">
                  <Clock className="h-4 w-4" />
                  <span>Terakhir Diperbarui: {lastUpdated}</span>
                  <Button
                    onClick={() => {
                      fetchData();
                    }}
                    className="ml-3 bg-white text-orange-600 hover:bg-gray-100 text-xs py-1 px-2 h-7 flex items-center"
                  >
                    <RefreshCw className="mr-1 h-3 w-3" /> Muat Ulang
                  </Button>
                </div>
              </CardContent>
            </Card>

            {userRole !== "CEO" && (
              <Card className="bg-white rounded-xl shadow-sm">
                <CardHeader className="p-4 sm:p-5">
                  <CardTitle className="text-lg text-gray-800">
                    Tambah Pengeluaran
                  </CardTitle>
                </CardHeader>
                <CardContent className="">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      required
                      type="text"
                      value={categoryCost}
                      onChange={(e) => setCategoryCost(e.target.value)}
                      placeholder="Kategori Pengeluaran"
                      className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:ring-orange-500 focus:border-orange-500"
                    />
                    {/* <select
                      value={selectedCategoryId || ""}
                      onChange={(e) =>
                        setSelectedCategoryId(Number(e.target.value))
                      }
                      className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:ring-orange-500 focus:border-orange-500"
                    >
                      {expenseCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select> */}
                    <input
                      required
                      type="number"
                      value={newCost}
                      onChange={(e) => setNewCost(e.target.value)}
                      placeholder="Nominal pengeluaran"
                      className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:ring-orange-500 focus:border-orange-500"
                      min="0"
                    />
                    <input
                      required
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Deskripsi pengeluaran"
                      className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md text-sm text-gray-600 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <Button
                      onClick={handleAddCost}
                      className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white text-sm py-2 px-4"
                    >
                      Tambah
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white rounded-xl shadow-sm">
              <CardHeader className="p-4 sm:p-5">
                <CardTitle className="text-lg text-gray-800">
                  Daftar Pengeluaran - {userGeraiName}
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <ExpenseTable />
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm">
              <CardHeader className="p-4 sm:p-5">
                <CardTitle className="text-lg text-gray-800">
                  Tren Pendapatan Harian - {userGeraiName}
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <div className="h-[400px]">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-xl shadow-sm">
              <CardHeader className="p-4 sm:p-5">
                <CardTitle className="text-lg text-gray-800">
                  Ringkasan - {userGeraiName}
                </CardTitle>
              </CardHeader>
              <CardContent className="">
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Pendapatan Bersih:{" "}
                    <span className="font-semibold text-gray-800">
                      Rp {dataBiaya.totalPendapatan.toLocaleString("id-ID")}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Pengeluaran:{" "}
                    <span className="font-semibold text-gray-800">
                      Rp {dataBiaya.totalPengeluaran.toLocaleString("id-ID")}
                    </span>
                  </p>
                  {geraiData[0]?.percentageChange !== undefined && (
                    <p
                      className={`flex items-center gap-1 text-sm ${
                        geraiData[0].percentageChange < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {geraiData[0].percentageChange < 0 ? (
                        <FaArrowDown className="h-4 w-4" />
                      ) : (
                        <FaArrowUp className="h-4 w-4" />
                      )}
                      Perubahan Harian:{" "}
                      {Math.abs(geraiData[0].percentageChange).toFixed(2)}%
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
