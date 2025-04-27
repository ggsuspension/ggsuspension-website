import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import NavbarDashboard from "../fragments/NavbarDashboard";
import { getAuthToken, decodeToken, removeAuthToken } from "@/utils/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  getSealsByGerai,
  getWarehouseSeals,
  requestSeal,
  getStockRequestsByGerai,
} from "@/utils/ggAPI";
import { type DecodedToken, type Seal, type StockRequest } from "@/types";

// Format waktu WIB
const formatDateForDisplay = (
  date: Date | string | null | undefined,
  isBackendTime: boolean = false
): string => {
  if (!date) {
    return "Tidak tersedia";
  }

  const inputDate = typeof date === "string" ? new Date(date) : date;
  if (isNaN(inputDate.getTime())) {
    return "Tanggal tidak valid";
  }

  // Jika isBackendTime true, asumsikan input adalah UTC dan konversi ke WIB (+7 jam)
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

  const day = dayNames[displayDate.getDay()];
  const dateNum = displayDate.getDate();
  const month = monthNames[displayDate.getMonth()];
  const year = displayDate.getFullYear();
  const hours = ("0" + displayDate.getHours()).slice(-2);
  const minutes = ("0" + displayDate.getMinutes()).slice(-2);

  return `${day}, ${dateNum} ${month} ${year}, ${hours}:${minutes} WIB`;
};

// Format Rupiah
const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);

export default function SealAdmin() {
  const navigate = useNavigate();
  const [seals, setSeals] = useState<Seal[]>([]);
  const [warehouseSeals, setWarehouseSeals] = useState<any[]>([]);
  const [stockRequests, setStockRequests] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userGeraiId, setUserGeraiId] = useState<number | null>(null);
  const [userGeraiName, setUserGeraiName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestQuantity, setRequestQuantity] = useState<string>("");
  const [selectedWarehouseSealId, setSelectedWarehouseSealId] = useState<
    number | null
  >(null);

  const fetchData = async (geraiId: number) => {
    try {
      console.log(`Starting fetchData for geraiId: ${geraiId}`);
      const [sealData, warehouseData, stockRequestData] = await Promise.all([
        getSealsByGerai({ geraiId }),
        getWarehouseSeals(),
        getStockRequestsByGerai(geraiId),
      ]);
      console.log("Seal Data:", sealData);
      console.log("Warehouse Data:", warehouseData);
      console.log("Stock Request Data:", stockRequestData);
      setSeals(sealData || []);
      setWarehouseSeals(warehouseData || []);
      setStockRequests(stockRequestData || []);
      setLastUpdated(formatDateForDisplay(new Date()));
      console.log("fetchData completed successfully");
    } catch (error: any) {
      console.error("Failed to fetch data:", {
        error: error.message,
        stack: error.stack,
      });
      setErrorMessage("Gagal mengambil data: " + error.message);
      setSeals([]);
      setWarehouseSeals([]);
      setStockRequests([]);
    }
  };

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
    console.log("Decoded Token:", validDecoded);
    setUserRole(validDecoded.role);
    setUserGeraiId(validDecoded.geraiId);
    setUserGeraiName(validDecoded.gerai?.name || "");

    if (validDecoded.role !== "ADMIN") {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Halaman ini hanya untuk ADMIN.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/", { replace: true }));
      return;
    }

    const init = async () => {
      setLoading(true);
      await fetchData(validDecoded.geraiId);
      setLoading(false);
    };
    init();
  }, [navigate]);

  useEffect(() => {
    console.log("Current Stock Requests:", stockRequests);
  }, [stockRequests]);

  useEffect(() => {
    if (warehouseSeals.length > 0 && selectedWarehouseSealId === null) {
      setSelectedWarehouseSealId(warehouseSeals[0].id);
    }
  }, [warehouseSeals]);

  const handleRequestSeal = async () => {
    console.log("Gerai ID:", userGeraiId);
    console.log("Selected Warehouse Seal ID:", selectedWarehouseSealId);
    console.log("Request Quantity:", requestQuantity);

    if (!userGeraiId || !selectedWarehouseSealId || !requestQuantity) {
      return Swal.fire({
        icon: "error",
        title: "Data Tidak Lengkap",
        text: "Pastikan ID Gerai, Seal, dan Jumlah permintaan sudah terisi.",
        timer: 1500,
        showConfirmButton: false,
      });
    }

    const qty = Number(requestQuantity);
    if (isNaN(qty) || qty <= 0) {
      return Swal.fire({
        icon: "error",
        title: "Jumlah Tidak Valid",
        text: "Masukkan jumlah seal yang valid.",
        timer: 1500,
        showConfirmButton: false,
      });
    }

    const selectedWarehouseSeal = warehouseSeals.find(
      (ws) => ws.id === selectedWarehouseSealId
    );
    if (!selectedWarehouseSeal || selectedWarehouseSeal.qty < qty) {
      return Swal.fire({
        icon: "error",
        title: "Stok Tidak Cukup",
        text: "Jumlah yang diminta melebihi stok gudang.",
        timer: 1500,
        showConfirmButton: false,
      });
    }

    const payload = {
      gerai_id: userGeraiId,
      warehouse_seal_id: selectedWarehouseSealId,
      qty_requested: qty,
    };

    setRequesting(true);
    try {
      const newRequest = await requestSeal(payload);
      console.log("New Request:", newRequest);
      const updatedWarehouseSeals = warehouseSeals.map((ws) =>
        ws.id === selectedWarehouseSealId ? { ...ws, qty: ws.qty - qty } : ws
      );
      setWarehouseSeals(updatedWarehouseSeals);

      Swal.fire({
        icon: "success",
        title: "Permintaan Seal Berhasil",
        text: `Permintaan ${qty} seal dikirim ke gudang.`,
        timer: 1500,
        showConfirmButton: false,
      });

      setStockRequests((prev) => {
        const updatedRequests = [...prev, newRequest];
        console.log("Updated Stock Requests:", updatedRequests);
        return updatedRequests;
      });
      setRequestQuantity("");

      // Refresh data untuk sinkronisasi
      await fetchData(userGeraiId!);
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Gagal Meminta Seal",
        text: error.message || "Terjadi kesalahan.",
      });
    } finally {
      setRequesting(false);
    }
  };

  if (userRole !== "ADMIN") return null;

  const totalStock = seals.reduce((sum, seal) => sum + seal.qty, 0);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-slate-100 shadow-lg">
      <NavbarDashboard userRole={userRole} />
      <div className="mt-20">
        <h1 className="text-2xl font-bold mb-6">
          Spareparts - {userGeraiName || "Memuat..."}
        </h1>

        {loading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <Clock className="animate-spin w-16 h-16 text-orange-600 mb-4" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-orange-600">
                Memuat Data...
              </h2>
              <p>Harap tunggu sebentar</p>
            </div>
          </div>
        ) : (
          <>
            {errorMessage && (
              <p className="text-red-600 text-center">{errorMessage}</p>
            )}

            <Card className="bg-gradient-to-r from-orange-500 to-yellow-600 mb-6 rounded-xl shadow-md">
              <CardHeader>
                <CardTitle className="text-white text-xl">
                  Total Stok Seal
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white text-2xl font-bold">
                {totalStock} Seal
                <div className="flex items-center text-sm mt-2">
                  <Clock className="w-4 h-4 mr-1" />
                  {lastUpdated}
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Request Seal Baru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select
                    value={selectedWarehouseSealId ?? ""}
                    onChange={(e) =>
                      setSelectedWarehouseSealId(Number(e.target.value))
                    }
                    className="p-2 border rounded w-full sm:w-1/2"
                  >
                    {warehouseSeals.length === 0 ? (
                      <option value="">Tidak ada seal tersedia</option>
                    ) : (
                      warehouseSeals.map((ws) => (
                        <option key={ws.id} value={ws.id}>
                          {ws.motor?.name} - {ws.cc_range} ({ws.qty} tersedia)
                        </option>
                      ))
                    )}
                  </select>
                  <input
                    type="number"
                    value={requestQuantity}
                    onChange={(e) => setRequestQuantity(e.target.value)}
                    placeholder="Jumlah"
                    min={1}
                    className="p-2 border rounded w-full sm:w-1/2"
                  />
                  <Button
                    onClick={handleRequestSeal}
                    className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
                    disabled={
                      loading || requesting || warehouseSeals.length === 0
                    }
                  >
                    Kirim Permintaan
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Daftar Seal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="custom-scrollbar">
                  <table className="w-full table-auto border min-w-[1200px]">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">CC Range</th>
                        <th className="p-2">Motor</th>
                        <th className="p-2">Harga</th>
                        <th className="p-2">Stok</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seals.map((seal) => (
                        <tr key={seal.id} className="border-b">
                          <td className="p-2">{seal.cc_range}</td>
                          <td className="p-2">{seal.motor?.name || "-"}</td>
                          <td className="p-2">{formatRupiah(seal.price)}</td>
                          <td className="p-2">{seal.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Daftar Permintaan Stok</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="custom-scrollbar">
                  <table className="w-full table-auto border min-w-[1200px]">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="p-2">CC Range</th>
                        <th className="p-2">Motor</th>
                        <th className="p-2">Jumlah</th>
                        <th className="p-2">Tanggal</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockRequests.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-2 text-center">
                            Tidak ada permintaan stok
                          </td>
                        </tr>
                      ) : (
                        stockRequests.map((request) => {
                          console.log("Rendering Request:", request);
                          return (
                            <tr key={request.id} className="border-b">
                              <td className="p-2">
                                {request.warehouse_seal?.cc_range || "N/A"}
                              </td>
                              <td className="p-2">
                                {request.warehouse_seal?.motor?.name || "N/A"}
                              </td>
                              <td className="p-2">{request.qty_requested}</td>
                              <td className="p-2">
                                {request.created_at
                                  ? formatDateForDisplay(
                                      request.created_at,
                                      false
                                    )
                                  : "N/A"}
                              </td>
                              <td className="p-2">
                                <span
                                  className={`px-2 py-1 rounded text-white ${
                                    request.status === "PENDING"
                                      ? "bg-yellow-500"
                                      : request.status === "APPROVED"
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                >
                                  {request.status === "PENDING"
                                    ? "Menunggu"
                                    : request.status === "APPROVED"
                                    ? "Disetujui"
                                    : "Ditolak"}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
