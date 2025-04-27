import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken, decodeToken, removeAuthToken } from "@/utils/auth";
import { getWarehouseSeals, getAllStockRequests } from "@/utils/ggAPI";
import Swal from "sweetalert2";
import NavbarDashboard from "../fragments/NavbarDashboard";
import { WarehouseSeal, StockRequest } from "@/types";

const DashboardGudang = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalStock: 0,
    totalRequests: 0,
    approvedRequests: 0,
    canceledRequests: 0,
  });
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      setUserName(decoded.username || "Gudang");

      if (decoded.role !== "GUDANG") {
        showSwalWarning(
          "Akses Ditolak",
          "Halaman ini hanya untuk GUDANG.",
          "/dashboard"
        );
        return;
      }
    };

    initializeUser();
  }, [navigate]);

  useEffect(() => {
    if (userRole === "GUDANG") {
      fetchData();
    }
  }, [userRole]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [seals, stockRequests] = await Promise.all([
        getWarehouseSeals(),
        getAllStockRequests(),
      ]);

      console.log("Fetched seals:", seals);
      console.log("Fetched stock requests:", stockRequests);
      console.log("Stock requests length:", stockRequests.length);
      console.log(
        "Stock requests statuses:",
        stockRequests.map((req) => req.status)
      );

      const totalStock = seals.reduce(
        (sum: number, seal: WarehouseSeal) => sum + (seal.qty || 0),
        0
      );

      const totalRequests = stockRequests.length;
      const approvedRequests = stockRequests.filter(
        (req: StockRequest) => req.status.toUpperCase() === "APPROVED"
      ).length;
      const canceledRequests = stockRequests.filter(
        (req: StockRequest) => req.status.toUpperCase() === "CANCELLED"
      ).length;

      console.log("Calculated stats:", {
        totalStock,
        totalRequests,
        approvedRequests,
        canceledRequests,
      });

      setStats({
        totalStock,
        totalRequests,
        approvedRequests,
        canceledRequests,
      });
      setRequests(stockRequests);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Gagal mengambil data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSwalWarning = (title: string, text: string, redirectTo: string) => {
    Swal.fire({
      icon: "warning",
      title,
      text,
      timer: 1500,
      showConfirmButton: false,
    }).then(() => navigate(redirectTo, { replace: true }));
  };

  console.log("Current stats before render:", stats);

  if (!userRole) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarDashboard userRole={userRole} />
      <main className="mt-20 px-6 flex-1">
        <h1 className="text-2xl font-semibold text-gray-800 mt-10">
          Selamat datang kembali, {userName}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-xl text-gray-600">Memuat data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Stok Gudang
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalStock} unit
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">
                  Total Request
                </h3>
                <p className="text-2xl font-bold text-gray-600">
                  {stats.totalRequests}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">
                  Request Approved
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approvedRequests}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">
                  Request Canceled
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {stats.canceledRequests}
                </p>
              </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Detail Request Seal
              </h3>
              {requests.length > 0 ? (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 border-b">ID</th>
                      <th className="p-3 border-b">Gerai</th>
                      <th className="p-3 border-b">Seal</th>
                      <th className="p-3 border-b">Jumlah</th>
                      <th className="p-3 border-b">Status</th>
                      <th className="p-3 border-b">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{req.id}</td>
                        <td className="p-3">
                          {req.gerai?.name || "Unknown Gerai"}
                        </td>
                        <td className="p-3">
                          {req.warehouse_seal?.motor
                            ? `${req.warehouse_seal.motor.name} (${req.warehouse_seal.cc_range})`
                            : `Seal Tidak Diketahui (${
                                req.warehouse_seal?.cc_range || "N/A"
                              })`}
                        </td>
                        <td className="p-3">{req.qty_requested}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-1 rounded ${
                              req.status === "APPROVED"
                                ? "bg-green-100 text-green-800"
                                : req.status === "REJECTED"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {new Date(req.created_at).toLocaleDateString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600">
                  Tidak ada request seal saat ini.
                </p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardGudang;
