import FooterSection from "../layouts/Footer";
import { useState } from "react";
import { getPelangganByDateRange } from "@/utils/ggAPI";
import Navbar from "../fragments/Navbar";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface LayananType {
  id: string;
  plat: string;
  tanggalLayanan: string;
  gerai: string;
  status: boolean;
  bagianMotor: string;
  motorPart: string;
  hargaLayanan: number;
  hargaSeal: string;
  info: string;
  layanan: string;
  motor: string;
  nama: string;
  noWA: string;
  seal: string;
  totalHarga: number;
  createdAt: string;
}

const KlaimGaransi = () => {
  const [plat, setPlat] = useState("");
  const [tanggalLayanan, setTanggalLayanan] = useState("");
  const [results, setResults] = useState<LayananType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDateForDisplay = (date: Date | string): string => {
    const d = new Date(date);
    const day = ("0" + d.getDate()).slice(-2);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  };

  const calculateWarrantyStatus = (
    tanggalLayanan: string,
    layanan: string,
    motorPart: string,
    status: boolean
  ): string => {
    if (!status) {
      console.log(
        `calculateWarrantyStatus: status=false, garansi tidak aktif karena pesanan belum selesai`
      );
      return "Tidak Aktif"; // Garansi hanya aktif jika status Finish
    }

    const layananDate = new Date(tanggalLayanan);
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - layananDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    console.log(
      `calculateWarrantyStatus: diffDays=${diffDays}, layanan='${layanan}', motorPart='${motorPart}', status=${status}`
    );

    if (!layanan || layanan === "-") {
      return diffDays > 90 ? "Tidak Aktif" : "Aktif"; // Default 90 hari
    }

    if (layanan.includes("REBOUND")) {
      if (motorPart.includes("DEPAN + BELAKANG")) {
        return diffDays > 180 ? "Tidak Aktif" : "Aktif"; // Rebound depan + belakang: 180 hari
      }
      if (motorPart.includes("DEPAN") || motorPart.includes("BELAKANG")) {
        return diffDays > 90 ? "Tidak Aktif" : "Aktif"; // Rebound depan atau belakang: 90 hari
      }
      return diffDays > 90 ? "Tidak Aktif" : "Aktif"; // Default rebound: 90 hari
    }
    if (layanan.includes("DOWNSIZE")) {
      return diffDays > 7 ? "Tidak Aktif" : "Aktif"; // Downsizing: 7 hari
    }
    if (layanan.includes("PERGANTIAN SIL")) {
      return diffDays > 14 ? "Tidak Aktif" : "Aktif"; // Pergantian sil: 14 hari
    }

    return diffDays > 90 ? "Tidak Aktif" : "Aktif"; // Default 90 hari
  };

  const fetchData = async (platInput: string, tanggalLayananStr: string) => {
    try {
      setLoading(true);
      setResults([]);
      setError("");

      // Gunakan tanggal layanan sebagai startDate dan endDate
      const startDateStr = formatDateForDisplay(tanggalLayananStr);
      const endDateStr = startDateStr;

      console.log("Mengambil data dari:", {
        startDate: startDateStr,
        endDate: endDateStr,
        plat: platInput,
      });

      const data = await getPelangganByDateRange(
        startDateStr,
        endDateStr,
        platInput
      );
      console.log("Data mentah dari API:", data);

      if (!data || data.length === 0) {
        setError("Data tidak ditemukan untuk plat dan tanggal tersebut.");
        setLoading(false);
        return;
      }

      setResults(data);
      setError("");
    } catch (err) {
      setError("Gagal mengambil data layanan.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // const normalizeString = (str: string): string => {
  //   return str.toLowerCase().replace(/\s+/g, "");
  // };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!plat.trim() || !tanggalLayanan.trim()) {
      setError("Plat kendaraan dan tanggal layanan wajib diisi.");
      return;
    }

    fetchData(plat, tanggalLayanan);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto p-6 mt-32 flex-1 flex flex-col gap-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-orange-500 hover:text-orange-600"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-lg font-normal">Kembali</span>
        </Link>

        <h1 className="text-4xl font-bold text-center mb-8 text-dark">
          Cek Status Garansi
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="plat"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Plat Kendaraan
                </label>
                <input
                  id="plat"
                  type="text"
                  placeholder="Masukkan plat kendaraan (contoh: B 8999 BVA)"
                  value={plat}
                  onChange={(e) => setPlat(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="tanggalLayanan"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Tanggal Layanan
                </label>
                <input
                  id="tanggalLayanan"
                  type="date"
                  value={tanggalLayanan}
                  onChange={(e) => setTanggalLayanan(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium p-3 rounded-lg mt-4"
                disabled={loading}
              >
                {loading ? "Mencari..." : "Cek Status"}
              </button>
            </form>
            {error && <p className="text-center text-red-600 mt-4">{error}</p>}
          </div>

          {/* Results Section */}
          <div className="bg-white p-8 overflow-y-auto max-h-[600px]">
            {results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result) => {
                  const warrantyStatus = calculateWarrantyStatus(
                    result.createdAt,
                    result.layanan,
                    result.motorPart,
                    result.status
                  );
                  console.log(
                    `Rendering result id: ${result.id}, warrantyStatus: ${warrantyStatus}, status: ${result.status}`
                  );
                  return (
                    <div key={result.id} className="border-b pb-4">
                      <div className="text-lg font-semibold mb-2 flex justify-between items-center">
                        <span>{result.nama}</span>
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-bold ${
                            warrantyStatus === "Aktif"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {warrantyStatus}
                        </span>
                      </div>
                      <table className="w-full text-sm text-left">
                        <tbody>
                          {[
                            { label: "Plat Kendaraan", value: result.plat },
                            {
                              label: "Tanggal Layanan",
                              value: result.tanggalLayanan,
                            },
                            { label: "Gerai", value: result.gerai },
                            { label: "Layanan", value: result.layanan },
                            {
                              label: "Bagian Motor",
                              value: result.bagianMotor,
                            },
                            {
                              label: "Harga Layanan",
                              value: `Rp. ${result.hargaLayanan}`,
                            },
                            {
                              label: "Harga Seal",
                              value: `Rp. ${result.hargaSeal}`,
                            },
                            { label: "Info", value: result.info },
                            { label: "Motor", value: result.motor },
                            { label: "No WA", value: result.noWA },
                            { label: "Seal", value: result.seal },
                            {
                              label: "Total Harga",
                              value: `Rp. ${result.totalHarga}`,
                            },
                            {
                              label: "Status Pesanan",
                              value: result.status ? "Finish" : "Progress",
                            },
                          ].map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="py-2 font-medium text-gray-700">
                                {item.label}
                              </td>
                              <td className="py-2 text-gray-600">
                                {item.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center flex flex-col items-center">
                <img
                  src="./search_cbur.svg"
                  alt="Please Scanning..."
                  className="w-96 mb-4 text-orange-500"
                />
                <p className="text-gray-500">Belum ada hasil cek status.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default KlaimGaransi;
