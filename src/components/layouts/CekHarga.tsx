import { Wrench } from "lucide-react";
import { PiMoneyWavy } from "react-icons/pi";
import { useState, useEffect, useMemo } from "react";
import SealPricePicker from "./SealPricePicker";
import {
  getServices,
  getServiceTypes,
  getMotors,
  getGerais,
  getAllSeals,
  getMotorParts,
} from "../../utils/ggAPI";
import { Sparepart, Motor, Gerai } from "../../types";

interface Service {
  id: number;
  name: string;
}

interface ServiceType {
  id: number;
  name: string;
  category_id?: number;
  category?: { id: number; name: string };
}

interface MotorPart {
  id: number;
  name: string;
  price: number;
  subcategory_id: number;
  subcategory: {
    id: number;
    name: string;
    category: { id: number; name: string };
  };
}

export default function CekHargaSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [allServiceTypes, setAllServiceTypes] = useState<ServiceType[]>([]);
  const [allMotorParts, setAllMotorParts] = useState<MotorPart[]>([]);
  const [motors, setMotors] = useState<Motor[]>([]);
  const [gerais, setGerais] = useState<Gerai[]>([]);
  const [allSeals, setAllSeals] = useState<Sparepart[]>([]);
  const geraiId="";
  const [layananId, setLayananId] = useState<string>("");
  const [sublayananId, setSublayananId] = useState<string>("");
  const [motorId, setMotorId] = useState<string>("");
  const [motorPartId, setMotorPartId] = useState<string>("");
  const [motorPartId2, setMotorPartId2] = useState<string>("");
  const [motorLainnya, setMotorLainnya] = useState<string>("");
  const [hargaLayanan, setHargaLayanan] = useState<number>(0);
  const [hargaSeal, setHargaSeal] = useState<number>(0);
  const [totalHarga, setTotalHarga] = useState<number>(0);
  const [selectedSeal, setSelectedSeal] = useState<string>("");
  const [isSecondMotorPart, setIsSecondMotorPart] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch semua data saat komponen dimuat
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError("");
        const [
          geraisData,
          motorsData,
          servicesData,
          serviceTypesData,
          motorPartsData,
          sealsData,
        ] = await Promise.all([
          getGerais(),
          getMotors(),
          getServices(),
          getServiceTypes(),
          getMotorParts(),
          getAllSeals(),
        ]);
        setGerais(geraisData);
        setMotors(motorsData);
        setServices(servicesData);
        setAllServiceTypes(serviceTypesData);
        setAllMotorParts(motorPartsData);
        setAllSeals(sealsData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data awal. Silakan coba lagi.");
        setLoading(false);
        // Swal.fire({
        //   icon: "error",
        //   title: "Error",
        //   text: err.message || "Gagal memuat data awal.",
        // });
      }
    };
    fetchInitialData();
  }, []);

  // Filter jenis layanan berdasarkan layananId
  const filteredServiceTypes = useMemo(() => {
    if (!layananId) return [];
    return allServiceTypes.filter(
      (type) =>
        type.category_id === Number(layananId) ||
        type.category?.id === Number(layananId)
    );
  }, [layananId, allServiceTypes]);

  // Filter bagian motor berdasarkan sublayananId
  const filteredMotorParts = useMemo(() => {
    if (!sublayananId) return [];
    return allMotorParts.filter(
      (part) => part.subcategory_id === Number(sublayananId)
    );
  }, [sublayananId, allMotorParts]);

  // Filter seal berdasarkan geraiId dan motorId
  const filteredSeals = useMemo(() => {
    if (!geraiId || !motorId || motorId === "Lainnya") return [];
    return allSeals.filter(
      (seal) =>
        seal.gerai_id === Number(geraiId) && seal.motor_id === Number(motorId)
    );
  }, [geraiId, motorId, allSeals]);

  // Hitung harga layanan dan total harga
  useEffect(() => {
    const motorPart1 = filteredMotorParts.find(
      (mp) => mp.id === Number(motorPartId)
    );
    const motorPart2 = isSecondMotorPart
      ? filteredMotorParts.find((mp) => mp.id === Number(motorPartId2))
      : null;

    const totalHargaLayanan = [motorPart1, motorPart2].reduce(
      (total, motorPart) => {
        return motorPart ? total + (motorPart.price || 0) : total;
      },
      0
    );

    setHargaLayanan(totalHargaLayanan);
    setTotalHarga(totalHargaLayanan + hargaSeal);
  }, [
    motorPartId,
    motorPartId2,
    isSecondMotorPart,
    hargaSeal,
    filteredMotorParts,
  ]);

  // Handler untuk perubahan dropdown
  // const handleSelectGerai = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setGeraiId(e.target.value);
  //   resetSubsequentFields("gerai");
  // };

  const handleSelectLayanan = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLayananId(e.target.value);
    resetSubsequentFields("layanan");
  };

  const handleSelectSublayanan = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSublayananId(e.target.value);
    resetSubsequentFields("subcategory");
  };

  const handleSelectMotor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMotorId(e.target.value);
    resetSubsequentFields("motor");
  };

  const handleMotorPartChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    isSecond: boolean = false
  ) => {
    const value = e.target.value;
    if (isSecond) {
      setMotorPartId2(value);
    } else {
      setMotorPartId(value);
      setMotorPartId2("");
      setIsSecondMotorPart(false);
    }
    resetSubsequentFields("motorPart");
  };

  // Reset field setelah pilihan tertentu
  const resetSubsequentFields = (field: string) => {
    if (field === "gerai") {
      setLayananId("");
      setSublayananId("");
      setMotorId("");
      setMotorPartId("");
      setMotorPartId2("");
      setMotorLainnya("");
      setHargaLayanan(0);
      setHargaSeal(0);
      setSelectedSeal("");
      setIsSecondMotorPart(false);
    } else if (field === "layanan") {
      setSublayananId("");
      setMotorId("");
      setMotorPartId("");
      setMotorPartId2("");
      setMotorLainnya("");
      setHargaLayanan(0);
      setHargaSeal(0);
      setSelectedSeal("");
      setIsSecondMotorPart(false);
    } else if (field === "subcategory") {
      setMotorId("");
      setMotorPartId("");
      setMotorPartId2("");
      setMotorLainnya("");
      setHargaLayanan(0);
      setHargaSeal(0);
      setSelectedSeal("");
      setIsSecondMotorPart(false);
    } else if (field === "motor") {
      setMotorPartId("");
      setMotorPartId2("");
      setMotorLainnya("");
      setHargaLayanan(0);
      setHargaSeal(0);
      setSelectedSeal("");
      setIsSecondMotorPart(false);
    } else if (field === "motorPart") {
      setHargaSeal(0);
      setSelectedSeal("");
    }
  };

  return (
    <section id="cek_harga" className="relative">
      <div className="max-w-7xl mx-auto mb-4 tablet:mb-0">
        <Wrench className="absolute opacity-10 top-1/2 right-5 w-32 h-32 rotate-12 tablet:hidden" />
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mt-10 px-4">
            <h2 className="text-2xl text-gray-800 font-medium">
              CEK HARGA <PiMoneyWavy className="inline rotate-[135deg]" />
            </h2>
            <h1 className="text-3xl text-gray-800 font-bold">
              PILIH LAYANAN UNTUK CEK HARGA
            </h1>
          </div>
        </div>
      </div>
      <div className="px-4 tablet:p-6 max-w-7xl mx-auto">
        <div className="flex gap-2 tablet:gap-4">
          <img
            src="./mekanik.jpg"
            alt="Mekanik"
            className="block w-1/4 tablet:w-3/4 tablet:h-[30em] object-cover object-center rounded-lg"
          />
          <div className="h-fit p-4 bg-orange-500 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:shadow-2xl">
            {loading ? (
              <p className="text-white text-center">Memuat data...</p>
            ) : error ? (
              <p className="text-red-200 text-center">{error}</p>
            ) : !gerais || gerais.length === 0 ? (
              <p className="text-white text-center">
                Tidak ada gerai tersedia.
              </p>
            ) : (
              <form className="space-y-4">
                <div>
                  <select
                    className="w-full px-4 py-3 bg-white text-dark rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-800/90 focus:border-orange-500 transition-all duration-300 hover:bg-slate-200"
                    value={layananId}
                    onChange={handleSelectLayanan}
                  >
                    <option value="">Pilih Layanan</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    className="w-full px-4 py-3 bg-white text-dark rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-800/90 focus:border-orange-500 transition-all duration-300 hover:bg-slate-200"
                    value={sublayananId}
                    onChange={handleSelectSublayanan}
                    disabled={!layananId || filteredServiceTypes.length === 0}
                  >
                    <option value="">Pilih Jenis Layanan</option>
                    {filteredServiceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    className="w-full px-4 py-3 bg-white text-dark rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-800/90 focus:border-orange-500 transition-all duration-300 hover:bg-slate-200"
                    value={motorId}
                    onChange={handleSelectMotor}
                    disabled={!sublayananId || motors.length === 0}
                  >
                    <option value="">Pilih Motor</option>
                    {motors.map((motor) => (
                      <option key={motor.id} value={motor.id}>
                        {motor.name}
                      </option>
                    ))}
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                {motorId === "Lainnya" && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Tulis Nama Motor
                    </label>
                    <input
                      type="text"
                      placeholder="Tulis Nama Motor"
                      className="w-full px-4 py-3 bg-white text-dark rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-800/90 focus:border-orange-500 transition-all duration-300 hover:bg-slate-200"
                      value={motorLainnya}
                      onChange={(e) => setMotorLainnya(e.target.value)}
                    />
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <div className="flex-1">
                    <select
                      className="w-full px-4 py-3 bg-white text-dark rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-800/90 focus:border-orange-500 transition-all duration-300 hover:bg-slate-200"
                      value={motorPartId}
                      onChange={(e) => handleMotorPartChange(e, false)}
                      disabled={!motorId || filteredMotorParts.length === 0}
                    >
                      <option value="">Pilih Bagian Motor</option>
                      {filteredMotorParts.map((part) => (
                        <option className="text-black" key={part.id} value={part.id}>
                          {part.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSecondMotorPart(!isSecondMotorPart);
                      if (isSecondMotorPart) setMotorPartId2("");
                    }}
                    className="bg-orange-600 flex justify-center items-center w-10 h-10 rounded-full text-2xl text-white font-bold shadow-md hover:bg-orange-700 transition-all duration-300"
                    disabled={!motorId || filteredMotorParts.length === 0}
                  >
                    {isSecondMotorPart ? "-" : "+"}
                  </button>
                </div>
                {isSecondMotorPart && (
                  <div>
                    <select
                      className="w-full px-4 py-3 bg-white text-dark rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-800/90 focus:border-orange-500 transition-all duration-300 hover:bg-slate-200"
                      value={motorPartId2}
                      onChange={(e) => handleMotorPartChange(e, true)}
                      disabled={!motorId || filteredMotorParts.length === 0}
                    >
                      <option value="">Pilih Bagian Motor Lainnya</option>
                      {filteredMotorParts.map((part) => (
                        <option key={part.id} value={part.id}>
                          {part.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {geraiId &&
                  motorId &&
                  motorPartId &&
                  filteredSeals.length > 0 && (
                    <SealPricePicker
                      setHarga={(hargaSealValue: string) =>
                        setHargaSeal(
                          Number(hargaSealValue.replace(/\./g, "")) || 0
                        )
                      }
                      seals={filteredSeals}
                      isCheckPricePage={true}
                      selectedSeal={selectedSeal}
                      setSelectedSeal={setSelectedSeal}
                      disabled={!motorPartId}
                    />
                  )}
                {(hargaLayanan > 0 || hargaSeal > 0) && (
                  <div className="mt-6">
                    <div className="bg-gray-800/90 rounded-xl p-4 shadow-lg border border-orange-600/50 transition-all duration-300 hover:shadow-xl">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-full flex justify-between items-center text-white font-semibold text-lg">
                          <span className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-orange-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                            Layanan
                          </span>
                          <p className="text-white">
                            Rp. {hargaLayanan.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="w-full flex justify-between items-center text-white font-semibold text-lg">
                          <span className="flex items-center gap-2">
                            <svg
                              className="w-5 h-5 text-orange-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0-4c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7z"
                              />
                            </svg>
                            Seal
                          </span>
                          <p className="text-white">
                            Rp. {hargaSeal.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent my-2" />
                        <div className="flex justify-between items-center w-full">
                          <span className="text-white font-bold text-xl">
                            Total Harga
                          </span>
                          <p className="text-2xl font-extrabold bg-gradient-to-r from-yellow-300 to-orange-600 text-transparent bg-clip-text">
                            Rp. {totalHarga.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
