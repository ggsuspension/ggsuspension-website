import { useState } from "react";

// Data array berdasarkan foto

function SelectOptionSeal({ hargaSeal }: any) {
  // State untuk menampung pilihan user
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<any>("");
  const [selectedTipeSubIndex, setSelectedTipeSubIndex] = useState("");
  const [selectedHargaIndex, setSelectedHargaIndex] = useState<any>("");

  // Objek "kategori" yang dipilih
  const selectedItem =
    selectedCategoryIndex !== "" ? hargaSeal[selectedCategoryIndex] : null;

  // Menentukan apakah kita punya 'tipe' array atau 'subkategori'
  let tipeSubOptions: any = [];
  if (selectedItem) {
    if (Array.isArray(selectedItem.tipe)) {
      // Jika tipe adalah array
      tipeSubOptions = selectedItem.tipe;
    } else if (selectedItem.subkategori) {
      // Jika hanya ada satu subkategori (string)
      tipeSubOptions = [selectedItem.subkategori];
    }
  }

  // Apakah perlu menampilkan select kedua
  const showTipeSubSelect = tipeSubOptions.length > 0;

  // Harga bisa berupa object atau array
  let hargaData = selectedItem ? selectedItem.harga : null;

  // Variabel untuk menampilkan hasil
  let result = "";

  // Jika harga adalah array, siapkan option untuk select ketiga
  let hargaOptions: any = [];
  if (hargaData) {
    if (Array.isArray(hargaData)) {
      // Kita punya beberapa pilihan harga
      hargaOptions = hargaData.map((h) => {
        const label = h.subkategori
          ? `${h.subkategori} (${h.qty} - ${h.range})`
          : `(${h.qty} - ${h.range})`;
        return label;
      });

      if (selectedHargaIndex !== "") {
        const selectedHargaObj = hargaData[selectedHargaIndex];
        result = `Qty: ${selectedHargaObj.qty}, Range: ${selectedHargaObj.range}`;
      }
    } else {
      if (!showTipeSubSelect || selectedTipeSubIndex !== "") {
        result = `Qty: ${hargaData.qty}, Range: ${hargaData.range}`;
      }
    }
  }

  // Handler untuk select Kategori
  const handleCategoryChange = (e: any) => {
    setSelectedCategoryIndex(e.target.value);
    setSelectedTipeSubIndex("");
    setSelectedHargaIndex("");
  };

  // Handler untuk select Tipe/Subkategori
  const handleTipeSubChange = (e: any) => {
    setSelectedTipeSubIndex(e.target.value);
    setSelectedHargaIndex("");
  };

  // Handler untuk select Harga (jika harga array)
  const handleHargaChange = (e: any) => {
    setSelectedHargaIndex(e.target.value);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Multi-level Select Harga Seal</h1>
      {/* Select Kategori */}
      <div>
        <label htmlFor="kategoriSelect" className="block mb-2 font-semibold">
          Pilih Kategori:
        </label>
        <select
          id="kategoriSelect"
          className="border border-gray-300 rounded px-2 py-1 w-full max-w-md"
          value={selectedCategoryIndex}
          onChange={handleCategoryChange}
        >
          <option value="">-- Pilih Kategori --</option>
          {hargaSeal &&
            hargaSeal.map((item: any, index: number) => (
              <option key={index} value={index}>
                {item.kategori}
              </option>
            ))}
        </select>
      </div>

      {/* Select Tipe/Subkategori (hanya muncul jika ada tipe atau subkategori) */}
      {showTipeSubSelect && (
        <div>
          <label htmlFor="tipeSubSelect" className="block mb-2 font-semibold">
            Pilih Tipe / Subkategori:
          </label>
          <select
            id="tipeSubSelect"
            className="border border-gray-300 rounded px-2 py-1 w-full max-w-md"
            value={selectedTipeSubIndex}
            onChange={handleTipeSubChange}
          >
            <option value="">-- Pilih Tipe / Subkategori --</option>
            {tipeSubOptions.map((option: any, idx: any) => (
              <option key={idx} value={idx}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Select Harga (jika harga berupa array) */}
      {Array.isArray(hargaData) && (
        <div>
          <label htmlFor="hargaSelect" className="block mb-2 font-semibold">
            Pilih Harga:
          </label>
          <select
            id="hargaSelect"
            className="border border-gray-300 rounded px-2 py-1 w-full max-w-md"
            value={selectedHargaIndex}
            onChange={handleHargaChange}
          >
            <option value="">-- Pilih Harga --</option>
            {hargaOptions.map((optionLabel: any, idx: any) => (
              <option key={idx} value={idx}>
                {optionLabel}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Hasil */}
      {result && (
        <div
          id="result"
          className="mt-4 p-3 border border-green-300 rounded bg-green-50"
        >
          {result}
        </div>
      )}
    </div>
  );
}

export default SelectOptionSeal;
