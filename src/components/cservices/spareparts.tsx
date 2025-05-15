import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Package, ChevronDown, Loader2 } from "lucide-react";
import NavbarDashboard from "../fragments/NavbarDashboard";
import { getAuthToken, decodeToken, removeAuthToken } from "@/utils/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { type DecodedToken, type Sparepart } from "@/types";
import { getAllSeals, getSealsByGerai } from "@/utils/ggAPI";

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
const formatRupiah = (value: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);

interface GeraiOption {
  id: number;
  name: string;
}

export default function AllGeraiSpareparts() {
  const navigate = useNavigate();
  const [geraiList, setGeraiList] = useState<GeraiOption[]>([]);
  const [selectedGeraiId, setSelectedGeraiId] = useState<string>("");
  const [selectedGeraiSeals, setSelectedGeraiSeals] = useState<Sparepart[]>([]);
  const [selectedGeraiName, setSelectedGeraiName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSeals, setLoadingSeals] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchGeraiList = async (): Promise<GeraiOption[]> => {
    try {
      console.log("Starting fetchGeraiList");
      const seals = await getAllSeals();
      console.log("All Seals:", seals);

      // Group gerai to get unique gerai list
      const geraiMap = new Map<number, GeraiOption>();
      seals.forEach((seal) => {
        if (!seal.gerai || geraiMap.has(seal.gerai_id)) return;
        geraiMap.set(seal.gerai_id, {
          id: seal.gerai_id,
          name: seal.gerai.name,
        });
      });

      const geraiOptions = Array.from(geraiMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      console.log("Gerai List:", geraiOptions);

      setGeraiList(geraiOptions);
      return geraiOptions;
    } catch (error: any) {
      console.error("Failed to fetch gerai list:", {
        error: error.message,
        stack: error.stack,
      });
      setErrorMessage("Gagal mengambil daftar gerai: " + error.message);
      setGeraiList([]);
      return [];
    }
  };

  const fetchSelectedGeraiSeals = async (geraiId: number): Promise<void> => {
    setLoadingSeals(true);
    try {
      console.log(`Fetching seals for geraiId: ${geraiId}`);
      const seals = await getSealsByGerai({ geraiId });
      console.log(`Seals for geraiId ${geraiId}:`, seals);
      setSelectedGeraiSeals(seals);
      setLastUpdated(formatDateForDisplay(new Date()));
    } catch (error: any) {
      console.error("Failed to fetch selected gerai seals:", {
        error: error.message,
        stack: error.stack,
      });
      Swal.fire({
        icon: "error",
        title: "Gagal Mengambil Data",
        text: `Tidak dapat mengambil data seal untuk gerai: ${error.message}`,
        timer: 1500,
        showConfirmButton: false,
      });
      setSelectedGeraiSeals([]);
    } finally {
      setLoadingSeals(false);
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
    console.log("Decoded Token:", validDecoded);
    setUserRole(validDecoded.role);

    if (validDecoded.role !== "CS"&&validDecoded.role !== "CEO") {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Halaman ini hanya untuk CS.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/", { replace: true }));
      return;
    }

    const init = async () => {
      setLoading(true);
      const geraiOptions = await fetchGeraiList();
      if (geraiOptions.length > 0) {
        const defaultGerai = geraiOptions[0];
        setSelectedGeraiId(defaultGerai.id.toString());
        setSelectedGeraiName(defaultGerai.name);
        await fetchSelectedGeraiSeals(defaultGerai.id);
      }
      setLoading(false);
    };
    init();
  }, [navigate]);

  const handleGeraiChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const geraiId = event.target.value;
    setSelectedGeraiId(geraiId);
    if (geraiId) {
      const selectedGerai = geraiList.find(
        (gerai) => gerai.id === parseInt(geraiId)
      );
      setSelectedGeraiName(selectedGerai ? selectedGerai.name : "");
      fetchSelectedGeraiSeals(parseInt(geraiId));
    } else {
      setSelectedGeraiSeals([]);
      setSelectedGeraiName("");
    }
  };

  if (userRole !== "CS"&&userRole !== "CEO") return null;

  const totalStock = selectedGeraiSeals.reduce(
    (sum, seal) => sum + seal.qty,
    0
  );

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-gray-50">
      <NavbarDashboard userRole={userRole} />
      <div className="mt-20 max-w-7xl mx-auto">
        {/* Judul dan Dropdown */}
        <div className="flex items-center gap-4 mb-6 flex-row justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Stok Spareparts</h1>
          <div className="relative w-60 sm:w-78">
            <label
              htmlFor="gerai-select"
              className="block text-sm font-medium text-gray-700 mb-1 sr-only"
            >
              Pilih Gerai
            </label>
            <select
              id="gerai-select"
              value={selectedGeraiId}
              onChange={handleGeraiChange}
              className="appearance-none w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 transition-all duration-200"
              aria-label="Pilih Gerai untuk Lihat Stok Seal"
            >
              <option value="">Pilih Gerai</option>
              {geraiList.map((gerai) => (
                <option key={gerai.id} value={gerai.id}>
                  {gerai.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>

        {/* Sticky Header untuk Card Total Stok */}
        <div className="top-0 bg-gray-50 z-10 pb-4">
          <Card className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-xl shadow-lg animate-fade">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Total Stok Seal {selectedGeraiName || "Gerai"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="text-3xl font-bold">{totalStock} Seal</div>
              <div className="flex items-center text-sm mt-2">
                <Clock className="h-4 w-4 mr-1" />
                {lastUpdated}
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin w-12 h-12 text-orange-600" />
            <span className="ml-2 text-lg text-gray-600">Memuat Data...</span>
          </div>
        ) : (
          <>
            {errorMessage && (
              <p className="text-red-600 text-center my-4">{errorMessage}</p>
            )}

            {selectedGeraiId && (
              <Card className="mt-6 bg-white rounded-xl shadow-lg animate-fade">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">
                    Stok Seal - {selectedGeraiName || "Memuat..."}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingSeals ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
                      <span className="ml-2 text-gray-600">Memuat Seal...</span>
                    </div>
                  ) : (
                    <div className="custom-scrollbar">
                      <table className="w-fit table-auto border min-w-[1200px] border-collapse">
                        <thead>
                          <tr className="bg-orange-100">
                            <th className="p-3 text-left text-gray-700 font-semibold">
                              Kategori
                            </th>
                            <th className="p-3 text-left text-gray-700 font-semibold">
                              Tipe
                            </th>
                            <th className="p-3 text-left text-gray-700 font-semibold">
                              Size
                            </th>
                            <th className="p-3 text-left text-gray-700 font-semibold">
                              Motor
                            </th>
                            <th className="p-3 text-left text-gray-700 font-semibold">
                              Harga
                            </th>
                            <th className="p-3 text-left text-gray-700 font-semibold">
                              Stok
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedGeraiSeals.length === 0 ? (
                            <tr>
                              <td
                                colSpan={4}
                                className="p-3 text-center text-gray-500"
                              >
                                Tidak ada stok seal
                              </td>
                            </tr>
                          ) : (
                            selectedGeraiSeals.map((seal) => (
                              <tr
                                key={seal.id}
                                className="border-b hover:bg-gray-50 transition-colors duration-150"
                              >
                                <td className="p-3 text-gray-700">
                                  {seal.category.toUpperCase()}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {seal.type}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {seal.size}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {seal.motor?.name || "-"}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {formatRupiah(seal.price)}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {seal.qty}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
