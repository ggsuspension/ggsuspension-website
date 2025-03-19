import { dataListMotor } from "@/utils/dataListMotor";
import { Wrench } from "lucide-react";
import { useState } from "react";
import { PiMoneyWavy } from "react-icons/pi";
import SealPricePicker from "./SealPricePicker";

export default function CekHargaSection() {
  const listMotor = dataListMotor.layanan;
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
  const [hargaSeal, setHargaSeal] = useState<any>(undefined);

  const SEMUA_LAYANAN = [
    "REBOUND",
    "DOWNSIZE",
    "MAINTENANCE",
    "PAKET REBOUND & DOWNSIZE",
  ];

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
    info: "",
    bagianMotor2: "",
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
    setIsTextBagianMotor2(false);
    setIsBagianMotor("");
  }

  function setSelectBagianMotor(e: any) {
    setHarga(undefined);
    setTextBagianMotor(e.target.value);
    setIsMotor("");
    setIsTextBagianMotor2(false);
    setIsBagianMotor(undefined);
  }

  const [textBagianMotor2, setTextBagianMotor2] = useState("");
  const [isTextBagianMotor2, setIsTextBagianMotor2] = useState(false);

  function setSelectMotor(e: any) {
    setIsMotor(undefined);
    setMotor(e.target.value);
    let res = listMotor?.filter((motor: any) => motor.category == textLayanan);
    res = res?.filter((motor: any) => motor.subcategory == textJenisMotor);
    res = res?.filter((motor: any) => motor.service == textBagianMotor);
    let priceBasic = res[0]
      ? res[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      : "";
    if (textJenisMotor && textJenisMotor.includes("OHLINS")) {
      const priceBasic = jenisMotor[0]
        ? jenisMotor[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        : "";
      setHarga(priceBasic);
    }

    if (textBagianMotor2) {
      let res = listMotor?.filter(
        (motor: any) => motor.category == textLayanan
      );
      res = res?.filter((motor: any) => motor.subcategory == textJenisMotor);
      res = res?.filter((motor: any) => motor.service == textBagianMotor2);
      return setHarga(
        (Number(priceBasic.replace(".", "")) + res[0].price)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      );
    }
    setHarga(priceBasic);
  }

  const hargaNumber = harga && Number(harga.replace(".", ""));

  return (
    <section id="cek_harga" className="relative">
      <div className="max-w-7xl mx-auto mb-4 tablet:mb-0">
        <Wrench className="absolute opacity-10 top-1/2 right-5 w-32 h-32 rotate-12 tablet:hidden" />
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mt-10 px-4">
            <div className="">
              <h2 className="text-2xl text-gray-800 font-medium">
                CEK HARGA <PiMoneyWavy className="inline rotate-[135deg]" />
              </h2>
              <h1 className="text-3xl text-gray-800 font-bold">
                PILIH LAYANAN UNTUK CEK HARGA
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/* Products Section */}
      <div className="px-4 tablet:p-6 max-w-7xl mx-auto">
        <div className="">
          {/* TTX Product */}
          <div className="flex gap-2 tablet:gap-4">
            <img
              src="./mekanik.jpg"
              className="block w-1/4 tablet:w-3/4 tablet:h-[30em] object-cover object-center rounded-lg"
            />
            <div className="h-fit p-4 bg-orange-500 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
              <form className="space-y-4">
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

                <div className="flex justify-between gap-3">
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
                  <span
                    onClick={() => {
                      setIsTextBagianMotor2(!isTextBagianMotor2);
                      setTextBagianMotor2("");
                      if (isTextBagianMotor2) setIsMotor("");
                      setHarga(undefined);
                    }}
                    className="bg-orange-400 flex justify-center  w-10 h-10 rounded-full text-2xl text-white cursor-pointer font-bold"
                  >
                    {isTextBagianMotor2 ? "-" : "+"}
                  </span>
                </div>

                {isTextBagianMotor2 && (
                  <div>
                    <select
                      className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                      required
                      onChange={(e) => {
                        setTextBagianMotor2(e.target.value);
                        setFormData({
                          ...formData,
                          bagianMotor2: e.target.value,
                        });
                        setIsMotor("");
                      }}
                      id=""
                      disabled={jenisMotor ? false : true}
                      defaultValue={""}
                      value={textBagianMotor2 && textBagianMotor2}
                    >
                      <option disabled value="">
                        Pilih Bagian Motor Lainnya
                      </option>
                      {jenisMotor?.map((motor: any, i: number) => (
                        <option key={i} value={motor.service}>
                          {motor.service}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
            

                <div>
                  <select
                    className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                    required
                    onChange={setSelectMotor}
                    id=""
                    disabled={jenisMotor ? false : true}
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

                {motor == "Lainnya" && !textJenisMotor?.includes("OHLINS") && (
                  <input
                    required
                    type="text"
                    placeholder="Tulis Nama Motor"
                    className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                  />
                )}

                <SealPricePicker
                  setHarga={(hargaSeal: any) => {
                    setHargaSeal(hargaSeal);
                  }}
                />

                <div></div>
                <div>
                  <span className="flex justify-center text-center font-bold text-lg text-white">
                    {harga && hargaSeal && (
                      <span className="flex gap-1">
                        <p>{Number(harga.replace(".", ""))}</p> <p>+</p>
                        <p>{hargaSeal}</p>
                      </span>
                    )}
                  </span>
                  {harga && (
                    <p className="text-center font-bold text-xl text-yellow-300">
                      Total Harga :{" "}
                      {!hargaSeal
                        ? harga
                        : (hargaNumber + hargaSeal)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
