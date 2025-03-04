import { useState } from "react";
import { kirimPesan } from "./TextToWA";
import { BsSendFill } from "react-icons/bs";
import { PiMoneyWavy } from "react-icons/pi";

export default function CekHargaSection({
  hargaLayanan,
  hargaSeal,
  gerai,
}: any) {
  const SEMUA_LAYANAN = [
    "REBOUND",
    "DOWNSIZE",
    "MAINTENANCE",
    "PAKET REBOUND & DOWNSIZE",
  ];
  const listMotor = hargaLayanan;
  const [layanan, setLayanan] = useState<any>(undefined);
  const [jenisMotor, setJenisMotor] = useState<any>(undefined);
  // const [bagianMotor, setBagianMotor] = useState<any>(undefined);
  const [motor, setMotor] = useState<any>(undefined);
  const [textLayanan, setTextLayanan] = useState<any>(undefined);
  const [textJenisMotor, setTextJenisMotor] = useState<any>(undefined);
  const [textBagianMotor, setTextBagianMotor] = useState<any>(undefined);
  const [harga, setHarga] = useState<any>(undefined);
  const [isMotor, setIsMotor] = useState<any>(undefined);
  const [isBagianMotor, setIsBagianMotor] = useState<any>(undefined);
  const [isJenisMotor, setisJenisMotor] = useState<any>(undefined);

  function setSelectLayanan(e: any) {
    setHarga(undefined);
    const res = listMotor?.filter(
      (motor: any) => motor.category == e.target.value
    );
    let result: any = [];
    res.forEach((item: any) => {
      if (!result.find((u: any) => u.subcategory === item.subcategory)) {
        result.push(item);
      }
    });
    setLayanan(result);
    setTextLayanan(e.target.value);
    setIsMotor("");
    setIsBagianMotor("");
    setisJenisMotor("");
  }
  function setSelectJenisMotor(e: any) {
    setHarga(undefined);
    let res = listMotor?.filter((motor: any) => motor.category == textLayanan);
    res = res.filter((motor: any) => motor.subcategory == e.target.value);
    setTextJenisMotor(e.target.value);
    setisJenisMotor(undefined);
    setJenisMotor(res);
    setIsMotor("");
    setIsBagianMotor("");
  }

  function setSelectBagianMotor(e: any) {
    setHarga(undefined);
    setTextBagianMotor(e.target.value);
    setIsMotor("");
    setIsBagianMotor(undefined);
  }

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
  let hargaData = selectedItem ? selectedItem.harga : 0;

  // Variabel untuk menampilkan hasil

  // Jika harga adalah array, siapkan option untuk select ketiga
  let hargaOptions: any = [];
  // let res = "";
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
        hargaData = hargaData[selectedHargaIndex];
      }

      //   if (selectedHargaIndex !== "") {
      //     const selectedHargaObj = hargaData[selectedHargaIndex];
      //     res = `Qty: ${selectedHargaObj.qty}, Range: ${selectedHargaObj.range}`;
      //   }
      // } else {
      //   if (!showTipeSubSelect || selectedTipeSubIndex !== "") {
      //     res = `Qty: ${hargaData.qty}, Range: ${hargaData.range}`;
      //   }
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
  function setSelectMotor(e: any) {
    setIsMotor(undefined);
    setMotor(e.target.value);
    if (textLayanan && textJenisMotor && textBagianMotor) {
      let res = listMotor?.filter(
        (motor: any) => motor.category == textLayanan
      );
      res = res?.filter((motor: any) => motor.subcategory == textJenisMotor);
      res = res?.filter((motor: any) => motor.service == textBagianMotor);
      const priceBasic = res[0]
        ? res[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        : "";
      if (textJenisMotor && textJenisMotor.includes("OHLINS")) {
        const priceBasic = jenisMotor[0]
          ? jenisMotor[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          : "";
        if (hargaData.range) {
          if (!hargaData.range.length) {
            let price = jenisMotor[0].price + hargaData.range;
            price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return setHarga(price);
          }
          let price = jenisMotor[0].price + hargaData.range[1];
          price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          return setHarga(price);
        }
        setHarga(priceBasic);
      }
      if (hargaData.range) {
        if (!hargaData.range.length) {
          let price = res[0].price + hargaData.range;
          price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          return setHarga(price);
        }
        let price = res[0].price + hargaData.range[1];
        price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return setHarga(price);
      }
      setHarga(priceBasic);
    }

    if (hargaData.range) {
      if (!hargaData.range.length) {
        let price = hargaData.range;
        price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return setHarga(price);
      }
      let price = hargaData.range[1];
      price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      return setHarga(price);
    }
  }

  const hargaSealNumber =
    hargaData.range && hargaData.range.length > 0
      ? hargaData.range[1]
      : hargaData.range;
  const hargaNumber = harga && Number(harga.replace(".", ""));

  return (
    <div id="harga">
      <div className="flex tablet:flex-row flex-col justify-center tablet:gap-12 gap-3 items-center bg-gray-50 py-[8em] relative">
        <PiMoneyWavy className="absolute top-5 left-8 text-5xl rotate-45" />
        <PiMoneyWavy className="absolute top-5 right-3 text-3xl rotate-[-45deg]" />
        <PiMoneyWavy className="absolute top-5 right-8 text-5xl rotate-[-45deg]" />
        <PiMoneyWavy className="absolute bottom-5 right-1 text-2xl rotate-[-45deg]" />
        <PiMoneyWavy className="absolute bottom-1/2 left-0 text-xl rotate-45" />
        <PiMoneyWavy className="absolute bottom-5 left-3 text-4xl rotate-45" />
        <p className="tablet:text-6xl text-4xl w-[4em] font-extrabold tracking-widest tablet:text-right">
          CEK <span className="text-yellow-400">HARGA</span>
        </p>
        <div className="flex gap-5 flex-col tablet:w-1/4 px-4">
          <span>
            <p className="font-semibold text-xl">Layanan</p>
            <select
              className="w-full text-lg bg-white"
              onChange={setSelectLayanan}
              name="nama_layanan"
              id=""
            >
              <option value="">Pilih Layanan</option>
              {SEMUA_LAYANAN.map((layanan, i) => (
                <option key={i} value={layanan}>
                  {layanan}
                </option>
              ))}
            </select>
          </span>
          <span>
            <p className="font-semibold text-xl">Jenis Motor</p>
            <select
              className="w-full text-lg bg-white"
              onChange={setSelectJenisMotor}
              value={isJenisMotor && isJenisMotor}
              disabled={layanan ? false : true}
              id=""
            >
              <option disabled value="">
                Pilih Jenis Motor
              </option>
              {layanan?.map((motor: any, i: number) => (
                <option key={i} value={motor.subcategory}>
                  {motor.subcategory}
                </option>
              ))}
            </select>
          </span>
          <span>
            <p className="font-semibold text-xl">Bagian Motor</p>
            <select
              className="w-full text-lg bg-white"
              onChange={setSelectBagianMotor}
              id=""
              value={isBagianMotor && isBagianMotor}
              disabled={jenisMotor ? false : true}
            >
              <option disabled value="">
                Pilih Bagian Motor
              </option>
              {jenisMotor?.map((motor: any, i: number) => (
                <option key={i} value={motor.service}>
                  {motor.service}
                </option>
              ))}
            </select>
          </span>
          <span>
            <p className="font-semibold text-xl">Motor</p>
            <select
              className="w-full text-lg bg-white"
              onChange={setSelectMotor}
              id=""
              disabled={jenisMotor ? false : true}
              value={isMotor && isMotor}
            >
              <option disabled value="">
                Pilih Motor
              </option>
              {!textJenisMotor?.includes("OHLINS") &&
                jenisMotor?.length > 0 &&
                jenisMotor[0].motor.map((motor: any, i: number) => (
                  <option key={i} value={motor}>
                    {motor}
                  </option>
                ))}
              <option value="">Lainnya</option>
            </select>
          </span>
          <div className="container mx-auto px-4 flex flex-col gap-4 bg-slate-200 py-4 rounded-lg">
            {/* Select Kategori */}
            <div>
              <span className="flex justify-between">
                <h1 className="text-xl font-semibold">Seal</h1>
                <p className="text-red-500 font-semibold">(optional)</p>
              </span>
              <select
                id="kategoriSelect"
                className="border border-gray-300 rounded px-2 w-full max-w-md text-lg"
                value={selectedCategoryIndex}
                onChange={handleCategoryChange}
              >
                <option disabled value="">
                  Pilih Kategori
                </option>
                <option value="">Batalkan</option>
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
                <label
                  htmlFor="tipeSubSelect"
                  className="block font-semibold text-xl"
                >
                  Pilih Tipe / Subkategori:
                </label>
                <select
                  id="tipeSubSelect"
                  className="border border-gray-300 rounded px-2 py-1 w-full max-w-md text-lg"
                  value={selectedTipeSubIndex}
                  onChange={handleTipeSubChange}
                >
                  <option disabled value="">
                    Pilih Tipe / Subkategori
                  </option>
                  {tipeSubOptions.map((option: any, idx: any) => (
                    <option key={idx} value={idx}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Select Harga (jika harga berupa array) */}
            {(hargaData.length > 0 || selectedHargaIndex) && (
              <div>
                <label
                  htmlFor="hargaSelect"
                  className="block mb-2 font-semibold"
                >
                  Pilih Harga:
                </label>
                <select
                  id="hargaSelect"
                  className="border border-gray-300 rounded px-2 py-1 w-full max-w-md text-lg"
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
          </div>
        </div>

        {harga && (
          <span className="flex justify-center gap-4 items-center mt-8">
            <div>
              <span className="flex justify-center text-center font-bold text-lg">
                {harga && hargaSealNumber && (
                  <span className="flex gap-1">
                    <p>{hargaNumber - hargaSealNumber}</p> <p>+</p>{" "}
                    <p>{hargaSealNumber}</p>
                  </span>
                )}
              </span>
              {harga && (
                <p className="text-center font-bold text-xl text-green-700">
                  Total Harga : {harga}
                </p>
              )}
              {hargaData != 0 && (
                <p className="text-md text-red-500 text-center">
                  ( harga seal hanya estimasi )
                </p>
              )}
            </div>
            <span
              onClick={() => {
                if (hargaData.range) {
                  kirimPesan(
                    gerai,
                    `Halo min! saya mau layanan ${textLayanan}, ${textJenisMotor}, bagian ${textBagianMotor}, motor ${motor}, dan ingin membeli seal dengan kategori ${tipeSubOptions}, dengan harga ${harga}`
                  );
                } else {
                  kirimPesan(
                    gerai,
                    `Halo min! saya mau layanan ${textLayanan}, ${textJenisMotor}, bagian ${textBagianMotor}, motor ${motor}, dengan harga ${harga}`
                  );
                }
              }}
              className="bg-green-500 text-md  tablet:text-xl text-white p-2 rounded-lg font-medium flex gap-2 items-center cursor-pointer"
            >
              Lanjut WA <BsSendFill />
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
