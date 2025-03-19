// import { useState } from "react";
// import { kirimPesan } from "./TextToWA";
// import { BsSendFill } from "react-icons/bs";
// import { PiMoneyWavy } from "react-icons/pi";

// export default function CekHargaSection({
//   hargaLayanan,
//   hargaSeal,
//   gerai,
// }: any) {
//   const SEMUA_LAYANAN = [
//     "REBOUND",
//     "DOWNSIZE",
//     "MAINTENANCE",
//     "PAKET REBOUND & DOWNSIZE",
//   ];
//   const listMotor = hargaLayanan;
//   const [layanan, setLayanan] = useState<any>(undefined);
//   const [jenisMotor, setJenisMotor] = useState<any>(undefined);
//   const [motor, setMotor] = useState<any>(undefined);
//   const [textLayanan, setTextLayanan] = useState<any>(undefined);
//   const [textJenisMotor, setTextJenisMotor] = useState<any>(undefined);
//   const [textBagianMotor, setTextBagianMotor] = useState<any>(undefined);
//   const [harga, setHarga] = useState<any>(undefined);
//   const [isMotor, setIsMotor] = useState<any>(undefined);
//   const [isBagianMotor, setIsBagianMotor] = useState<any>(undefined);
//   const [isJenisMotor, setisJenisMotor] = useState<any>(undefined);

//   function setSelectLayanan(e: any) {
//     setHarga(undefined);
//     const res = listMotor?.filter(
//       (motor: any) => motor.category == e.target.value
//     );
//     let result: any = [];
//     res.forEach((item: any) => {
//       if (!result.find((u: any) => u.subcategory === item.subcategory)) {
//         result.push(item);
//       }
//     });
//     setLayanan(result);
//     setTextLayanan(e.target.value);
//     setIsMotor("");
//     setIsBagianMotor("");
//     setisJenisMotor("");
//   }
//   function setSelectJenisMotor(e: any) {
//     setHarga(undefined);
//     let res = listMotor?.filter((motor: any) => motor.category == textLayanan);
//     res = res.filter((motor: any) => motor.subcategory == e.target.value);
//     setTextJenisMotor(e.target.value);
//     setisJenisMotor(undefined);
//     setJenisMotor(res);
//     setIsMotor("");
//     setIsBagianMotor("");
//   }

//   function setSelectBagianMotor(e: any) {
//     setHarga(undefined);
//     setTextBagianMotor(e.target.value);
//     setIsMotor("");
//     setIsBagianMotor(undefined);
//   }

//   const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<any>("");
//   const [selectedTipeSubIndex, setSelectedTipeSubIndex] = useState("");
//   const [selectedHargaIndex, setSelectedHargaIndex] = useState<any>("");

//   // Objek "kategori" yang dipilih
//   const selectedItem =
//     selectedCategoryIndex !== "" ? hargaSeal[selectedCategoryIndex] : null;

//   // Menentukan apakah kita punya 'tipe' array atau 'subkategori'
//   let tipeSubOptions: any = [];
//   if (selectedItem) {
//     if (Array.isArray(selectedItem.tipe)) {
//       // Jika tipe adalah array
//       tipeSubOptions = selectedItem.tipe;
//     } else if (selectedItem.subkategori) {
//       // Jika hanya ada satu subkategori (string)
//       tipeSubOptions = [selectedItem.subkategori];
//     }
//   }

//   // Apakah perlu menampilkan select kedua
//   const showTipeSubSelect = tipeSubOptions.length > 0;

//   // Harga bisa berupa object atau array
//   let hargaData = selectedItem ? selectedItem.harga : 0;

//   // Variabel untuk menampilkan hasil

//   // Jika harga adalah array, siapkan option untuk select ketiga
//   let hargaOptions: any = [];
//   // let res = "";
//   if (hargaData) {
//     if (Array.isArray(hargaData)) {
//       // Kita punya beberapa pilihan harga
//       hargaOptions = hargaData.map((h) => {
//         const label = h.subkategori
//           ? `${h.subkategori} (${h.qty} - ${h.range})`
//           : `(${h.qty} - ${h.range})`;
//         return label;
//       });
//       if (selectedHargaIndex !== "") {
//         hargaData = hargaData[selectedHargaIndex];
//       }

//       //   if (selectedHargaIndex !== "") {
//       //     const selectedHargaObj = hargaData[selectedHargaIndex];
//       //     res = `Qty: ${selectedHargaObj.qty}, Range: ${selectedHargaObj.range}`;
//       //   }
//       // } else {
//       //   if (!showTipeSubSelect || selectedTipeSubIndex !== "") {
//       //     res = `Qty: ${hargaData.qty}, Range: ${hargaData.range}`;
//       //   }
//     }
//   }

//   // Handler untuk select Kategori
//   const handleCategoryChange = (e: any) => {
//     setSelectedCategoryIndex(e.target.value);
//     setSelectedTipeSubIndex("");
//     setSelectedHargaIndex("");
//   };

//   // Handler untuk select Tipe/Subkategori
//   const handleTipeSubChange = (e: any) => {
//     setSelectedTipeSubIndex(e.target.value);
//     setSelectedHargaIndex("");
//   };

//   // Handler untuk select Harga (jika harga array)
//   const handleHargaChange = (e: any) => {
//     setSelectedHargaIndex(e.target.value);
//   };
//   function setSelectMotor(e: any) {
//     setIsMotor(undefined);
//     setMotor(e.target.value);
//     if (textLayanan && textJenisMotor && textBagianMotor) {
//       let res = listMotor?.filter(
//         (motor: any) => motor.category == textLayanan
//       );
//       res = res?.filter((motor: any) => motor.subcategory == textJenisMotor);
//       res = res?.filter((motor: any) => motor.service == textBagianMotor);
//       const priceBasic = res[0]
//         ? res[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
//         : "";
//       if (textJenisMotor && textJenisMotor.includes("OHLINS")) {
//         const priceBasic = jenisMotor[0]
//           ? jenisMotor[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
//           : "";
//         if (hargaData.range) {
//           if (!hargaData.range.length) {
//             let price = jenisMotor[0].price + hargaData.range;
//             price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//             return setHarga(price);
//           }
//           let price = jenisMotor[0].price + hargaData.range[1];
//           price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//           return setHarga(price);
//         }
//         setHarga(priceBasic);
//       }
//       if (hargaData.range) {
//         if (!hargaData.range.length) {
//           let price = res[0].price + hargaData.range;
//           price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//           return setHarga(price);
//         }
//         let price = res[0].price + hargaData.range[1];
//         price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//         return setHarga(price);
//       }
//       setHarga(priceBasic);
//     }

//     if (hargaData.range) {
//       if (!hargaData.range.length) {
//         let price = hargaData.range;
//         price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//         return setHarga(price);
//       }
//       let price = hargaData.range[1];
//       price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//       return setHarga(price);
//     }
//   }

//   const hargaSealNumber =
//     hargaData.range && hargaData.range.length > 0
//       ? hargaData.range[1]
//       : hargaData.range;
//   const hargaNumber = harga && Number(harga.replace(".", ""));

//   return (
//     <div id="harga">
//       <div className="flex tablet:flex-row flex-col justify-center tablet:gap-12 gap-3 items-center bg-gray-50 py-[8em] relative">
//         <PiMoneyWavy className="absolute top-5 left-8 text-5xl rotate-45" />
//         <PiMoneyWavy className="absolute top-5 right-3 text-3xl rotate-[-45deg]" />
//         <PiMoneyWavy className="absolute top-5 right-8 text-5xl rotate-[-45deg]" />
//         <PiMoneyWavy className="absolute bottom-5 right-1 text-2xl rotate-[-45deg]" />
//         <PiMoneyWavy className="absolute bottom-1/2 left-0 text-xl rotate-45" />
//         <PiMoneyWavy className="absolute bottom-5 left-3 text-4xl rotate-45" />
//         <div className="flex gap-5 flex-col tablet:w-1/4 px-4 bg-orange-500 py-5 rounded-xl text-white">
//           <span>
//             <p className="font-semibold text-xl">Layanan</p>
//             <select
//               className="w-full text-lg bg-white text-black"
//               onChange={setSelectLayanan}
//               name="nama_layanan"
//               id=""
//             >
//               <option value="">Pilih Layanan</option>
//               {SEMUA_LAYANAN.map((layanan, i) => (
//                 <option key={i} value={layanan}>
//                   {layanan}
//                 </option>
//               ))}
//             </select>
//           </span>
//           <span>
//             <p className="font-semibold text-xl">Jenis Motor</p>
//             <select
//               className="w-full text-lg bg-white"
//               onChange={setSelectJenisMotor}
//               value={isJenisMotor && isJenisMotor}
//               disabled={layanan ? false : true}
//               id=""
//             >
//               <option disabled value="">
//                 Pilih Jenis Motor
//               </option>
//               {layanan?.map((motor: any, i: number) => (
//                 <option key={i} value={motor.subcategory}>
//                   {motor.subcategory}
//                 </option>
//               ))}
//             </select>
//           </span>
//           <span>
//             <p className="font-semibold text-xl">Bagian Motor</p>
//             <select
//               className="w-full text-lg bg-white"
//               onChange={setSelectBagianMotor}
//               id=""
//               value={isBagianMotor && isBagianMotor}
//               disabled={jenisMotor ? false : true}
//             >
//               <option disabled value="">
//                 Pilih Bagian Motor
//               </option>
//               {jenisMotor?.map((motor: any, i: number) => (
//                 <option key={i} value={motor.service}>
//                   {motor.service}
//                 </option>
//               ))}
//             </select>
//           </span>
//           <span>
//             <p className="font-semibold text-xl">Motor</p>
//             <select
//               className="w-full text-lg bg-white"
//               onChange={setSelectMotor}
//               id=""
//               disabled={jenisMotor ? false : true}
//               value={isMotor && isMotor}
//             >
//               <option disabled value="">
//                 Pilih Motor
//               </option>
//               {!textJenisMotor?.includes("OHLINS") &&
//                 jenisMotor?.length > 0 &&
//                 jenisMotor[0].motor.map((motor: any, i: number) => (
//                   <option key={i} value={motor}>
//                     {motor}
//                   </option>
//                 ))}
//               <option value="">Lainnya</option>
//             </select>
//           </span>
//           <div className="container mx-auto px-4 flex flex-col gap-4 bg-black py-4 rounded-lg">
//             {/* Select Kategori */}
//             <div>
//               <span className="flex justify-between">
//                 <h1 className="text-xl font-semibold">Seal</h1>
//                 <p className="text-yellow-300 font-semibold">(optional)</p>
//               </span>
//               <select
//                 id="kategoriSelect"
//                 className="border border-gray-300 rounded px-2 w-full max-w-md text-lg"
//                 value={selectedCategoryIndex}
//                 onChange={handleCategoryChange}
//               >
//                 <option disabled value="">
//                   Pilih Kategori
//                 </option>
//                 <option value="">Batalkan</option>
//                 {hargaSeal &&
//                   hargaSeal.map((item: any, index: number) => (
//                     <option key={index} value={index}>
//                       {item.kategori}
//                     </option>
//                   ))}
//               </select>
//             </div>

//             {/* Select Tipe/Subkategori (hanya muncul jika ada tipe atau subkategori) */}
//             {showTipeSubSelect && (
//               <div>
//                 <label
//                   htmlFor="tipeSubSelect"
//                   className="block font-semibold text-xl"
//                 >
//                   Pilih Tipe / Subkategori:
//                 </label>
//                 <select
//                   id="tipeSubSelect"
//                   className="border border-gray-300 rounded px-2 py-1 w-full max-w-md text-lg"
//                   value={selectedTipeSubIndex}
//                   onChange={handleTipeSubChange}
//                 >
//                   <option disabled value="">
//                     Pilih Tipe / Subkategori
//                   </option>
//                   {tipeSubOptions.map((option: any, idx: any) => (
//                     <option key={idx} value={idx}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* Select Harga (jika harga berupa array) */}
//             {(hargaData.length > 0 || selectedHargaIndex) && (
//               <div>
//                 <label
//                   htmlFor="hargaSelect"
//                   className="block mb-2 font-semibold"
//                 >
//                   Pilih Harga:
//                 </label>
//                 <select
//                   id="hargaSelect"
//                   className="border border-gray-300 rounded px-2 py-1 w-full max-w-md text-lg"
//                   value={selectedHargaIndex}
//                   onChange={handleHargaChange}
//                 >
//                   <option value="">-- Pilih Harga --</option>
//                   {hargaOptions.map((optionLabel: any, idx: any) => (
//                     <option key={idx} value={idx}>
//                       {optionLabel}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}

//             {/* Hasil */}
//           </div>
//         </div>

//         {harga && (
//           <span className="flex justify-center gap-4 items-center mt-8">
//             <div>
//               <span className="flex justify-center text-center font-bold text-lg">
//                 {harga && hargaSealNumber && (
//                   <span className="flex gap-1">
//                     <p>{hargaNumber - hargaSealNumber}</p> <p>+</p>{" "}
//                     <p>{hargaSealNumber}</p>
//                   </span>
//                 )}
//               </span>
//               {harga && (
//                 <p className="text-center font-bold text-xl text-green-700">
//                   Total Harga : {harga}
//                 </p>
//               )}
//               {hargaData != 0 && (
//                 <p className="text-md text-red-500 text-center">
//                   ( harga seal hanya estimasi )
//                 </p>
//               )}
//             </div>
//             <span
//               onClick={() => {
//                 if (hargaData.range) {
//                   kirimPesan(
//                     gerai,
//                     `Halo min! saya mau layanan ${textLayanan}, ${textJenisMotor}, bagian ${textBagianMotor}, motor ${motor}, dan ingin membeli seal dengan kategori ${tipeSubOptions}, dengan harga ${harga}`
//                   );
//                 } else {
//                   kirimPesan(
//                     gerai,
//                     `Halo min! saya mau layanan ${textLayanan}, ${textJenisMotor}, bagian ${textBagianMotor}, motor ${motor}, dengan harga ${harga}`
//                   );
//                 }
//               }}
//               className="bg-green-500 text-md  tablet:text-xl text-white p-2 rounded-lg font-medium flex gap-2 items-center cursor-pointer"
//             >
//               Lanjut WA <BsSendFill />
//             </span>
//           </span>
//         )}
//       </div>
//     </div>
//   );
// }
import React from "react";
import { useState } from "react";
import { Eye, SendIcon } from "lucide-react";
import { FaLocationDot } from "react-icons/fa6";
// Tipe data untuk opsi dan harga
// interface PriceData {
//   [key: string]: {
//     [key: string]: number;
//   };
// }

const GeraiSection: React.FC = () => {
  // Data kategori dan opsi

  const [indexGerai, setIndexGerai] = useState(0);
  const semuaGerai = [
    {
      gerai: "BEKASI",
      alamat: "Jl. Kelana, Cibuntu, Cibitung, Bekasi",
      foto: "./gerai/gerai%20pusat.jpg",
      link: "https://maps.app.goo.gl/nUE1ptZQuaQQsaxg7",
      WA: "6282225232505",
    },
    {
      gerai: "TANGERANG",
      alamat: "Jl. Dr. Soetomo, Joglo, Karang Tengah, Tangerang",
      foto: "./gerai/gerai%20tangerang.png",
      link: "https://maps.app.goo.gl/Nj3KB4oveM4R3ugA7",
      WA: "6283833977411",
    },
    {
      gerai: "DEPOK",
      alamat: `Jl. Tole Iskandar, Abadijaya, Sukmajaya, Depok`,
      foto: "./gerai/gerai%20depok.jpg",
      link: "https://maps.app.goo.gl/gF33nGxzY41FPpTG6",
      WA: "6285213335797",
    },
    {
      gerai: "JAKTIM",
      alamat: `Jl. Malaka,
                Malaka Sari, Duren Sawit, Jakarta Timur`,
      foto: "./gerai/gerai%20jaktim.png",
      link: "https://maps.app.goo.gl/46v1C4KK8njbWbSDA",
      WA: "6281318911480",
    },
    {
      gerai: "CIKARANG",
      alamat: `Jl.
                Cilemahabang, Jayamukti, Cikarang Pusat`,
      foto: "./gerai/gerai%20cikarang.jpg",
      link: "https://maps.app.goo.gl/gbg5PmY11nP63cXC8",
      WA: "6281316666812",
    },
    {
      gerai: "JAKSEL",
      alamat: `Jl. Raya Pasar
                Minggu, Pancoran, Jakarta Selatan`,
      foto: "./gerai/gerai%20jaksel.png",
      link: "https://maps.app.goo.gl/afCf8QTr3uxHqBn18",
      WA: "6282299903985",
    },
    {
      gerai: "BOGOR",
      alamat: `Jl. Rimba Baru,
                Pasirkuda, Kec. Bogor Bar., Bogor`,
      foto: "./gerai/gerai%20bogor.jpg",
      link: "https://maps.app.goo.gl/e6fiH1iwo3SzyDYT6",
      WA: "6281318911476",
    },
    {
      gerai: "JAKBAR",
      alamat: "Jl. Kapuk Kayu Besar, Cengkarang, Jakarta Barat",
      foto: "./gerai/gerai-jakbar.png",
      link: "",
      WA: "62822255232505",
    },
  ];

  // Data harga (dalam juta Rupiah)
  // const priceData: PriceData = {
  //   "web-dev": {
  //     "basic-short": 5,
  //     "basic-medium": 7,
  //     "basic-long": 9,
  //     "basic-extended": 12,
  //     "standard-short": 10,
  //     "standard-medium": 13,
  //     "standard-long": 17,
  //     "standard-extended": 20,
  //     "premium-short": 18,
  //     "premium-medium": 22,
  //     "premium-long": 28,
  //     "premium-extended": 35,
  //     "enterprise-short": 30,
  //     "enterprise-medium": 40,
  //     "enterprise-long": 50,
  //     "enterprise-extended": 65,
  //   },
  //   "app-dev": {
  //     "basic-short": 8,
  //     "basic-medium": 11,
  //     "basic-long": 15,
  //     "basic-extended": 18,
  //     "standard-short": 15,
  //     "standard-medium": 20,
  //     "standard-long": 25,
  //     "standard-extended": 30,
  //     "premium-short": 25,
  //     "premium-medium": 32,
  //     "premium-long": 42,
  //     "premium-extended": 50,
  //     "enterprise-short": 40,
  //     "enterprise-medium": 55,
  //     "enterprise-long": 70,
  //     "enterprise-extended": 90,
  //   },
  //   design: {
  //     "basic-short": 3,
  //     "basic-medium": 5,
  //     "basic-long": 7,
  //     "basic-extended": 9,
  //     "standard-short": 7,
  //     "standard-medium": 9,
  //     "standard-long": 12,
  //     "standard-extended": 15,
  //     "premium-short": 12,
  //     "premium-medium": 17,
  //     "premium-long": 22,
  //     "premium-extended": 28,
  //     "enterprise-short": 20,
  //     "enterprise-medium": 28,
  //     "enterprise-long": 38,
  //     "enterprise-extended": 45,
  //   },
  //   seo: {
  //     "basic-short": 2,
  //     "basic-medium": 4,
  //     "basic-long": 6,
  //     "basic-extended": 8,
  //     "standard-short": 5,
  //     "standard-medium": 7,
  //     "standard-long": 9,
  //     "standard-extended": 12,
  //     "premium-short": 8,
  //     "premium-medium": 12,
  //     "premium-long": 16,
  //     "premium-extended": 20,
  //     "enterprise-short": 15,
  //     "enterprise-medium": 20,
  //     "enterprise-long": 25,
  //     "enterprise-extended": 30,
  //   },
  // };

  return (
    <div
      id="gerai"
      className="w-full tablet:pt-20 pb-[4em] mx-auto py-20 laptop:px-20 px-4 relative"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl text-gray-800 font-medium">GERAI KAMI</h2>
        <h1 className="text-3xl tablet:text-4xl text-gray-800 font-bold">
          PILIH GERAI TERDEKAT ANDA
        </h1>
        <div className="flex mt-7 relative">
          <img
            src={
              semuaGerai[indexGerai].foto ??
              "https://images.unsplash.com/photo-1504215680853-026ed2a45def?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            }
            alt="Racing motorcycle on track"
            className="w-full h-96 object-cover object-center z-10"
          />
        </div>
        <div className="w-full flex flex-col gap-3 tablet:flex-row desktop:gap-10 mt-4">
          <div className="w-full tablet:w-1/2 grid grid-cols-2 gap-2 justify-center">
            {semuaGerai.map((item, i) => (
              <button
                key={i}
                onClick={() => setIndexGerai(i)}
                className={`${
                  i == indexGerai
                    ? "bg-yellow-300 text-black border-2 border-black"
                    : "bg-black text-white"
                }  p-1 font-bold uppercase text-xs tablet:text-lg`}
              >
                {item.gerai}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 text-left ">
                {semuaGerai[indexGerai].gerai}
              </h3>
              <p className="text-sm tablet:text-xl flex items-center gap-2">
                <FaLocationDot className="text-red-500" />
                {semuaGerai[indexGerai].alamat}
              </p>
              <p className="text-sm tablet:text-xl flex items-center gap-1">
                <img src="./LOGO%20WA.webp" className="w-6" alt="" />
                {semuaGerai[indexGerai].WA}
              </p>
            </div>
            <span className="flex gap-4">
              <a
                href={semuaGerai[indexGerai].link}
                className="bg-yellow-300 px-3 py-1 w-fit rounded-lg font-semibold flex gap-1 text-xs tablet:text-lg items-center"
              >
                <Eye className="w-5" />
                LIHAT MAPS
              </a>
              <button
                onClick={() =>
                  window.open(`https://wa.me/${semuaGerai[indexGerai].WA}`)
                }
                className="bg-green-500 px-3 py-1 w-fit rounded-lg font-semibold flex gap-1 text-xs tablet:text-lg items-center cursor-pointer text-white"
              >
                LANJUT WA <SendIcon />
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeraiSection;
