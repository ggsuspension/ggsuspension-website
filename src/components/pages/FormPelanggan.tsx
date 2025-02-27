import { setDataPelanggan } from "@/firebase/service";
import { dataListMotor } from "@/utils/dataListMotor";
import { setCookie } from "@/utils/setCookie";
import { useEffect, useState } from "react";

const FormPelanggan = () => {
  const listMotor = dataListMotor.layanan;
  const [layanan, setLayanan] = useState<any>(undefined);
  const [jenisMotor, setJenisMotor] = useState<any>(undefined);
  // const [bagianMotor, setBagianMotor] = useState<any>(undefined);
  const [motor, setMotor] = useState<any>(undefined);
  const [textLayanan, setTextLayanan] = useState<any>(undefined);
  const [textJenisMotor, setTextJenisMotor] = useState<any>(undefined);
  const [textBagianMotor, setTextBagianMotor] = useState<any>(undefined);
  const [harga, setHarga] = useState<any>(undefined);
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
    harga: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmit(true);
    formData.id = formData.nama + Math.random().toString().substring(3, 8);
    formData.layanan = textLayanan;
    formData.jenisMotor=textJenisMotor;
    formData.bagianMotor=textBagianMotor;
    formData.motor=motor;
    formData.harga=harga;
    setDataPelanggan(formData).then((res) => {
      if (res?.gerai) {
        const response = setCookie(
          "pelangganGGSuspension",
          JSON.stringify(res)
        );
        if (response.status) window.location.href=`/#/antrian/${res.gerai.toLowerCase()}`;
      }
    });
  };

  function setSelectLayanan(e: any) {
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
  }
  function setSelectJenisMotor(e: any) {
    let res = listMotor?.filter((motor: any) => motor.category == textLayanan);
    res = res.filter((motor: any) => motor.subcategory == e.target.value);
    setTextJenisMotor(e.target.value);
    setJenisMotor(res);
  }

  function setSelectBagianMotor(e: any) {
    setTextBagianMotor(e.target.value);
  }
  function setSelectMotor(e: any) {
    setMotor(e.target.value);
  }

  useEffect(()=>{
    if (textLayanan && textJenisMotor && textBagianMotor && motor) {
      let res = listMotor?.filter(
        (motor: any) => motor.category == textLayanan
      );
      res = res?.filter((motor: any) => motor.subcategory == textJenisMotor);
      res = res?.filter((motor: any) => motor.service == textBagianMotor);
      const priceBasic = res[0]
        ? res[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        : "";
      setHarga(priceBasic);
    }
  },[textLayanan, textJenisMotor, textBagianMotor, motor])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9d712] to-[#d38508]">
      {isSubmit && (
        <div className="h-full w-full fixed z-10 bg-black opacity-70"></div>
      )}
      <div className="glass-container bg-white backdrop-blur-lg rounded-2xl p-8 md:p-10 shadow-2xl border border-white/20 w-full max-w-md mx-4">
        <h1 className="text-black text-2xl md:text-3xl font-bold text-center mb-8 drop-shadow-md">
          Form Pelanggan
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
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
            >
              <option value="">
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
              onChange={setSelectJenisMotor}
              disabled={layanan ? false : true}
              id=""
            >
              <option value="">
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
            >
              <option value="">
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
              disabled={jenisMotor ? false : true}
            >
              <option value="">
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
          </div>

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
          <div>{harga&& <p className="text-green-600 text-center font-bold text-xl">Harga : {harga}</p>}</div>

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
