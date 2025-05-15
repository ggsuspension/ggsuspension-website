import { useEffect, useState } from "react";
import TabelAntrianHarianEdit from "../fragments/TabelAntrianHarianEdit";
import { useLocation, useNavigate } from "react-router-dom";
import {
  cancelOrder,
  finishOrder,
  getAllSeals,
  getAntrianCustomer,
  updateAntrian,
} from "@/utils/ggAPI";
import { getAuthToken, decodeToken, removeAuthToken } from "@/utils/auth";
import Swal from "sweetalert2";
import NavbarDashboard from "../fragments/NavbarDashboard";
import type { Antrian, GroupedAntrian, TransformedAntrian } from "@/types";

function getFormattedDate(date: Date): string {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`; // Format DD-MM-YY
}

export default function Antrian() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<GroupedAntrian[]>([]);
  const [selectedGeraiId, setSelectedGeraiId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    getFormattedDate(new Date())
  );
  // const [userGeraiName, setUserGeraiName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<TransformedAntrian | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSeal, setDataSeal] = useState<any>([]);
  const token = getAuthToken();
  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Login Diperlukan",
      text: "Silakan login terlebih dahulu.",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      navigate("/auth/login", { replace: true });
    });
    return;
  }

  const decoded = decodeToken(token);

  useEffect(() => {
    async function getSeal() {
      const seal = await getAllSeals();
      setDataSeal(seal);
    }
    getSeal();

    if (!decoded) {
      removeAuthToken();
      Swal.fire({
        icon: "error",
        title: "Token Tidak Valid",
        text: "Silakan login ulang.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/auth/login", { replace: true });
      });
      return;
    }
    setUserRole(decoded.role);
    // setUserGeraiName(decoded.gerai?.name || null);
    setSelectedGeraiId(decoded.geraiId?.toString() || "");
  }, [navigate]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Diperlukan",
        text: "Silakan login terlebih dahulu.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/auth/login", { replace: true });
      });
      return;
    }

    const decoded = decodeToken(token);
    if (userRole && userRole !== "CEO" && selectedDate && selectedGeraiId) {
      fetchData(selectedDate, decoded);
    } else if (userRole === "CEO") {
      setData([]);
      setErrorMessage("Akses ke halaman edit tidak diizinkan untuk CEO.");
      setIsLoading(false);
    }
  }, [selectedDate, selectedGeraiId, userRole]);

  const fetchData = async (date: string, decoded: any) => {
    try {
      setIsLoading(true);
      setData([]);
      setErrorMessage(null);
      const response = await getAntrianCustomer();
      let rawData = response;
      rawData = rawData.filter((data:any)=> data.created_at.substring(2, 10).split('-').reverse().join('-') == date).filter((item: any) => item.gerai == decoded.gerai.name);
      if (!Array.isArray(rawData) || rawData.length === 0) {
        setData([]);
        setErrorMessage(`Tidak ada data antrian untuk tanggal ${date}.`);
        setIsLoading(false);
        return;
      }

      const geraiName = rawData[0].gerai?.name || "Unknown Gerai";
      const transformedData: any = rawData.map(
        (item: any, _index: number, _array: Antrian[]) => {
          // Validasi properti wajib
          if (!item.id || !item.created_at) {
            console.warn("Data antrian tidak lengkap:", item);
            return {
              id: 0,
              nama: "N/A",
              plat: "N/A",
              no_wa: "N/A",
              layanan: "N/A",
              subcategory: "N/A",
              motor: "N/A",
              bagianMotor: "N/A",
              hargaLayanan: 0,
              hargaSeal: 0,
              totalHarga: 0,
              status: "PROGRESS" as const,
              waktu: "N/A",
              gerai: geraiName,
            };
          }

          return {
            id: item.id,
            nama: item.customer?.nama || item.nama || "N/A",
            plat: item.customer?.plat || item.plat_motor || "N/A",
            no_wa: item.customer?.no_wa || item.noWA || "N/A",
            layanan: item.layanan || "N/A",
            subcategory:
              item.jenis_motor || item.customer?.subcategory || "N/A",
            motor: item.motor || item.customer?.motor || "N/A",
            bagianMotor:
              item.bagian_motor || item.customer?.bagian_motor || "N/A",
            bagianMotor2:
              item.bagian_motor2 || item.customer?.bagian_motor || "N/A",
            hargaLayanan:
              item.harga_service || item.customer?.harga_layanan || 0,
            sparepart: item.sparepart,
            hargaSparepart: item.harga_sparepart ?? 0,
            totalHarga: item.totalHarga || item.customer?.total_harga || 0,
            status: item.status,
            gerai: item.gerai,
          };
        }
      );

      if (
        transformedData.length === 0 ||
        transformedData.every((item: any) => item.id === 0)
      ) {
        setData([]);
        setErrorMessage(
          `Tidak ada data antrian valid untuk tanggal ${date} di gerai ${geraiName}.`
        );
        setIsLoading(false);
        return;
      }
      const filteredCancelled = transformedData.filter(
        (item: any) => item.status !== "CANCEL"
      );

      const grouped: GroupedAntrian = {
        id: transformedData[0].id,
        gerai: geraiName,
        status: transformedData[0].status,
        data: filteredCancelled,
      };
      setData([grouped]);
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
        }).then(() => {
          navigate("/auth/login", { replace: true });
        });
      } else {
        setErrorMessage(
          error.message || "Gagal mengambil data antrian. Silakan coba lagi."
        );
      }
      setData([]);
      setIsLoading(false);
    }
  };

  // const handleExport = () => {
  //   if (data.length === 0) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Tidak Ada Data",
  //       text: "Tidak ada data antrian untuk diekspor.",
  //       timer: 1500,
  //       showConfirmButton: false,
  //     });
  //     return;
  //   }

  //   const csvData = data.flatMap((group) =>
  //     group.data.map((item: TransformedAntrian) => ({
  //       Nama: item.nama,
  //       Plat: item.plat,
  //       "No WA": item.no_wa,
  //       Layanan: item.layanan,
  //       Subkategori: item.subcategory,
  //       Motor: item.motor,
  //       "Bagian Motor": item.bagianMotor,
  //       "Harga Layanan": item.hargaLayanan,
  //       "Harga Seal": item.hargaSeal,
  //       "Total Harga": item.totalHarga,
  //       Status: item.status,
  //       Waktu: new Date(item.waktu).toLocaleString(),
  //       Gerai: group.gerai,
  //     }))
  //   );

  //   const csv = Papa.unparse(csvData);
  //   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = `antrian_${selectedDate}_${userGeraiName || "gerai"}.csv`;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // };

  const handleEdit = (item: any) => {
    setEditItem({ ...item });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem || !editItem.id) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "ID antrian tidak valid.",
      });
      return;
    }

    try {
      await updateAntrian(editItem.id, {
        nama: editItem.nama,
        plat_motor: editItem.plat,
        noWA: editItem.no_wa,
        waktu: editItem.waktu,
        status: editItem.status,
        layanan: editItem.layanan,
        jenis_motor: editItem.subcategory,
        motor: editItem.motor,
        bagian_motor: editItem.bagianMotor,
        bagian_motor2: editItem.bagianMotor2,
        harga_service: editItem.hargaLayanan,
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data antrian berhasil diperbarui.",
        timer: 1500,
        showConfirmButton: false,
      });
      setEditItem(null);
      fetchData(selectedDate, decoded);
    } catch (error: any) {
      console.error("Error updating antrian:", error);
      if (error.message.includes("Sesi telah berakhir")) {
        Swal.fire({
          icon: "error",
          title: "Sesi Berakhir",
          text: "Silakan login ulang.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/auth/login", { replace: true });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: `Terjadi kesalahan: ${error.message}`,
        });
      }
    }
  };

  const handleFinish = async (id: number) => {
    if (!id || typeof id !== "number") {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "ID antrian tidak valid untuk menyelesaikan.",
      });
      return;
    }
    try {
      const response = await finishOrder(id);
      if (response.message) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Antrian berhasil diselesaikan.",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      setEditItem(null);
      fetchData(selectedDate, decoded);
    } catch (error: any) {
      console.error("Error finishing antrian:", error);
      if (error.message.includes("Sesi telah berakhir")) {
        Swal.fire({
          icon: "error",
          title: "Sesi Berakhir",
          text: "Silakan login ulang.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/auth/login", { replace: true });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: `Gagal menyelesaikan antrian: ${error.message}`,
        });
      }
    }
  };

  const handleCancel = async (id: number) => {
    if (!id || typeof id !== "number") {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "ID antrian tidak valid untuk membatalkan.",
      });
      return;
    }
    try {
      cancelOrder(id).then(
        (response) =>
          response &&
          Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Antrian berhasil dibatalkan.",
            timer: 1500,
            showConfirmButton: false,
          })
      );
      setEditItem(null);
      fetchData(selectedDate, decoded);
    } catch (error: any) {
      console.error("Error cancelling antrian:", error);
      if (error.message.includes("Sesi telah berakhir")) {
        Swal.fire({
          icon: "error",
          title: "Sesi Berakhir",
          text: "Silakan login ulang.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/auth/login", { replace: true });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: `Gagal membatalkan antrian: ${error.message}`,
        });
      }
    }
  };

  if (!userRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarDashboard userRole={userRole} />
      <div className="mt-[5rem] w-full px-6">
        {location.pathname === "/antrian-admin" && (
          <>
            <h1 className="text-xl flex justify-center font-semibold text-gray-800 mt-10">
              Tabel Data Antrian ({selectedDate})
            </h1>
            <div className="flex gap-4 items-center mt-2 justify-center">
              <input
                type="date"
                value={selectedDate
                  .split("-")
                  .reverse()
                  .map((part, index) => (index === 0 ? `20${part}` : part))
                  .join("-")}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const formattedDate = getFormattedDate(date);
                  setSelectedDate(formattedDate);
                }}
                className="border p-2 rounded-md shadow-sm"
              />
              {/* <span className="border p-2 bg-gray-200 rounded-md shadow-sm">
                {userGeraiName || "Gerai Tidak Diketahui"}
              </span> */}
              {/* <button
                onClick={handleExport}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition shadow-md"
                disabled={userRole === "CEO" || data.length === 0}
              >
                <Download className="w-5 h-5 mr-2" /> Download
              </button> */}
            </div>
            {isLoading && (
              <p className="text-center text-gray-600 mt-4">Memuat data...</p>
            )}
            {errorMessage && !isLoading && (
              <p className="text-center text-red-600 mt-4">{errorMessage}</p>
            )}
            {!isLoading && data.length === 0 && !errorMessage && (
              <p className="text-center text-gray-600 mt-4">
                Tidak ada data antrian untuk ditampilkan.
              </p>
            )}
            {userRole !== "CEO" && data.length > 0 && (
              <TabelAntrianHarianEdit
                data={data}
                dataSeal={dataSeal}
                isLoading={isLoading}
                onEdit={handleEdit}
                onFinish={handleFinish}
                onCancel={handleCancel}
                editItem={editItem}
                setEditItem={setEditItem}
                onUpdate={handleUpdate}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
