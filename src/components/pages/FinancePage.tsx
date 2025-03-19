import { useEffect, useState, useMemo } from "react";
import { getGeraiStatistics } from "@/firebase/service";
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
import * as XLSX from "xlsx"; // Import XLSX library
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
  total: number;
  gerai: string;
}

interface GeraiData {
  name: string;
  totalPendapatan: number;
}

type TimeRange = "day" | "week" | "month" | "year" | "total";

export default function FinanceDashboard() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("");
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [geraiData, setGeraiData] = useState<GeraiData[]>([]);

  const formatDateString = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const groupRevenueByGerai = (revenueData: RevenueData[]) => {
    const groupedData: Record<string, number> = {};

    revenueData.forEach((data) => {
      if (!groupedData[data.gerai]) {
        groupedData[data.gerai] = 0;
      }
      groupedData[data.gerai] += data.total; // Jumlahkan total pendapatan
    });

    return groupedData;
  };

  // const getAllGeraiNames = (revenueData: RevenueData[]) => {
  //   return Array.from(new Set(revenueData.map((data) => data.gerai)));
  // };

  const getDailyRevenueByGerai = (
    revenueData: RevenueData[],
    geraiName: string
  ) => {
    return revenueData
      .filter((data) => data.gerai === geraiName) // Filter data berdasarkan nama gerai
      .reduce((acc, data) => {
        const existingData = acc.find((item) => item.date === data.date);
        if (existingData) {
          existingData.total += data.total; // Jumlahkan total pendapatan untuk tanggal yang sama
        } else {
          acc.push({ date: data.date, total: data.total }); // Tambahkan data baru
        }
        return acc;
      }, [] as { date: string; total: number }[]);
  };

  const chartData = useMemo(() => {
    const groupedData = groupRevenueByGerai(revenueData); // Kelompokkan data
    const geraiNames = Object.keys(groupedData); // Daftar nama gerai unik
    const uniqueDates = Array.from(
      new Set(revenueData.map((data) => data.date))
    ); // Daftar tanggal unik

    return {
      labels: uniqueDates, // Label untuk sumbu X (tanggal layanan)
      datasets: geraiNames.map((geraiName) => {
        const dailyRevenue = getDailyRevenueByGerai(revenueData, geraiName);

        // Buat array pendapatan harian untuk setiap gerai
        const revenueByDate = uniqueDates.map((date) => {
          const revenue = dailyRevenue.find((data) => data.date === date);
          return revenue ? revenue.total : 0; // Jika tidak ada data, kembalikan 0
        });

        return {
          label: geraiName, // Nama gerai sebagai label dataset
          data: revenueByDate, // Data pendapatan harian
          backgroundColor: `rgba(${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, 0.6)`, // Warna acak untuk setiap gerai
          borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
          )}, ${Math.floor(Math.random() * 255)}, 1)`,
          borderWidth: 2,
        };
      }),
    };
  }, [revenueData]);

  // Definisikan chartOptions di sini
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const, // Posisi legenda
      },
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
      y: {
        ticks: {
          callback: (value: string | number) => {
            return `Rp ${
              typeof value === "number" ? value.toLocaleString() : value
            }`;
          },
        },
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const endDate = new Date();
        const startDate = new Date(endDate);

        switch (timeRange) {
          case "day":
            startDate.setDate(startDate.getDate() - 1);
            break;
          case "week":
            startDate.setDate(startDate.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(startDate.getMonth() - 1);
            break;
          case "year":
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
          case "total":
            startDate.setFullYear(startDate.getFullYear() - 5); // Ambil data selama 5 tahun terakhir
            break;
          default:
            startDate.setFullYear(startDate.getFullYear() - 5);
            break;
        }

        const statistics = await getGeraiStatistics(startDate, endDate);
        let filteredData: RevenueData[] = [];
        let geraiTotalPendapatan: { [key: string]: number } = {};

        statistics.forEach((gerai) => {
          const weeklyData =
            gerai.weekly?.map((w) => ({
              date: formatDateString(w.date), // Format tanggal ke DD-MM-YYYY
              total: w.total,
              gerai: gerai.name,
            })) || [];
          filteredData = [...filteredData, ...weeklyData];

          const geraiTotal = weeklyData.reduce((acc, w) => acc + w.total, 0);
          geraiTotalPendapatan[gerai.name] = geraiTotal;
        });

        const totalPendapatanBaru = filteredData.reduce(
          (acc, item) => acc + item.total,
          0
        );
        const previousTotalPendapatan = totalPendapatan;
        const changePercentage =
          previousTotalPendapatan > 0
            ? ((totalPendapatanBaru - previousTotalPendapatan) /
                previousTotalPendapatan) *
              100
            : 0;

        setTotalPendapatan(totalPendapatanBaru);
        setPercentageChange(changePercentage);
        setRevenueData(filteredData);
        setLastUpdated(new Date().toLocaleString("id-ID"));

        const updatedGeraiData: GeraiData[] = Object.keys(
          geraiTotalPendapatan
        ).map((name) => ({
          name,
          totalPendapatan: geraiTotalPendapatan[name],
        }));
        setGeraiData(updatedGeraiData);
      } catch (error) {
        console.error("Fetching data failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const calculatePercentageChange = (
    current: number,
    previous: number
  ): number => {
    if (previous === 0) return 0; // Hindari pembagian oleh nol
    return ((current - previous) / previous) * 100;
  };

  // const processGeraiData = (geraiData: GeraiData[]) => {
  //   return geraiData.map((gerai) => ({
  //     name: gerai.name,
  //     totalPendapatan: gerai.totalPendapatan,
  //   }));
  // };

  // Komponen Card untuk setiap gerai
  const GeraiCard = ({ gerai }: { gerai: GeraiData }) => {
    const dailyRevenue = revenueData
      .filter((data) => data.gerai === gerai.name)
      .map((data) => ({
        date: data.date,
        total: data.total,
      }));

    const todayRevenue = dailyRevenue[dailyRevenue.length - 1]?.total || 0;
    const yesterdayRevenue = dailyRevenue[dailyRevenue.length - 2]?.total || 0;
    const percentageChange = calculatePercentageChange(
      todayRevenue,
      yesterdayRevenue
    );

    const geraiChartData = {
      labels: dailyRevenue.map((data) => data.date),
      datasets: [
        {
          label: "Pendapatan Harian",
          data: dailyRevenue.map((data) => data.total),
          borderColor: "#ff6600",
          fill: false,
          borderWidth: 2,
        },
      ],
    };

    const chartOptionsGerai = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          display: false,
        },
        x: {
          display: false,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    };

    return (
      <Card
        key={gerai.name}
        className="w-full shadow-sm hover:shadow-md transition-shadow"
      >
        <CardHeader>
          <CardTitle className="text-gray-800 text-xs font-semibold flex justify-between">
            {gerai.name} - Income
            <Badge className="bg-white text-emerald-700 justify-end border-emerald-400/30">
              <span
                className={`font-semibold flex items-center ${
                  percentageChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {percentageChange >= 0 ? (
                  <FaArrowUp className="text-green-600 mr-1" />
                ) : (
                  <FaArrowDown className="text-red-600 mr-1" />
                )}
                {Math.abs(percentageChange).toFixed(2)}%
              </span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-xl sm:text-2xl font-bold text-gray-800">
              Rp {gerai.totalPendapatan.toLocaleString("id-ID")}
            </div>
            <div className="w-1/3 h-16">
              <Line data={geraiChartData} options={chartOptionsGerai} />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <div>
              <span className="font-semibold">Pendapatan Hari Ini:</span> Rp{" "}
              {todayRevenue.toLocaleString("id-ID")}
            </div>
            <div>
              <span className="font-semibold">Pendapatan Kemarin:</span> Rp{" "}
              {yesterdayRevenue.toLocaleString("id-ID")}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleExport = () => {
    const data = [
      ["Laporan Pendapatan Gerai", "", ""],
      ["Gerai", "Pendapatan"],
      ...geraiData.map((gerai) => [
        gerai.name,
        `Rp ${gerai.totalPendapatan.toLocaleString("id-ID")}`,
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
        {/* Header */}
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
              Daily
            </Button>
            <Button
              onClick={() => setTimeRange("week")}
              className={`w-full sm:w-auto ${
                timeRange === "week"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-white text-zinc-800 hover:bg-orange-300"
              }`}
            >
              Weekly
            </Button>
            <Button
              onClick={() => setTimeRange("month")}
              className={`w-full sm:w-auto ${
                timeRange === "month"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-white text-zinc-800 hover:bg-orange-300"
              }`}
            >
              Monthly
            </Button>
            <Button
              onClick={() => setTimeRange("year")}
              className={`w-full sm:w-auto ${
                timeRange === "year"
                  ? "bg-orange-600 hover:bg-orange-700 text-white"
                  : "bg-white text-zinc-800 hover:bg-orange-300"
              }`}
            >
              Yearly
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

        {/* Loading State */}
        {loading ? (
          <div className="fixed inset-0 flex flex-col justify-center items-center bg-white z-50">
            <Clock className="animate-spin w-16 h-16 text-orange-600 mb-2" />
            <h1 className="font-semibold text-xl text-orange-600">
              GGSUSPENSION
            </h1>
          </div>
        ) : (
          <>
            {/* Revenue Card */}
            <Card className="bg-gradient-to-r from-orange-500 to-yellow-600 mb-6 mt-4 sm:mt-6 p-4 sm:p-6 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-white flex flex-col sm:flex-row items-center justify-between">
                  <span className="text-lg sm:text-xl mb-2 sm:mb-0">
                    Total Overall Revenue
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
                  Rp. {totalPendapatan.toLocaleString("id-ID")}
                </div>
                <div className="flex items-center gap-2 mt-2 text-slate-100">
                  <Clock className="h-4 w-4 text-white" />
                  <span>Latest Updates: {lastUpdated}</span>
                </div>
              </CardContent>
            </Card>

            {/* Gerai Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {geraiData.map((gerai) => (
                <GeraiCard key={gerai.name} gerai={gerai} />
              ))}
            </div>

            {timeRange === "total" && (
              <div className="overflow-x-auto mt-4 sm:mt-6">
                <h1>Pendapatan Harian per Gerai (Total)</h1>
                <div className="min-w-[800px]">
                  <Line data={chartData} options={chartOptions} height={400} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
