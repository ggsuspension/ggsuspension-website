import FooterSection from "../layouts/Footer";
import { useState, useEffect } from "react";
import { getDocsFromDateRange } from "@/firebase/service";
import Navbar from "../fragments/Navbar";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface LayananType {
  id: string;
  plat: string;
  tanggalLayanan: string;
  gerai: string;
  status: string;
  bagianMotor: string;
  bagianMotor2: string;
  hargaLayanan: number;
  hargaSeal: string;
  info: string;
  jenisMotor: string;
  layanan: string;
  motor: string;
  nama: string;
  noWA: string;
  seal: string;
  totalHarga: number;
  waktu: number;
}

const KlaimGaransi = () => {
  const [plat, setPlat] = useState("");
  const [tanggalLayanan, setTanggalLayanan] = useState("");
  const [results, setResults] = useState<LayananType[]>([]);
  const [allData, setAllData] = useState<LayananType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatDateForDisplay = (date: Date): string => {
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  };

  const formatDateForComparison = (dateString: string): string => {
    const date = new Date(dateString);
    return formatDateForDisplay(date);
  };

  const calculateWarrantyStatus = (
    tanggalLayanan: string,
    bagianMotor: string
  ): string => {
    const layananDate = new Date(tanggalLayanan);
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - layananDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    if (
      bagianMotor.includes("REBOUND DEPAN") ||
      bagianMotor.includes("REBOUND BELAKANG")
    ) {
      return diffDays > 90 ? "Tidak Aktif" : "Aktif";
    }
    if (bagianMotor.includes("REBOUND DEPAN + BELAKANG")) {
      return diffDays > 180 ? "Tidak Aktif" : "Aktif";
    }
    if (bagianMotor.includes("DOWNSIZE")) {
      return diffDays > 7 ? "Tidak Aktif" : "Aktif";
    }
    if (bagianMotor.includes("PERGANTIAN SIL")) {
      return diffDays > 14 ? "Tidak Aktif" : "Aktif";
    }
    if (
      bagianMotor.includes("DEPAN STD") ||
      bagianMotor.includes("BAGIAN MOTOR: DEPAN STD")
    ) {
      return diffDays > 90 ? "Tidak Aktif" : "Aktif";
    }

    return "Tidak ada status";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        const data = await getDocsFromDateRange(startDate, endDate);

        const formattedData: LayananType[] = data.map((item) => {
          const data = item.data?.data || {};
          const gerai = item.data?.gerai || "Tidak ada gerai";
          const bagianMotor = data.bagianMotor || "-";
          const status = calculateWarrantyStatus(
            item.collection?.replace("data-layanan-", "") || "",
            bagianMotor
          );

          return {
            id: item.id || "Tidak ada ID",
            plat: data.plat || "Tidak ada plat",
            tanggalLayanan:
              item.collection?.replace("data-layanan-", "") ||
              "Tidak ada tanggal",
            gerai,
            status,
            bagianMotor,
            bagianMotor2: data.bagianMotor2 || "-",
            hargaLayanan: data.hargaLayanan || 0,
            hargaSeal: data.hargaSeal || "0",
            info: data.info || "Tidak ada info",
            jenisMotor: data.jenisMotor || "Tidak ada jenis motor",
            layanan: data.layanan || "Tidak ada layanan",
            motor: data.motor || "Tidak ada motor",
            nama: data.nama || "Tidak ada nama",
            noWA: data.noWA || "Tidak ada no WA",
            seal: data.seal || "false",
            totalHarga: data.totalHarga || 0,
            waktu: data.waktu || "Tidak ada waktu",
          };
        });

        setAllData(formattedData);
      } catch (err) {
        setError("Gagal mengambil data layanan.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const normalizeString = (str: string): string => {
    return str.toLowerCase().replace(/\s+/g, ""); // lowercase + remove all spaces
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!plat.trim() || !tanggalLayanan.trim()) {
      setError("Plat kendaraan dan tanggal layanan wajib diisi.");
      return;
    }

    const normalizedPlat = normalizeString(plat);
    const formattedTanggal = formatDateForComparison(tanggalLayanan);

    const filtered = allData.filter((item) => {
      const normalizedPlatData = normalizeString(item.plat);
      return (
        normalizedPlat === normalizedPlatData &&
        item.tanggalLayanan === formattedTanggal
      );
    });

    if (filtered.length === 0) {
      setError("Data tidak ditemukan.");
    } else {
      setResults(filtered);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* <NewNavigation /> */}
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
          Cek Klaim Garansi
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
                  placeholder="Masukkan plat kendaraan"
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
                {loading ? "Mencari..." : "Cek Klaim"}
              </button>
            </form>
            {error && <p className="text-center text-red-600 mt-4">{error}</p>}
          </div>

          {/* Results Section */}
          <div className="bg-white p-8 overflow-y-auto max-h-[600px]">
            {results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result) => (
                  <div key={result.id} className="border-b pb-4">
                    <div className="text-lg font-semibold mb-2 flex justify-between items-center">
                      <span>{result.nama}</span>
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-bold ${
                          result.status === "Aktif"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {result.status}
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
                          { label: "Bagian Motor", value: result.bagianMotor },
                          {
                            label: "Bagian Motor 2",
                            value: result.bagianMotor2,
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
                          { label: "Jenis Motor", value: result.jenisMotor },
                          { label: "Layanan", value: result.layanan },
                          { label: "Motor", value: result.motor },
                          { label: "No WA", value: result.noWA },
                          { label: "Seal", value: result.seal },
                          {
                            label: "Total Harga",
                            value: `Rp. ${result.totalHarga}`,
                          },
                          { label: "Waktu", value: result.waktu },
                        ].map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="py-2 font-medium text-gray-700">
                              {item.label}
                            </td>
                            <td className="py-2 text-gray-600">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center flex flex-col items-center">
                <img
                  src="./search_cbur.svg"
                  alt="Please Scanning..."
                  className="w-96 mb-4 text-orange-500"
                />
                <p className="text-gray-500">Belum ada hasil cek klaim.</p>
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
