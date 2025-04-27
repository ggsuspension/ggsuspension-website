import { useEffect, useState, useMemo } from "react";
import {
  getTotalPendapatan,
  getPendapatanPerGerai,
  formatDateForAPI,
} from "@/utils/ggAPI";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Clock } from "lucide-react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueData {
  date: string;
  total: number; // Pendapatan kotor
  netTotal: number; // Pendapatan bersih setelah biaya
  gerai: string;
}

interface GeraiData {
  name: string;
  totalRevenue: number; // Total pendapatan kotor
  netTotalRevenue: number; // Total pendapatan bersih
  lastDayRevenue?: number; // Kotor hari terakhir
  lastDayNetRevenue?: number; // Bersih hari terakhir
  previousDayRevenue?: number; // Kotor hari sebelumnya
  previousDayNetRevenue?: number; // Bersih hari sebelumnya
  percentageChange?: number; // Perubahan persentase berdasarkan bersih
}

// Biaya harian per orang dan jumlah orang per gerai (contoh statis)
const DAILY_COST_PER_PERSON: Record<string, number> = {
  BEKASI: 30000, // Rp 30.000 per orang per hari untuk Bekasi
  TANGERANG: 30000, // Default 0 untuk Tangerang sampai ada info
};

const PEOPLE_PER_GERAI: Record<string, number> = {
  BEKASI: 8, // Asumsi 1 orang untuk Bekasi, sesuaikan jika lebih
  TANGERANG: 5, // Asumsi 1 orang untuk Tangerang, sesuaikan jika lebih
};

// Hitung total biaya harian per gerai
const DAILY_COSTS: Record<string, number> = Object.fromEntries(
  Object.entries(DAILY_COST_PER_PERSON).map(([gerai, costPerPerson]) => [
    gerai,
    costPerPerson * (PEOPLE_PER_GERAI[gerai] || 1),
  ])
);

type TimeRange = "day" | "week" | "month" | "year" | "total";

export default function FinanceDashboard() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0); // Total bersih
  const [percentageChange, setPercentageChange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [geraiData, setGeraiData] = useState<GeraiData[]>([]);

  // const formatDateString = (date: string) => {
  //   return new Date(date).toLocaleDateString("id-ID", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "2-digit",
  //   });
  // };

  const chartData = useMemo(() => {
    const uniqueDates = Array.from(
      new Set(revenueData.map((data) => data.date))
    ).sort();
    const geraiNames = Array.from(
      new Set(revenueData.map((data) => data.gerai))
    );

    return {
      labels: uniqueDates,
      datasets: geraiNames.map((geraiName) => {
        const dailyRevenue = revenueData
          .filter((data) => data.gerai === geraiName)
          .reduce((acc, data) => {
            acc[data.date] = (acc[data.date] || 0) + data.netTotal; // Gunakan pendapatan bersih
            return acc;
          }, {} as Record<string, number>);

        const revenueByDate = uniqueDates.map(
          (date) => dailyRevenue[date] || 0
        );

        return {
          label: geraiName,
          data: revenueByDate,
          backgroundColor: `rgba(${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, 0.6)`,
          borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, 1)`,
          borderWidth: 2,
        };
      }),
    };
  }, [revenueData]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" as const },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<"line">) => {
            return `${tooltipItem.dataset.label}: Rp ${Number(
              tooltipItem.raw
            ).toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: { title: { display: true, text: "Tanggal" } },
      y: {
        title: { display: true, text: "Pendapatan Bersih (Rp)" },
        ticks: {
          callback: (value: string | number) =>
            `Rp ${typeof value === "number" ? value.toLocaleString() : value}`,
        },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const now = new Date("2025-03-23"); // Ganti dengan new Date() di produksi
        const endDate = new Date(now);
        const startDate = new Date(now);

        switch (timeRange) {
          case "day":
            startDate.setHours(0, 0, 0, 0);
            break;
          case "week":
            const dayOfWeek = startDate.getDay();
            startDate.setDate(
              startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
            );
            startDate.setHours(0, 0, 0, 0);
            break;
          case "month":
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            break;
          case "year":
            startDate.setMonth(0);
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            break;
          case "total":
            startDate.setFullYear(startDate.getFullYear() - 5);
            startDate.setMonth(0);
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            break;
          default:
            startDate.setFullYear(startDate.getFullYear() - 5);
            startDate.setMonth(0);
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            break;
        }

        const formattedStartDate = formatDateForAPI(startDate);
        const formattedEndDate = formatDateForAPI(endDate);

        console.log("Fetching data with:", {
          formattedStartDate,
          formattedEndDate,
        });

        const totalFromAPI = await getTotalPendapatan(
          formattedStartDate,
          formattedEndDate
        );
        console.log("Total from API (kotor):", totalFromAPI);

        const geraiDataFromAPI = await getPendapatanPerGerai(
          formattedStartDate,
          formattedEndDate
        );
        console.log("Gerai data from API:", geraiDataFromAPI);

        // Hitung pendapatan bersih dengan mengurangi biaya harian
        const dailyRevenueData: RevenueData[] = geraiDataFromAPI.data.map(
          (item) => {
            const dailyCost = DAILY_COSTS[item.gerai] || 0;
            const netTotal = Math.max(0, item.totalRevenue - dailyCost); // Pastikan tidak negatif
            return {
              date: item.date,
              total: item.totalRevenue, // Kotor
              netTotal, // Bersih
              gerai: item.gerai,
            };
          }
        );

        // Hitung total pendapatan dan perubahan harian
        const groupedGeraiData: Record<
          string,
          { total: number; netTotal: number }
        > = {};
        const lastDayRevenue: Record<
          string,
          { total: number; netTotal: number }
        > = {};
        const previousDayRevenue: Record<
          string,
          { total: number; netTotal: number }
        > = {};

        const uniqueDates = Array.from(
          new Set(dailyRevenueData.map((d) => d.date))
        ).sort();
        const lastDate = uniqueDates[uniqueDates.length - 1];
        const previousDate = uniqueDates[uniqueDates.length - 2];

        dailyRevenueData.forEach((item) => {
          groupedGeraiData[item.gerai] = groupedGeraiData[item.gerai] || {
            total: 0,
            netTotal: 0,
          };
          groupedGeraiData[item.gerai].total += item.total;
          groupedGeraiData[item.gerai].netTotal += item.netTotal;

          if (item.date === lastDate) {
            lastDayRevenue[item.gerai] = {
              total: item.total,
              netTotal: item.netTotal,
            };
          }
          if (item.date === previousDate) {
            previousDayRevenue[item.gerai] = {
              total: item.total,
              netTotal: item.netTotal,
            };
          }
        });

        const uniqueGeraiData: GeraiData[] = Object.entries(
          groupedGeraiData
        ).map(([name, { total, netTotal }]) => {
          const last = lastDayRevenue[name] || { total: 0, netTotal: 0 };
          const prev = previousDayRevenue[name] || { total: 0, netTotal: 0 };
          const change =
            prev.netTotal > 0
              ? ((last.netTotal - prev.netTotal) / prev.netTotal) * 100
              : 0;
          return {
            name,
            totalRevenue: total,
            netTotalRevenue: netTotal,
            lastDayRevenue: last.total,
            lastDayNetRevenue: last.netTotal,
            previousDayRevenue: prev.total,
            previousDayNetRevenue: prev.netTotal,
            percentageChange: change,
          };
        });

        const totalNetRevenue = uniqueGeraiData.reduce(
          (sum, gerai) => sum + gerai.netTotalRevenue,
          0
        );
        const previousTotalRevenue = totalRevenue || 0;
        const changePercentage =
          previousTotalRevenue > 0
            ? ((totalNetRevenue - previousTotalRevenue) /
                previousTotalRevenue) *
              100
            : 0;

        setTotalRevenue(totalNetRevenue);
        setPercentageChange(changePercentage);
        setRevenueData(dailyRevenueData);
        setLastUpdated(new Date().toLocaleString("id-ID"));
        setGeraiData(uniqueGeraiData);

        console.log("Updated state:", {
          totalRevenue: totalNetRevenue,
          geraiData: uniqueGeraiData,
          revenueData: dailyRevenueData,
        });
      } catch (error) {
        console.error("Fetching data failed:", error);
        setTotalRevenue(0);
        setGeraiData([]);
        setRevenueData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const GeraiCard = ({ gerai }: { gerai: GeraiData }) => {
    console.log("Rendering GeraiCard for:", gerai);
    const isDecrease =
      gerai.percentageChange !== undefined && gerai.percentageChange < 0;
    const isIncrease =
      gerai.percentageChange !== undefined && gerai.percentageChange > 0;

    return (
      <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-gray-800 text-xs font-semibold">
            {gerai.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600">Net Income</div>
          <div className="flex items-center space-x-2">
            <div className="text-xl sm:text-2xl font-bold text-gray-800">
              Rp {(gerai.netTotalRevenue || 0).toLocaleString("id-ID")}
            </div>
            {gerai.percentageChange !== undefined && (
              <Badge
                className={`${
                  isDecrease
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {isDecrease ? (
                  <FaArrowDown className="mr-1" />
                ) : isIncrease ? (
                  <FaArrowUp className="mr-1" />
                ) : null}
                {Math.abs(gerai.percentageChange).toFixed(2)}%
              </Badge>
            )}
          </div>
          {gerai.lastDayNetRevenue !== undefined && (
            <div className="text-xs text-gray-500 mt-1">
              Hari ini (bersih): Rp{" "}
              {(gerai.lastDayNetRevenue || 0).toLocaleString("id-ID")}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const handleExport = () => {
    const data = [
      ["Laporan Pendapatan Gerai", "", "", ""],
      [
        "Gerai",
        "Pendapatan Kotor",
        "Pendapatan Bersih",
        "Perubahan Harian (%)",
      ],
      ...geraiData.map((gerai) => [
        gerai.name,
        `Rp ${(gerai.totalRevenue || 0).toLocaleString("id-ID")}`,
        `Rp ${(gerai.netTotalRevenue || 0).toLocaleString("id-ID")}`,
        gerai.percentageChange !== undefined
          ? `${
              gerai.percentageChange >= 0 ? "+" : ""
            }${gerai.percentageChange.toFixed(2)}%`
          : "-",
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pendapatan Gerai");
    XLSX.writeFile(wb, "Laporan_Pendapatan_Gerai.xlsx");
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-slate-100 shadow-lg">
      <div className="flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Finance Dashboard</h1>
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
              onClick={() => setTimeRange("week")}
              className={`w-full sm:w-auto ${
                timeRange === "week"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-white text-zinc-800 hover:bg-orange-300"
              }`}
            >
              Minggu Ini
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
              GGSUSPENSION
            </h1>
          </div>
        ) : (
          <>
            <Card className="bg-gradient-to-r from-orange-500 to-yellow-600 mb-6 mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-white flex flex-col sm:flex-row items-center justify-between">
                  <span className="text-lg sm:text-xl mb-2 sm:mb-0">
                    Total Net Revenue
                  </span>
                  <Badge className="bg-white text-emerald-700 justify-end border-emerald-400/30">
                    <span
                      className={`${
                        percentageChange >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {percentageChange >= 0 ? (
                        <FaArrowUp className="text-green-500" />
                      ) : (
                        <FaArrowDown className="text-red-500" />
                      )}
                    </span>{" "}
                    {percentageChange >= 0
                      ? `+${percentageChange.toFixed(2)}%`
                      : `${percentageChange.toFixed(2)}%`}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  Rp {totalRevenue.toLocaleString("id-ID")}
                </div>
                <div className="flex items-center gap-2 mt-2 text-slate-100">
                  <Clock className="h-4 w-4 text-white" />
                  <span>Latest Updates: {lastUpdated}</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {geraiData.length > 0 ? (
                geraiData.map((gerai) => (
                  <GeraiCard key={gerai.name} gerai={gerai} />
                ))
              ) : (
                <p className="text-gray-600">Tidak ada data gerai tersedia.</p>
              )}
            </div>

            <div className="overflow-x-auto mt-4 sm:mt-6">
              <h1>Pendapatan Harian Bersih per Gerai</h1>
              <div className="min-w-[800px]">
                <Line data={chartData} options={chartOptions} height={400} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
