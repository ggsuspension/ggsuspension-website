import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart } from "@tremor/react";
import { Download, Clock, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";

const branchData = [
  {
    name: "Bekasi",
    today: 12500000,
    change: 4.2,
    weekly: [4200000, 8100000, 7350000, 9250000, 11200000, 9800000, 12500000],
  },
  {
    name: "Tangerang",
    today: 9800000,
    change: -1.8,
    weekly: [5500000, 7200000, 6800000, 8900000, 9500000, 10200000, 9800000],
  },
  {
    name: "Depok",
    today: 11200000,
    change: 7.5,
    weekly: [6200000, 7500000, 8800000, 7900000, 10500000, 9650000, 11200000],
  },
  {
    name: "Cikarang",
    today: 8450000,
    change: 2.3,
    weekly: [4800000, 6100000, 7200000, 6950000, 8200000, 7900000, 8450000],
  },
  {
    name: "Jaksel",
    today: 15300000,
    change: 10.1,
    weekly: [
      9200000, 11200000, 12500000, 13800000, 14500000, 14200000, 15300000,
    ],
  },
  {
    name: "Bogor",
    today: 7200000,
    change: -3.4,
    weekly: [5100000, 6500000, 6800000, 7200000, 6950000, 7350000, 7200000],
  },
  {
    name: "Jaktim",
    today: 13800000,
    change: 5.6,
    weekly: [
      9800000, 11200000, 12500000, 12800000, 13200000, 13500000, 13800000,
    ],
  },
];
export default function FinanceDashboard() {
  const totalToday = branchData.reduce((sum, branch) => sum + branch.today, 0);

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
            Rekapan Keuangan GG Suspension
          </h1>
          <div className="flex items-center gap-2 mt-2 text-gray-500">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Update Terakhir: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="mr-2 h-4 w-4" />
          Export Laporan
        </Button>
      </div>

      {/* Total Hari Ini */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">
            Total Pendapatan Hari Ini
          </CardTitle>
          <Badge className="bg-white text-emerald-700 border-emerald-400/30">
            +12.5% vs kemarin
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-white">
            Rp {totalToday.toLocaleString("id-ID")}
          </div>
        </CardContent>
      </Card>

      {/* Grid Cabang */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {branchData.map((branch) => (
          <Card
            key={branch.name}
            className="bg-white border border-gray-200 hover:border-blue-500/50 transition-all group hover:shadow-lg hover:shadow-blue-500/10"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-gray-800">{branch.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${
                    branch.change > 0
                      ? "bg-emerald-100 text-emerald-600 border-emerald-200"
                      : "bg-rose-100 text-rose-600 border-rose-200"
                  }`}
                >
                  {branch.change > 0 ? "+" : ""}
                  {branch.change}%
                </Badge>
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4 text-gray-800">
                Rp {branch.today.toLocaleString("id-ID")}
              </div>
              <LineChart
                className="h-24"
                data={branch.weekly.map((value, index) => ({
                  day: `Hari ${index + 1}`,
                  Pendapatan: value,
                }))}
                index="day"
                categories={["Pendapatan"]}
                colors={[branch.change > 0 ? "emerald" : "rose"]}
                showLegend={false}
                showXAxis={false}
                showYAxis={false}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Perbandingan Cabang */}
      <Card className="bg-white border border-gray-200 mb-6">
        <CardHeader>
          <CardTitle className="text-gray-800">
            Perbandingan Pendapatan Harian Cabang
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            className="h-96"
            data={branchData.map((branch) => ({
              Cabang: branch.name,
              Pendapatan: branch.today,
            }))}
            index="Cabang"
            categories={["Pendapatan"]}
            colors={["blue"]}
            yAxisWidth={80}
            valueFormatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
            tickGap={20}
            showAnimation={true}
          />
        </CardContent>
      </Card>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">
              Tren Mingguan (Jaksel)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              className="h-72"
              data={branchData[4].weekly.map((value, index) => ({
                hari: `Hari ${index + 1}`,
                Pendapatan: value,
              }))}
              index="hari"
              categories={["Pendapatan"]}
              colors={["blue"]}
              valueFormatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
              showAnimation={true}
            />
          </CardContent>
        </Card>


        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">
              Performa Harian Cabang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="p-4 text-gray-600 font-semibold">Cabang</th>
                    <th className="p-4 text-gray-600 font-semibold">
                      Pendapatan
                    </th>
                    <th className="p-4 text-gray-600 font-semibold">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {branchData.map((branch) => (
                    <tr
                      key={branch.name}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="p-4 text-gray-800">{branch.name}</td>
                      <td className="p-4 text-gray-800">
                        Rp {branch.today.toLocaleString("id-ID")}
                      </td>
                      <td className="p-4">
                        <Progress
                          value={(branch.today / 15000000) * 100}
                          className="h-2 bg-gray-200"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
