import { useEffect, useState } from "react";
import TabelAntrianHarianEdit from "../fragments/TabelAntrianHarianEdit";
import { useLocation, useNavigate } from "react-router-dom";
import {
  cancelOrder,
  finishOrder,
  getAntrianCustomer,
  updateAntrian,
  updateSeal,
} from "@/utils/ggAPI";
import { getAuthToken, decodeToken, removeAuthToken } from "@/utils/auth";
import Swal from "sweetalert2";
import NavbarDashboard from "../fragments/NavbarDashboard";
import type { Antrian, GroupedAntrian, TransformedAntrian } from "@/types";
import { getSealsByGeraiId } from "@/utils/ggsAPI";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

function getFormattedDate(date: Date): string {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
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

  async function getSealsByGerai() {
    const seals = await getSealsByGeraiId(decoded?.geraiId);
    setDataSeal(seals);
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
      }).then(() => {
        navigate("/auth/login", { replace: true });
      });
      return;
    }
    const decoded = decodeToken(token);
    getSealsByGerai();
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
      rawData = rawData
        .filter(
          (data: any) =>
            data.created_at.substring(2, 10).split("-").reverse().join("-") ==
            date
        )
        .filter((item: any) => item.gerai == decoded.gerai.name);
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
            nama: item.customer?.nama || item.nama || "kosong",
            plat: item.customer?.plat || item.plat_motor || "kosong",
            no_wa: item.customer?.no_wa || item.noWA || "kosong",
            layanan: item.layanan || "kosong",
            subcategory:
              item.jenis_motor || item.customer?.subcategory || "kosong",
            motor: item.motor || item.customer?.motor || "kosong",
            bagianMotor:
              item.bagian_motor || item.customer?.bagian_motor || "kosong",
            bagianMotor2:
              item.bagian_motor2 || item.customer?.bagian_motor || "kosong",
            hargaLayanan:
              item.harga_service || item.customer?.harga_layanan || 0,
            sparepart: item.sparepart,
            hargaSparepart: item.harga_sparepart ?? 0,
            totalHarga: item.totalHarga || item.customer?.total_harga || 0,
            status: item.status,
            gerai: item.gerai,
            sparepart_id: item.sparepart_id,
            waktu: item.created_at,
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

  const handleExport = () => {
    if (data.length == 0) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Ada Data",
        text: "Tidak ada data antrian untuk diekspor.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    // Transform data sesuai struktur layout yang diinginkan
    const dataExcel = data.map((group: any) => {
      return {
        gerai: group.gerai,
        data: group.data,
        totalAntrian: group.data.length,
      };
    });

    // Buat sheet data dengan format array of arrays sesuai layout asli
    const sheetData = dataExcel.flatMap((item: any) => {
      return item.data.length > 0
        ? [
            // Header gerai
            [
              `GERAI: ${decoded?.gerai.name}`,
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              `Total: ${item.totalAntrian} antrian`,
            ],
            // Header kolom
            [
              "No",
              "Nama",
              "Plat Nomor",
              "No WhatsApp",
              "Layanan",
              "Subkategori",
              "Motor",
              "Bagian Motor",
              "Harga Layanan",
              "Harga Seal",
              "Total Harga",
              "Status",
              "Waktu",
            ],
            // Data antrian
            ...item.data.map((row: TransformedAntrian, i: number) => [
              i + 1,
              row.nama || "-",
              row.plat || "-",
              row.no_wa || "-",
              row.layanan || "-",
              row.subcategory || "-",
              row.motor || "-",
              row.bagianMotor || "-",
              row.hargaLayanan
                ? `Rp ${row.hargaLayanan.toLocaleString("id-ID")}`
                : "Rp 0",
              row.hargaSeal
                ? `Rp ${row.hargaSeal.toLocaleString("id-ID")}`
                : "Rp 0",
              row.totalHarga
                ? `Rp ${row.totalHarga.toLocaleString("id-ID")}`
                : "Rp 0",
              row.status || "-",
              row.waktu
                ? new Date(row.waktu).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-",
            ]),
            [
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "SUBTOTAL:",
              `Rp ${item.data
                .reduce(
                  (sum: number, row: TransformedAntrian) =>
                    sum + (row.hargaLayanan || 0)+(row.hargaSeal || 0),
                  0
                )
                .toLocaleString("id-ID")}`,
              "",
              "",
            ],
            // Baris kosong
            ["", "", "", "", "", "", "", "", "", "", "", "", ""],
          ]
        : [
            // Jika tidak ada data
            [
              `GERAI: ${decoded?.gerai.name}`,
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "Total: 0 antrian",
            ],
            [
              "No",
              "Nama",
              "Plat Nomor",
              "No WhatsApp",
              "Layanan",
              "Subkategori",
              "Motor",
              "Bagian Motor",
              "Harga Layanan",
              "Harga Seal",
              "Total Harga",
              "Status",
              "Waktu",
            ],
            [
              "",
              "",
              "",
              "",
              "TIDAK ADA DATA ANTRIAN",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            ["", "", "", "", "", "", "", "", "", "", "", "", ""],
          ];
    });

    // // Tambahkan grand total
    // const grandTotal = data.reduce(
    //   (total, group) =>
    //     total +
    //     group.data.reduce((sum, item) => sum + (item.totalHarga || 0), 0),
    //   0
    // );
    // const totalAntrian = data.reduce(
    //   (total, group) => total + group.data.length,
    //   0
    // );

    // // Tambahkan baris grand total
    // sheetData.push(
    //   ["", "", "", "", "", "", "", "", "", "", "", "", ""],
    //   [
    //     "TOTAL KESELURUHAN",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "",
    //     "GRAND TOTAL:",
    //     `Rp ${grandTotal.toLocaleString("id-ID")}`,
    //     `${totalAntrian} Antrian`,
    //     selectedDate,
    //   ]
    // );

    // Buat worksheet dari array of arrays
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Set lebar kolom agar sesuai dengan konten
    worksheet["!cols"] = [
      { width: 5 }, // No
      { width: 20 }, // Nama
      { width: 12 }, // Plat
      { width: 15 }, // No WA
      { width: 15 }, // Layanan
      { width: 15 }, // Subkategori
      { width: 12 }, // Motor
      { width: 15 }, // Bagian Motor
      { width: 15 }, // Harga Layanan
      { width: 15 }, // Harga Seal
      { width: 15 }, // Total Harga
      { width: 10 }, // Status
      { width: 18 }, // Waktu
    ];

    // Styling untuk header dan total (opsional)
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    for (let row = range.s.r; row <= range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        const cell = worksheet[cellAddress];

        if (
          cell &&
          typeof cell.v === "string" &&
          (cell.v.startsWith("GERAI:") ||
            cell.v === "No" ||
            cell.v === "SUBTOTAL:" ||
            cell.v === "GRAND TOTAL:" ||
            cell.v === "TOTAL KESELURUHAN")
        ) {
          if (!cell.s) cell.s = {};
          cell.s.font = { bold: true };
        }
      }
    }

    // Buat workbook dan tambahkan worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Antrian");

    // Format nama file
    const formattedDate = selectedDate.replace(/\//g, "-");

    // Download file Excel
    XLSX.writeFile(workbook, `Laporan_Antrian_${formattedDate}_${decoded?.gerai.name.toUpperCase()}.xlsx`);

    // Notifikasi sukses
    Swal.fire({
      icon: "success",
      title: "Export Berhasil",
      text: `Data antrian tanggal ${selectedDate} berhasil diekspor ke Excel.`,
      timer: 2000,
      showConfirmButton: false,
    });
  };

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

  const handleFinish = async (id: number, sparepart_id: number) => {
    const sealSelected = dataSeal.find((item: any) => item.id === sparepart_id);
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
      if (sealSelected && sealSelected.qty)
        await updateSeal(sparepart_id, sealSelected?.qty - 1);
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
              <button
                onClick={handleExport}
                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition shadow-md"
                disabled={userRole === "CEO" || data.length === 0}
              >
                <Download className="w-5 h-5 mr-2" /> Download
              </button>
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
