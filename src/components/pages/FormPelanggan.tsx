import { setDataPelanggan } from "@/firebase/service";
import { dataListMotor } from "@/utils/dataListMotor";
import Cookies from "js-cookie";
import { useState } from "react";

const FormPelanggan = () => {
  const listMotor = dataListMotor.layanan;
  const hargaSeal: any = dataListMotor.seal;
  const [layanan, setLayanan] = useState<any>(undefined);
  const [jenisMotor, setJenisMotor] = useState<any>(undefined);
  const [motor, setMotor] = useState<any>(undefined);
  const [textLayanan, setTextLayanan] = useState<any>(undefined);
  const [textJenisMotor, setTextJenisMotor] = useState<any>(undefined);
  const [textBagianMotor, setTextBagianMotor] = useState<any>(undefined);
  const [harga, setHarga] = useState<any>(undefined);
  const [isMotor, setIsMotor] = useState<any>(undefined);
  const [isBagianMotor, setIsBagianMotor] = useState<any>(undefined);
  const [isJenisMotor, setisJenisMotor] = useState<any>(undefined);

  const SEMUA_LAYANAN = [
    "REBOUND",
    "DOWNSIZE",
    "MAINTENANCE",
    "PAKET REBOUND & DOWNSIZE",
  ];

  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    noWA: "",
    gerai: "",
    layanan: "",
    jenisMotor: "",
    bagianMotor: "",
    motor: "",
    hargaLayanan: 0,
    hargaSeal: "",
    totalHarga: "",
    seal: "",
    plat: "",
  });

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
      tipeSubOptions = selectedItem.tipe;
    } else if (selectedItem.subkategori) {
      tipeSubOptions = [selectedItem.subkategori];
    }
  }

  // Apakah perlu menampilkan select kedua
  const showTipeSubSelect = tipeSubOptions.length > 0;

  let hargaData = selectedItem ? selectedItem.harga : 0;
  let hargaOptions: any = [];
  if (hargaData) {
    if (Array.isArray(hargaData)) {
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmit(true);
    formData.id = formData.nama + Math.random().toString().substring(3, 8);
    formData.layanan = textLayanan;
    formData.jenisMotor = textJenisMotor;
    formData.bagianMotor = textBagianMotor;
    formData.motor = motor;
    formData.hargaLayanan = hargaSealNumber
      ? hargaNumber - hargaSealNumber
      : hargaNumber;
    formData.hargaSeal = hargaSealNumber ?? "0";
    formData.totalHarga = hargaNumber;
    formData.seal = selectedItem ? selectedItem.kategori : "false";
    setDataPelanggan(formData).then((res) => {
      Cookies.set("pelangganGGSuspension", JSON.stringify(res), {
        expires: 12 / 24,
      });
      setTimeout(()=>{
        window.location.href = `/#/antrian/${res?.gerai.toLowerCase()}`;
      },1000)
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9d712] to-[#d38508]">
      {isSubmit && (
        <div className="h-full w-full fixed z-10 bg-black top-0 opacity-70"></div>
      )}
      <div className="glass-container bg-white backdrop-blur-lg rounded-2xl p-8 md:p-10 shadow-2xl border border-white/20 w-full max-w-md mx-4">
        <h1 className="text-black text-2xl md:text-3xl font-bold text-center mb-6 drop-shadow-md">
          Form Pelanggan
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 tablet:gap-4">
            <input
              type="text"
              placeholder="Nama"
              required
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Plat Motor"
              required
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              value={formData.plat}
              onChange={(e) =>
                setFormData({ ...formData, plat: e.target.value })
              }
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="No WA"
              required
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              value={formData.noWA}
              onChange={(e) =>
                setFormData({ ...formData, noWA: e.target.value })
              }
            />
          </div>

          <div>
            <select
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              onChange={setSelectLayanan}
              name="nama_layanan"
              id=""
              required
              defaultValue={""}
            >
              <option disabled value="">
                Pilih Layanan
              </option>
              {SEMUA_LAYANAN.map((layanan, i) => (
                <option key={i} value={layanan}>
                  {layanan}
                </option>
              ))}
            </select>
          </div>
          <div>
            {" "}
            <select
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              required
              defaultValue={""}
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
          </div>

          <div>
            <select
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              required
              onChange={setSelectBagianMotor}
              id=""
              disabled={jenisMotor ? false : true}
              defaultValue={""}
              value={isBagianMotor && isBagianMotor}
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
          </div>

          <div>
            <select
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              required
              onChange={setSelectMotor}
              id=""
              defaultValue={""}
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
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <select
              id="kategoriSelect"
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              value={selectedCategoryIndex}
              onChange={handleCategoryChange}
            >
              <option disabled value="">
                Pilih Seal
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

          {showTipeSubSelect && (
            <div>
              <select
                id="tipeSubSelect"
                required
                className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
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

          {(hargaData.length > 0 || selectedHargaIndex) && (
            <div>
              <select
                required
                id="hargaSelect"
                className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                value={selectedHargaIndex}
                onChange={handleHargaChange}
              >
                <option value="">Pilih Harga</option>
                {hargaOptions.map((optionLabel: any, idx: any) => (
                  <option key={idx} value={idx}>
                    {optionLabel}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <select
              required
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent appearance-none transition-all"
              value={formData.gerai}
              onChange={(e) =>
                setFormData({ ...formData, gerai: e.target.value })
              }
            >
              <option value="" disabled className="bg-white text-black">
                Pilih Gerai
              </option>
              <option value="BEKASI" className="bg-white text-black">
                BEKASI (PUSAT)
              </option>
              <option value="TANGERANG" className="bg-white text-black">
                TANGERANG
              </option>
              <option value="DEPOK" className="bg-white text-black">
                DEPOK
              </option>
              <option value="JAKTIM" className="bg-white text-black">
                JAKTIM
              </option>
              <option value="CIKARANG" className="bg-white text-black">
                CIKARANG
              </option>
              <option value="BOGOR" className="bg-white text-black">
                BOGOR
              </option>
              <option value="JAKSEL" className="bg-white text-black">
                JAKSEL
              </option>
            </select>
          </div>
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

          <button
            type="submit"
            className="w-full py-3 bg-orange-400 text-white font-bold rounded-lg transition-all duration-300 uppercase tracking-wider cursor-pointer"
          >
            KIRIM
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPelanggan;
