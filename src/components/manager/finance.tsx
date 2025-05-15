import { useEffect, useState, useCallback } from "react";
import {
  getDailyTrend,
  getAllExpenses,
  getGerais,
  // getTotalPendapatan,
  getAntrianCustomer,
} from "@/utils/ggAPI";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronDown, ChevronUp, Download } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
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
  geraiId: number;
  amount: number;
  date: string;
  description?: string;
  expenseCategoryId?: number;
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

export default function FinanceCEO() {
  const navigate = useNavigate();
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalRevenueByGerai, setTotalRevenueByGerai] = useState<any>([]);
  const [totalRevenueFix, setTotalRevenueFix] = useState<any>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [geraiData, setGeraiData] = useState<GeraiData[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  // const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCostDetails, setShowCostDetails] = useState(false);
  const [additionalCosts, setAdditionalCosts] = useState<
    Record<
      string,
      {
        total: number;
        details: { amount: number; description: string; date: string }[];
      }
    >
  >({});
  const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
  const [gerais, setGerais] = useState<Gerai[]>([]);
  const [selectedGerai, setSelectedGerai] = useState<string | null>(null);
  const [cache, setCache] = useState<Map<string, any>>(new Map());

  useEffect(() => {
    async function fetchData() {
      let dataAntrianSemuaGerai = await getAntrianCustomer();
      setTotalRevenueFix(dataAntrianSemuaGerai);
      dataAntrianSemuaGerai = dataAntrianSemuaGerai.reduce(
        (acc: any, item: any) => {
          acc += item.harga_service;
          acc += item.harga_sparepart;
          return acc;
        },
        0
      );
      setTotalRevenue(dataAntrianSemuaGerai);
    }
    fetchData();
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
    if (!decoded) {
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

    if (validDecoded.role !== "CEO") {
      Swal.fire({
        icon: "warning",
        title: "Akses Ditolak",
        text: "Halaman ini hanya untuk CEO.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/dashboard", { replace: true }));
      return;
    }

    const fetchInitialData = async () => {
      try {
        const geraiList = await getGerais();
        setGerais(geraiList);
        setAdditionalCosts(
          geraiList.reduce(
            (acc, gerai) => ({
              ...acc,
              [gerai.name.toUpperCase()]: { total: 0, details: [] },
            }),
            {}
          )
        );
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
    async function fetchingData() {
      let dataExpenses = await getAllExpenses(
        undefined,
        "2025-04-24",
        formatDateForAPIStandard(new Date())
      );
      // let dataRevenue: any = await getTotalPendapatan(
      //   "2025-04-24",
      //   formatDateForAPIStandard(new Date())
      // );
      dataExpenses = dataExpenses.reduce((dataAwal: any, dataItem: any) => {
        dataAwal += dataItem.amount;
        return dataAwal;
      }, 0);
      setTotalExpenses(dataExpenses);
    }
    fetchingData();
  }, [navigate]);

  const fetchData = useCallback(async () => {
    if (!userRole || !gerais.length) return;
    const cacheKey = `${timeRange}-${userRole}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData && timeRange !== "day") {
      setGeraiData(cachedData.geraiData);
      setAdditionalCosts(cachedData.additionalCosts);
      setAllExpenses(cachedData.allExpenses);
      setLastUpdated(cachedData.lastUpdated);
      setLoading(false);
      console.log("Using cached data:", cachedData);
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
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
          startDate = new Date(2000, 0, 1); // Mulai dari tahun awal
          endDate.setHours(23, 59, 59, 999);
          break;
      }

      const formattedStartDate = formatDateForAPIStandard(startDate);
      const formattedEndDate = formatDateForAPIStandard(endDate);

      const [dailyTrendResponse, expensesResponse] = await Promise.all([
        fetchWithTimeout(
          getDailyTrend(formattedStartDate, formattedEndDate),
          5000
        ),
        fetchWithTimeout(
          getAllExpenses(undefined, formattedStartDate, formattedEndDate),
          5000
        ),
      ]);

      const dailyTrend = dailyTrendResponse.data || [];
      const expenses = expensesResponse.data || [];

      const processedRevenueData =
        dailyTrend.length > 0
          ? dailyTrend.map((item: any) => ({
              date: item.date,
              total: item.netRevenue || 0,
              gerai: item.gerai,
            }))
          : gerais.map((gerai) => ({
              date: formattedStartDate,
              total: 0,
              gerai: gerai.name,
            }));

      const expenseMap = new Map<
        string,
        {
          total: number;
          details: { amount: number; description: string; date: string }[];
        }
      >();
      expenses.forEach((expense: Expense) => {
        const geraiName =
          gerais.find((g: Gerai) => g.id === expense.geraiId)?.name ||
          "Unknown";
        if (!expenseMap.has(geraiName)) {
          expenseMap.set(geraiName, { total: 0, details: [] });
        }
        const entry = expenseMap.get(geraiName)!;
        entry.total += expense.amount;
        entry.details.push({
          amount: expense.amount,
          description: expense.description || "Tanpa deskripsi",
          date: expense.date.split("T")[0],
        });
      });

      const uniqueDates = [
        ...new Set(processedRevenueData.map((d: RevenueData) => d.date)),
      ].sort();
      const lastDate =
        uniqueDates[uniqueDates.length - 1] || formattedStartDate;
      const previousDate = uniqueDates[uniqueDates.length - 2];

      const geraiRevenueMap = new Map<string, number>();
      processedRevenueData.forEach((item: RevenueData) => {
        geraiRevenueMap.set(
          item.gerai,
          (geraiRevenueMap.get(item.gerai) || 0) + item.total
        );
      });

      const uniqueGeraiData: GeraiData[] = [...geraiRevenueMap].map(
        ([geraiName, totalRevenue]) => {
          const lastDayData = processedRevenueData.find(
            (d: RevenueData) => d.date === lastDate && d.gerai === geraiName
          );
          const previousDayData = processedRevenueData.find(
            (d: RevenueData) => d.date === previousDate && d.gerai === geraiName
          );

          return {
            name: geraiName,
            totalRevenue,
            lastDayRevenue: lastDayData?.total || 0,
            previousDayRevenue: previousDayData?.total || 0,
            percentageChange:
              previousDayData?.total && previousDayData.total > 0
                ? (((lastDayData?.total || 0) - previousDayData.total) /
                    previousDayData.total) *
                  100
                : (lastDayData?.total || 0) > 0
                ? 100
                : 0,
          };
        }
      );

      const totalNetRevenue = uniqueGeraiData.reduce(
        (sum, gerai) => sum + gerai.totalRevenue,
        0
      );
      const totalExpenseAmount = expenses.reduce(
        (sum: number, expense: Expense) => sum + expense.amount,
        0
      );

      const newAdditionalCosts = Object.fromEntries(
        gerais.map((gerai) => [
          gerai.name.toUpperCase(),
          expenseMap.get(gerai.name) || { total: 0, details: [] },
        ])
      );

      setRevenueData(processedRevenueData);
      setGeraiData(uniqueGeraiData);
      setAdditionalCosts(newAdditionalCosts);
      setAllExpenses(expenses);
      setLastUpdated(formatDateForDisplay(new Date()));

      if (timeRange !== "day") {
        setCache((prev) =>
          new Map(prev).set(cacheKey, {
            revenueData: processedRevenueData,
            totalRevenue: totalNetRevenue,
            totalExpenses: totalExpenseAmount,
            geraiData: uniqueGeraiData,
            additionalCosts: newAdditionalCosts,
            allExpenses: expenses,
            lastUpdated: formatDateForDisplay(new Date()),
          })
        );
      }
    } catch (error: any) {
      console.error("Fetching data failed:", error);
      // setErrorMessage(
      //   error.message === "Request timed out"
      //     ? "Server tidak merespons dalam waktu 5 detik."
      //     : "Gagal mengambil data dari server: " + error.message
      // );
      const formattedStartDate = formatDateForAPIStandard(new Date());
      const defaultRevenueData = gerais.map((gerai) => ({
        date: formattedStartDate,
        total: 0,
        gerai: gerai.name,
      }));
      const defaultGeraiData = gerais.map((gerai) => ({
        name: gerai.name,
        totalRevenue: 0,
        lastDayRevenue: 0,
        previousDayRevenue: 0,
        percentageChange: 0,
      }));
      setRevenueData(defaultRevenueData);
      setGeraiData(defaultGeraiData);
      setAdditionalCosts(
        gerais.reduce(
          (acc, gerai) => ({
            ...acc,
            [gerai.name.toUpperCase()]: { total: 0, details: [] },
          }),
          {}
        )
      );
      setAllExpenses([]);
      setLastUpdated(formatDateForDisplay(new Date()));
    } finally {
      setLoading(false);
    }
  }, [timeRange, userRole, gerais]);

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

  // const chartData = useMemo((): { labels: string[]; datasets: any[] } => {
  //   const uniqueDates = [
  //     ...new Set(revenueData.map((d: RevenueData) => d.date)),
  //   ].sort();
  //   const geraiNames = [
  //     ...new Set(revenueData.map((d: RevenueData) => d.gerai)),
  //   ];

  //   return {
  //     labels: uniqueDates,
  //     datasets: [
  //       ...geraiNames.map((geraiName) => {
  //         const dailyRevenue: Record<string, number> = revenueData
  //           .filter((data: RevenueData) => data.gerai === geraiName)
  //           .reduce((acc: Record<string, number>, data: RevenueData) => {
  //             acc[data.date] = (acc[data.date] || 0) + data.total;
  //             return acc;
  //           }, {});

  //         const revenueByDate = uniqueDates.map(
  //           (date) => dailyRevenue[date] || 0
  //         );

  //         return {
  //           label: geraiName,
  //           data: revenueByDate,
  //           backgroundColor: `rgba(${Math.floor(
  //             Math.random() * 255
  //           )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
  //             Math.random() * 255
  //           )}, 0.6)`,
  //           borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
  //             Math.random() * 255
  //           )}, ${Math.floor(Math.random() * 255)}, 1)`,
  //           borderWidth: 2,
  //         };
  //       }),
  //       {
  //         label: "Total Pengeluaran",
  //         data: uniqueDates.map((date) => {
  //           const dailyExpense = allExpenses
  //             .filter((expense) => expense.date.split("T")[0] === date)
  //             .reduce((sum, expense) => sum + expense.amount, 0);
  //           return dailyExpense;
  //         }),
  //         backgroundColor: "rgba(255, 99, 132, 0.6)",
  //         borderColor: "rgba(255, 99, 132, 1)",
  //         borderWidth: 2,
  //         borderDash: [5, 5],
  //       },
  //     ],
  //   };
  // }, [revenueData, allExpenses]);

  // const chartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: { display: true, position: "top" as const },
  //     tooltip: {
  //       callbacks: {
  //         label: (tooltipItem: TooltipItem<"line">) =>
  //           `${tooltipItem.dataset.label}: Rp ${Number(
  //             tooltipItem.raw
  //           ).toLocaleString("id-ID")} (${
  //             tooltipItem.dataset.label === "Total Pengeluaran"
  //               ? "Pengeluaran"
  //               : "Bersih"
  //           })`,
  //       },
  //     },
  //   },
  //   scales: {
  //     x: { title: { display: true, text: "Tanggal" } },
  //     y: {
  //       title: { display: true, text: "Nominal (Rp)" },
  //       ticks: {
  //         callback: (value: string | number) =>
  //           `Rp ${
  //             typeof value === "number" ? value.toLocaleString("id-ID") : value
  //           }`,
  //       },
  //     },
  //   },
  // };

  const handleExport = () => {
    const data = [
      ["Laporan Keuangan Semua Gerai", "", "", "", ""],
      [
        "Gerai",
        "Pendapatan Bersih",
        "Total Pengeluaran",
        "Detail Pengeluaran",
        "Perubahan Harian (%)",
      ],
      ...geraiData.map((gerai) => {
        const costDetails = additionalCosts[gerai.name.toUpperCase()];
        const detailsString = costDetails.details
          .map(
            (d) =>
              `${formatDateForDisplay(
                d.date,
                true
              )} - Rp ${d.amount.toLocaleString("id-ID")} - ${d.description}`
          )
          .join(", ");
        return [
          gerai.name,
          `Rp ${(gerai.totalRevenue || 0).toLocaleString("id-ID")}`,
          `Rp ${(costDetails.total || 0).toLocaleString("id-ID")}`,
          detailsString || "-",
          gerai.percentageChange !== undefined
            ? `${
                gerai.percentageChange >= 0 ? "+" : ""
              }${gerai.percentageChange.toFixed(2)}%`
            : "-",
        ];
      }),
      [
        "Total",
        `Rp ${totalRevenue.toLocaleString("id-ID")}`,
        `Rp ${totalExpenses.toLocaleString("id-ID")}`,
        "",
        "",
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Keuangan Gerai");
    XLSX.writeFile(wb, `Laporan_Keuangan_CEO_${timeRange}.xlsx`);
  };

  if (!userRole) return null;

  const uniqueDates = [
    ...new Set(revenueData.map((d: RevenueData) => d.date)),
  ].sort();
  const lastDate =
    uniqueDates[uniqueDates.length - 1] || formatDateForAPIStandard(new Date());
  const previousDate = uniqueDates[uniqueDates.length - 2];
  let overallPercentageChange: number | undefined;
  if (uniqueDates.length >= 2) {
    const totalLastDayRevenue = revenueData
      .filter((d: RevenueData) => d.date === lastDate)
      .reduce((sum, d: RevenueData) => sum + d.total, 0);
    const totalPreviousDayRevenue = revenueData
      .filter((d: RevenueData) => d.date === previousDate)
      .reduce((sum, d: RevenueData) => sum + d.total, 0);
    overallPercentageChange =
      totalPreviousDayRevenue > 0
        ? ((totalLastDayRevenue - totalPreviousDayRevenue) /
            totalPreviousDayRevenue) *
          100
        : totalLastDayRevenue > 0
        ? 100
        : 0;
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-slate-100 shadow-lg">
      <NavbarDashboard userRole={userRole} />
      <div className="flex flex-col justify-between mt-20">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">
            Finance Dashboard - Semua Gerai
          </h1>
          <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:space-x-4 w-full sm:w-auto justify-center">
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
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 flex items-center justify-center"
            >
              <Download className="mr-2" /> Export Laporan
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
            {/* {errorMessage && (
              <p className="text-center text-red-600 mt-4">{errorMessage}</p>
            )} */}
            <Card className="bg-gradient-to-r from-orange-500 to-yellow-600 mb-6 mt-4 sm:mt-6 rounded-xl shadow-md overflow-hidden">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                    <CardTitle className="text-white text-lg sm:text-xl font-semibold flex-1">
                      Total Keuangan - Semua Gerai
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {overallPercentageChange !== undefined && (
                        <Badge
                          className={`${
                            overallPercentageChange < 0
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          } px-2 py-1`}
                        >
                          {overallPercentageChange < 0 ? (
                            <FaArrowDown className="mr-1 w-3 h-3" />
                          ) : (
                            <FaArrowUp className="mr-1 w-3 h-3" />
                          )}
                          {Math.abs(overallPercentageChange).toFixed(2)}%
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        className="bg-white text-orange-600 border-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-colors duration-200 flex items-center gap-2 font-semibold text-sm"
                        onClick={() => setShowCostDetails(!showCostDetails)}
                      >
                        <span>Rincian Pengeluaran</span>
                        {showCostDetails ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="w-full flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <p className="text-white text-lg font-semibold">
                        Pendapatan Bersih
                      </p>
                      <p className="text-white text-2xl sm:text-3xl font-bold">
                        Rp {totalRevenue.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-lg font-semibold">
                        Total Pengeluaran
                      </p>
                      <p className="text-white text-2xl sm:text-3xl font-bold">
                        Rp {totalExpenses.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  {showCostDetails && (
                    <div className="mt-4 bg-white/10 rounded-lg p-4 text-white w-full">
                      <p className="font-semibold text-base mb-3">
                        Rincian Pengeluaran Per Gerai
                      </p>
                      <div className="space-y-4">
                        {Object.entries(additionalCosts).map(
                          ([geraiName, cost]) =>
                            cost.total > 0 ? (
                              <div key={geraiName}>
                                <p className="font-medium text-sm mb-2">
                                  {geraiName}
                                </p>
                                <ul className="text-sm space-y-2">
                                  {cost.details.map((detail, idx) => (
                                    <li
                                      key={idx}
                                      className="flex justify-between"
                                    >
                                      <span className="truncate">
                                        {formatDateForDisplay(
                                          detail.date,
                                          true
                                        )}{" "}
                                        - {detail.description}
                                      </span>
                                      <span>
                                        Rp{" "}
                                        {detail.amount.toLocaleString("id-ID")}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : null
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 text-white text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Terakhir Diperbarui: {lastUpdated}</span>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="mb-6">
              <CardHeader>
                <CardTitle>Tren Keuangan Harian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card> */}

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Detail Per Gerai</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Button
                    onClick={() => setSelectedGerai(null)}
                    className={`${
                      selectedGerai === null
                        ? "bg-orange-600 hover:bg-orange-700 text-white"
                        : "bg-white text-zinc-800 hover:bg-orange-300"
                    }`}
                  >
                    Semua Gerai
                  </Button>
                  {gerais.map((gerai) => (
                    <Button
                      key={gerai.id}
                      onClick={() => {
                        setSelectedGerai(gerai.name);
                        let revenueByGerai = totalRevenueFix
                          .filter((g: any) => g.gerai.toLowerCase() == gerai.name.toLowerCase())
                          .reduce((acc: any, item: any) => {
                            acc += item.harga_service;
                            acc += item.harga_sparepart;
                            return acc;
                          }, 0);
                          setTotalRevenueByGerai(revenueByGerai);
                      }}
                      className={`${
                        selectedGerai === gerai.name
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "bg-white text-zinc-800 hover:bg-orange-300"
                      }`}
                    >
                      {gerai.name}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(selectedGerai
                    ? geraiData.filter((g) => g.name === selectedGerai)
                    : geraiData
                  ).map((gerai) => (
                    <Card key={gerai.name}>
                      <CardHeader>
                        <CardTitle>{gerai.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Pendapatan Bersih: Rp{" "}
                          {totalRevenueByGerai.toLocaleString("id-ID")}
                        </p>
                        <p>
                          Total Pengeluaran: Rp{" "}
                          {totalExpenses.toLocaleString("id-ID")}
                        </p>
                        {additionalCosts[gerai.name.toUpperCase()]?.details
                          .length > 0 && (
                          <ul className="list-disc list-inside text-sm mt-2">
                            {allExpenses
                              .filter(
                                (expense) =>
                                  gerais
                                    .find((g) => g.id === expense.geraiId)
                                    ?.name.toUpperCase() ===
                                  gerai.name.toUpperCase()
                              )
                              .map((expense, idx) => (
                                <li key={idx}>
                                  {formatDateForDisplay(expense.date, true)} -
                                  Rp {expense.amount.toLocaleString("id-ID")} -{" "}
                                  {expense.description || "Tanpa deskripsi"}
                                </li>
                              ))}
                          </ul>
                        )}
                        {gerai.percentageChange !== undefined && (
                          <p
                            className={`flex items-center gap-1 mt-2 ${
                              gerai.percentageChange < 0
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {gerai.percentageChange < 0 ? (
                              <FaArrowDown />
                            ) : (
                              <FaArrowUp />
                            )}
                            Perubahan Harian:{" "}
                            {Math.abs(gerai.percentageChange).toFixed(2)}%
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
