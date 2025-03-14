import { useState, useEffect } from "react";

// Definisi interface
interface Motorcycle {
  ccRange: string;
  brand: string;
  model: string;
  price: number | null;
}

// Data array
const motorcycles: Motorcycle[] = [
  { ccRange: "110 - 125 CC", brand: "Honda", model: "Beat FI", price: 20000 },
  {
    ccRange: "110 - 125 CC",
    brand: "Honda",
    model: "Beat Street",
    price: 20000,
  },
  { ccRange: "110 - 125 CC", brand: "Honda", model: "Scoopy", price: 20000 },
  { ccRange: "110 - 125 CC", brand: "Honda", model: "Vario 125", price: 20000 },
  { ccRange: "110 - 125 CC", brand: "Honda", model: "Genio", price: 20000 },
  { ccRange: "110 - 125 CC", brand: "Honda", model: "Wave", price: 20000 },
  { ccRange: "110 - 125 CC", brand: "Yamaha", model: "Mio", price: 20000 },
  { ccRange: "110 - 125 CC", brand: "Yamaha", model: "Fino", price: 20000 },
  { ccRange: "110 - 125 CC", brand: "Yamaha", model: "Gear", price: 20000 },
  { ccRange: "110 - 125 CC", brand: "Yamaha", model: "Nouvo", price: 20000 },
  { ccRange: "110 - 125 CC", brand: "Suzuki", model: "Nex", price: 25000 },
  { ccRange: "110 - 125 CC", brand: "Suzuki", model: "Skywave", price: 25000 },
  { ccRange: "110 - 125 CC", brand: "Suzuki", model: "Axelo", price: 25000 },
  {
    ccRange: "110 - 125 CC",
    brand: "Suzuki",
    model: "Burgman 125",
    price: 60000,
  },
  { ccRange: "110 - 125 CC", brand: "Vespa", model: "LX 125", price: 60000 },
  { ccRange: "110 - 125 CC", brand: "Vespa", model: "S 125", price: 25000 },
  { ccRange: "110 - 125 CC", brand: "Kymco", model: "Like 125", price: 50000 },
  {
    ccRange: "110 - 125 CC",
    brand: "Kymco",
    model: "Downtown 125",
    price: 50000,
  },
  { ccRange: "150 - 160 CC", brand: "Honda", model: "ADV", price: 20000 },
  { ccRange: "150 - 160 CC", brand: "Honda", model: "PCX", price: 20000 },
  { ccRange: "150 - 160 CC", brand: "Honda", model: "Vario", price: 20000 },
  { ccRange: "150 - 160 CC", brand: "Yamaha", model: "Nmax", price: 20000 },
  { ccRange: "150 - 160 CC", brand: "Yamaha", model: "Aerox", price: 20000 },
  { ccRange: "150 - 160 CC", brand: "Suzuki", model: "Burgman", price: 20000 },
  { ccRange: "150 - 160 CC", brand: "Suzuki", model: "Access", price: 60000 },
  { ccRange: "150 - 160 CC", brand: "Vespa", model: "LX 150", price: 20000 },
  { ccRange: "150 - 160 CC", brand: "Vespa", model: "S 150", price: 25000 },
  {
    ccRange: "150 - 160 CC",
    brand: "Kymco",
    model: "Downtown 150",
    price: 50000,
  },
  { ccRange: "150 - 160 CC", brand: "Kymco", model: "Like 150", price: 50000 },
];
interface HargaProps {
  setHarga?: (address: number) => void;
}
// Komponen React
const SealPricePicker = ({ setHarga }: HargaProps) => {
  // State untuk melacak pilihan pengguna
  const [selectedCcRange, setSelectedCcRange] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Reset brand dan model saat ccRange berubah
  useEffect(() => {
    setSelectedBrand(null);
    setSelectedModel(null);
  }, [selectedCcRange]);

  // Reset model saat brand berubah
  useEffect(() => {
    setSelectedModel(null);
  }, [selectedBrand]);

  // Fungsi untuk mendapatkan daftar unik ccRange
  const getUniqueCcRanges = (): string[] => {
    const ccRanges = motorcycles.map((m) => m.ccRange);
    return [...new Set(ccRanges)];
  };

  // Fungsi untuk mendapatkan daftar unik brand berdasarkan ccRange
  const getUniqueBrands = (ccRange: string): string[] => {
    const brands = motorcycles
      .filter((m) => m.ccRange === ccRange)
      .map((m) => m.brand);
    return [...new Set(brands)];
  };

  // Fungsi untuk mendapatkan daftar model berdasarkan ccRange dan brand
  const getModels = (ccRange: string, brand: string): string[] => {
    return motorcycles
      .filter((m) => m.ccRange === ccRange && m.brand === brand)
      .map((m) => m.model);
  };

  // Mencari motor yang dipilih untuk mendapatkan harga
  const selectedMotorcycle: any =
    selectedCcRange && selectedBrand && selectedModel
      ? motorcycles.find(
          (m) =>
            m.ccRange === selectedCcRange &&
            m.brand === selectedBrand &&
            m.model === selectedModel
        )
      : null;
  selectedMotorcycle && setHarga?.(selectedMotorcycle.price);

  return (
    <div >
      {/* Pilih Kapasitas Mesin */}
      <div style={{ marginBottom: "20px" }}>
        <select
          value={selectedCcRange || ""}
          onChange={(e) => setSelectedCcRange(e.target.value || null)}
          className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
        >
          <option value="">Pilih Seal</option>
          {getUniqueCcRanges().map((cc) => (
            <option key={cc} value={cc}>
              {cc}
            </option>
          ))}
        </select>
      </div>

      {/* Pilih Brand, muncul hanya jika ccRange sudah dipilih */}
      {selectedCcRange && (
        <div style={{ marginBottom: "20px" }}>
          <select
            value={selectedBrand || ""}
            onChange={(e) => setSelectedBrand(e.target.value || null)}
            className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
          >
            <option value="">Pilih Brand</option>
            {getUniqueBrands(selectedCcRange).map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Pilih Model, muncul hanya jika brand sudah dipilih */}
      {selectedCcRange && selectedBrand && (
        <div style={{ marginBottom: "20px" }}>
          <select
            value={selectedModel || ""}
            onChange={(e) => setSelectedModel(e.target.value || null)}
            className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
          >
            <option value="">Pilih Model</option>
            {getModels(selectedCcRange, selectedBrand).map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SealPricePicker;
