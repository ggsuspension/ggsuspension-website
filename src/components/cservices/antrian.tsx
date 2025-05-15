import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Clock, Users, Loader2 } from "lucide-react";
import NavbarDashboard from "../fragments/NavbarDashboard";
import { getAuthToken, decodeToken, removeAuthToken } from "@/utils/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { getAntrianCustomer, getGerais } from "@/utils/ggAPI";
import type { Antrian, GroupedAntrian, DecodedToken } from "@/types";

const formatRupiah = (value: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);

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

// Format tanggal untuk input (YYYY-MM-DD) dan display (DD-MM-YY)
const getFormattedDate = (date: Date): string => {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`; // DD-MM-YY
};

// const getInputDate = (formattedDate: string): string => {
//   const [day, month, year] = formattedDate.split("-");
//   return `20${year}-${month}-${day}`; // YYYY-MM-DD
// };

interface Gerai {
  id: number;
  name: string;
}

export default function AntrianCS() {
  const navigate = useNavigate();
  const [data, setData] = useState<GroupedAntrian[]>([]);
  const selectedDate = getFormattedDate(new Date());
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setUserRole(validDecoded.role);

    if (validDecoded.role !== "CS") {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Halaman ini hanya untuk role CS.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => navigate("/", { replace: true }));
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (userRole === "CS" && selectedDate) {
      fetchData(selectedDate);
    }
  }, [selectedDate, userRole]);

  const fetchData = async (date: string) => {
    try {
      setIsLoading(true);
      setData([]);
      setErrorMessage(null);
      // Ambil daftar gerai
      const geraiList: Gerai[] = await getGerais();

      if (!geraiList || geraiList.length === 0) {
        setErrorMessage("Tidak ada gerai yang tersedia.");
        setIsLoading(false);
        return;
      }

      const allData: Antrian[] = [];
      for (const gerai of geraiList) {
        const response = await getAntrianCustomer();
        const rawData = response.filter(
          (item: any) => item.gerai === gerai.name
        );
        allData.push(...rawData);
      }

      if (!Array.isArray(allData) || allData.length === 0) {
        setData([]);
        setErrorMessage(`Tidak ada data antrian untuk tanggal ${date}.`);
        setIsLoading(false);
        return;
      }

      // Transformasi data
      const transformedData: any = allData.map((item: any) => {
        // const totalHargaSeal =
        //   Array.isArray(item.seals) && item.seals.length > 0
        //     ? item.seals.reduce(
        //         (
        //           sum: number,
        //           sealItem: NonNullable<Antrian["seals"]>[number]
        //         ) => sum + (sealItem.seal?.price || 0),
        //         0
        //       )
        //     : item.customer?.harga_seal || 0;

        return {
          id: item.id,
          nama: item.customer?.nama || item.nama || "N/A",
          plat: item.plat_motor || "N/A",
          no_wa: item.noWA || "N/A",
          layanan: item.layanan,
          subcategory: item.jenis_motor,
          motor: item.motor || "",
          bagianMotor: item.bagian_motor,
          hargaLayanan: item.harga_layanan || 0,
          hargaSeal: item.harga_sparepart,
          totalHarga: item.harga_layanan + item.harga_sparepart || 0,
          status: item.status,
          waktu: item.created_at,
          gerai: item.gerai || "Unknown Gerai",
        };
      });
      if (
        transformedData.length === 0 ||
        transformedData.every((item: any) => item.id === 0)
      ) {
        setData([]);
        setErrorMessage(`Tidak ada data antrian valid untuk tanggal ${date}.`);
        setIsLoading(false);
        return;
      }

      // Kelompokkan berdasarkan gerai
      const groupedData: GroupedAntrian[] = Object.values(
        transformedData.reduce(
          (acc: { [key: string]: GroupedAntrian }, item: any) => {
            if (item.id === 0) return acc;
            const gerai = item.gerai || "Unknown Gerai";
            if (!acc[gerai]) {
              acc[gerai] = {
                id: item.id,
                gerai,
                status: item.status,
                data: [],
              };
            }
            acc[gerai].data.push(item);
            return acc;
          },
          {}
        )
      );

      setData(groupedData);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      if (error.message.includes("Sesi telah berakhir")) {
        Swal.fire({
          icon: "error",
          title: "Sesi Berakhir",
          text: "Silakan login ulang.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => navigate("/auth/login", { replace: true }));
      } else {
        setErrorMessage(
          error.message || "Gagal mengambil data antrian. Silakan coba lagi."
        );
      }
      setData([]);
      setIsLoading(false);
    }
  };

  if (!userRole || userRole !== "CS") return null;

  const totalAntrian = data.reduce((sum, group) => sum + group.data.length, 0);

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-gray-50">
      <NavbarDashboard userRole={userRole} />
      <div className="mt-20 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Data Antrian</h1>
          <div className="relative w-48 sm:w-64">
            {/* <label
              htmlFor="date-select"
              className="block text-sm font-medium text-gray-700 mb-1 sr-only"
            >
              Pilih Tanggal
            </label>
            <input
              id="date-select"
              type="date"
              value={getInputDate(selectedDate)}
              onChange={(e) => {
                const date = new Date(e.target.value);
                const formattedDate = getFormattedDate(date);
                console.log("Tanggal dipilih:", formattedDate);
                setSelectedDate(formattedDate);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 transition-all duration-200"
              aria-label="Pilih tanggal untuk melihat antrian"
            /> */}
          </div>
        </div>

        {/* Sticky Header untuk Total Antrian */}
        <div className="sticky top-0 bg-gray-50 z-10 pb-4">
          <Card className="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-xl shadow-lg animate-fade">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Total Antrian ({selectedDate})
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white">
              <div className="text-3xl font-bold">{totalAntrian} Antrian</div>
              <div className="flex items-center text-sm mt-2">
                <Clock className="h-4 w-4 mr-1" />
                Diperbarui: {formatDateForDisplay(new Date())}
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin w-12 h-12 text-orange-600" />
            <span className="ml-2 text-lg text-gray-600">Memuat Data...</span>
          </div>
        ) : (
          <>
            {errorMessage && (
              <p className="text-red-600 text-center my-4">{errorMessage}</p>
            )}

            {data.length === 0 && !errorMessage && (
              <p className="text-center text-gray-600 my-4">
                Tidak ada data antrian untuk tanggal {selectedDate}.
              </p>
            )}

            {data.length > 0 &&
              data.map((group) => (
                <Card
                  key={group.gerai}
                  className="mt-6 bg-white rounded-xl shadow-lg animate-fade"
                >
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">
                      Antrian - {group.gerai}
                    </CardTitle>
                    <div className="text-lg font-semibold text-gray-700">
                      Jumlah Antrian: {group.data.length}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {group.data.length === 0 ? (
                      <p className="text-center text-gray-600">
                        Tidak ada antrian untuk gerai ini.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-orange-100">
                              <th className="p-3 text-left text-gray-700 font-semibold">
                                Nama
                              </th>
                              <th className="p-3 text-left text-gray-700 font-semibold">
                                Plat
                              </th>
                              <th className="p-3 text-left text-gray-700 font-semibold">
                                No WA
                              </th>
                              <th className="p-3 text-left text-gray-700 font-semibold">
                                Layanan
                              </th>
                              <th className="p-3 text-left text-gray-700 font-semibold">
                                Subkategori
                              </th>
                              <th className="p-3 text-left text-gray-700 font-semibold">
                                Motor
                              </th>
                              <th className="p-3 text-left text-gray-700 font-semibold">
                                Bagian Motor
                              </th>
                              <th className="p-3 text-left text-gray-700 font-semibold">
                                Harga Layanan
                              </th>
                              <th className="p-3 text-left text-gray-700 font-semibold">
                                Harga Seal
                              </th>
                              <th className="p-3 text-left text-gray-700 font-semibold">
                                Total Harga
                              </th>
                              <th className="p-3 text-left text-gray-700 font-semibold">
                                Status
                              </th>
                              <th className="p-3 text-left text-gray-700 font-semibold">
                                Waktu
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.data.map((item) => (
                              <tr
                                key={item.id}
                                className="border-b hover:bg-gray-50 transition-colors duration-150"
                              >
                                <td className="p-3 text-gray-700">
                                  {item.nama}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {item.plat}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {item.no_wa}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {item.layanan}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {item.subcategory}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {item.motor}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {item.bagianMotor}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {formatRupiah(item.hargaLayanan)}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {formatRupiah(item.hargaSeal)}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {formatRupiah(item.totalHarga)}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {item.status}
                                </td>
                                <td className="p-3 text-gray-700">
                                  {item.waktu}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
