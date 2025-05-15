import { useMemo } from "react";
import { Sparepart } from "@/types";

// Define interfaces for props
interface SealPricePickerProps {
  setHarga: (harga: string) => void;
  seals: Sparepart[] | undefined;
  isCheckPricePage?: boolean;
  selectedSeal: string;
  setSelectedSeal: (sealId: string) => void;
  disabled?: boolean;
}

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
            {seal.category} (Rp. {seal.price.toLocaleString("id-ID")})
            {!isCheckPricePage && `, Stok: ${seal.qty}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SealPricePicker;
