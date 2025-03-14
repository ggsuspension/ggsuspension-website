import NewNavigation from "../fragments/NewNavigation";
import FooterSection from "../layouts/Footer";
import { useState, useEffect } from "react";
import { getDocsFromDateRange } from "@/firebase/service";

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
          const status = item.data?.status ? "Aktif" : "Tidak ada status";

          return {
            id: item.id || "Tidak ada ID",
            plat: data.plat || "Tidak ada plat",
            tanggalLayanan:
              item.collection?.replace("data-layanan-", "") ||
              "Tidak ada tanggal",
            gerai,
            status,
            bagianMotor: data.bagianMotor || "-",
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!plat.trim() || !tanggalLayanan.trim()) {
      setError("Plat kendaraan dan tanggal layanan wajib diisi.");
      return;
    }

    const formattedTanggal = formatDateForComparison(tanggalLayanan);

    const filtered = allData.filter(
      (item) =>
        item.plat.toLowerCase() === plat.toLowerCase() &&
        item.tanggalLayanan === formattedTanggal
    );

    if (filtered.length === 0) {
      setError("Data tidak ditemukan.");
    } else {
      setResults(filtered);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <NewNavigation />
      <div className="container mx-auto p-6 mt-24">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Cek Klaim Garansi
        </h1>
        <div className="flex">
          <div className="flex-1 w-64">
            <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="plat"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Plat Kendaraan
                  </label>
                  <input
                    id="plat"
                    type="text"
                    placeholder="Masukkan plat kendaraan"
                    value={plat}
                    onChange={(e) => setPlat(e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tanggalLayanan"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tanggal Layanan
                  </label>
                  <input
                    id="tanggalLayanan"
                    type="date"
                    value={tanggalLayanan}
                    onChange={(e) => setTanggalLayanan(e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-md mt-4"
                  disabled={loading}
                >
                  {loading ? "Mencari..." : "Cek Klaim"}
                </button>
              </form>
              {error && (
                <p className="text-center text-red-600 mt-4">{error}</p>
              )}
            </div>
          </div>
          <div className="flex-1 w-32">
            {results.length > 0 && (
              <div className="mt-8 space-y-4">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="bg-green-100 text-green-800 p-4 rounded-md shadow-md"
                  >
                    <h2 className="text-xl font-semibold">
                      Detail Klaim Garansi
                    </h2>
                    <div className="space-y-2 mt-4">
                      <p>
                        <strong>Plat Kendaraan:</strong> {result.plat}
                      </p>
                      <p>
                        <strong>Tanggal Layanan:</strong>{" "}
                        {result.tanggalLayanan}
                      </p>
                      <p>
                        <strong>Gerai:</strong> {result.gerai}
                      </p>
                      <p>
                        <strong>Status:</strong> {result.status}
                      </p>
                      <p>
                        <strong>Bagian Motor:</strong> {result.bagianMotor}
                      </p>
                      <p>
                        <strong>Bagian Motor 2:</strong> {result.bagianMotor2}
                      </p>
                      <p>
                        <strong>Harga Layanan:</strong> {result.hargaLayanan}
                      </p>
                      <p>
                        <strong>Harga Seal:</strong> Rp.{result.hargaSeal}
                      </p>
                      <p>
                        <strong>Info:</strong> {result.info}
                      </p>
                      <p>
                        <strong>Jenis Motor:</strong> {result.jenisMotor}
                      </p>
                      <p>
                        <strong>Layanan:</strong> {result.layanan}
                      </p>
                      <p>
                        <strong>Motor:</strong> {result.motor}
                      </p>
                      <p>
                        <strong>Nama:</strong> {result.nama}
                      </p>
                      <p>
                        <strong>No WA:</strong> {result.noWA}
                      </p>
                      <p>
                        <strong>Seal:</strong> {result.seal}
                      </p>
                      <p>
                        <strong>Total Harga:</strong> {result.totalHarga}
                      </p>
                      <p>
                        <strong>Waktu:</strong> {result.waktu}
                      </p>
                    </div>
                  </div>
                ))}
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
