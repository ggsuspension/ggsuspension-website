import { useMemo } from "react";
import { Seal } from "@/types";

// Define interfaces for props
interface SealPricePickerProps {
  setHarga: (harga: string) => void;
  seals: Seal[] | undefined;
  isCheckPricePage?: boolean;
  selectedSeal: string;
  setSelectedSeal: (sealId: string) => void;
  disabled?: boolean;
}

<<<<<<< HEAD
const SealPricePicker = ({
  setHarga,
  seals,
  isCheckPricePage = true,
  selectedSeal,
  setSelectedSeal,
  disabled = false,
}: SealPricePickerProps) => {
  // Memoize seals to prevent unnecessary re-renders
  const availableSeals = useMemo(() => seals || [], [seals]);
=======
// Data array
export const motorcycles: Motorcycle[] = [
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
>>>>>>> 779958a45086e399c5e2a32852ec5007782f8021

  // Handle seal selection
  const handleSealChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sealId = e.target.value;
    setSelectedSeal(sealId);

    // Find the selected seal and set its price
    const selected = availableSeals.find(
      (seal) => seal.id.toString() === sealId
    );
    const sealPrice = selected ? selected.price : 0;
    setHarga(sealPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
  };

  if (availableSeals.length === 0) {
    return (
      <p className="text-orange-500 text-sm">
        Tidak ada seal tersedia untuk motor ini.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <select
        className="w-full px-4 py-3 bg-white text-dark rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-800/90 focus:border-orange-500 transition-all duration-300 hover:bg-slate-200"
        value={selectedSeal}
        onChange={handleSealChange}
        disabled={disabled}
      >
        <option value="">Pilih Seal (Opsional)</option>
        {availableSeals.map((seal) => (
          <option key={seal.id} value={seal.id}>
            {seal.cc_range} (Rp. {seal.price.toLocaleString("id-ID")})
            {!isCheckPricePage && `, Stok: ${seal.qty}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SealPricePicker;
