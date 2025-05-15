// import { useEffect, useState, useMemo } from "react";
// import Cookies from "js-cookie";
// import {
//   getServices,
//   getServiceTypes,
//   getMotors,
//   getMotorParts,
//   getAllSeals,
//   createServiceOrder,
//   getGerais,
// } from "@/utils/ggAPI";
// import {
//   Category,
//   Subcategory,
//   MotorPart,
//   Motor,
//   Sparepart,
//   Gerai,
//   ServiceOrderPayload,
// } from "@/types";

// const FormPelanggan = () => {
//   const [isSubmit, setIsSubmit] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [formData, setFormData] = useState({
//     nama: "",
//     noWA: "",
//     gerai: "",
//     plat: "",
//     layanan: "",
//     jenisMotor: "",
//     bagianMotor: "",
//     bagianMotor2: "",
//     motor: "",
//     motorLainnya: "",
//     seal: "",
//   });

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [allSubcategories, setAllSubcategories] = useState<Subcategory[]>([]);
//   const [allMotorParts, setAllMotorParts] = useState<MotorPart[]>([]);
//   const [motors, setMotors] = useState<Motor[]>([]);
//   const [allSeals, setAllSeals] = useState<Sparepart[]>([]);
//   const [gerais, setGerais] = useState<Gerai[]>([]);
//   const [selectedSeals, setSelectedSeals] = useState<Sparepart[]>([]);
//   const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
//     number | null
//   >(null);
//   const [hargaLayanan, setHargaLayanan] = useState(0);
//   const [hargaSeal, setHargaSeal] = useState(0);
//   const [hasChatAdmin, setHasChatAdmin] = useState(false);
//   const [showBagianMotor2, setShowBagianMotor2] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const [
//           categoriesData,
//           motorsData,
//           motorPartsData,
//           geraisData,
//           subcategoriesData,
//           sealsData,
//         ] = await Promise.all([
//           getServices(),
//           getMotors(),
//           getMotorParts(),
//           getGerais(),
//           getServiceTypes(),
//           getAllSeals(),
//         ]);
//         setCategories(categoriesData);
//         setMotors(motorsData);
//         setAllMotorParts(motorPartsData);
//         setGerais(geraisData);
//         setAllSubcategories(subcategoriesData);
//         setAllSeals(sealsData);
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Gagal memuat data";
//         setError(`Gagal memuat data: ${errorMessage}`);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const filteredSubcategories = useMemo(() => {
//     if (!formData.layanan) return [];
//     const category = categories.find((c) => c.name === formData.layanan);
//     if (!category) return [];
//     return allSubcategories.filter((sub) => {
//       return (
//         (sub.category_id && sub.category_id === category.id) ||
//         (sub.category && sub.category.id === category.id)
//       );
//     });
//   }, [formData.layanan, categories, allSubcategories]);

//   const filteredMotorParts = useMemo(() => {
//     if (!selectedSubcategoryId) return allMotorParts;
//     return allMotorParts.filter(
//       (mp) => mp.subcategory.id === selectedSubcategoryId
//     );
//   }, [selectedSubcategoryId, allMotorParts]);

//   const filteredSeals = useMemo(() => {
//     if (!formData.gerai || (!formData.motor && !formData.motorLainnya))
//       return [];
//     const gerai = gerais.find((g) => g.name === formData.gerai);
//     const selectedMotor = motors.find(
//       (m) => m.name === (formData.motorLainnya || formData.motor)
//     );
//     if (!gerai) return [];
//     return allSeals.filter(
//       (seal) =>
//         seal.gerai_id === gerai.id &&
//         (!selectedMotor || seal.motor_id === selectedMotor.id)
//     );
//   }, [
//     formData.gerai,
//     formData.motor,
//     formData.motorLainnya,
//     gerais,
//     motors,
//     allSeals,
//   ]);

//   const handleLayananChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setFormData({
//       ...formData,
//       layanan: value,
//       jenisMotor: "",
//       bagianMotor: "",
//       bagianMotor2: "",
//       motor: "",
//       motorLainnya: "",
//       seal: "",
//     });
//     setSelectedSubcategoryId(null);
//     setHargaLayanan(0);
//     setSelectedSeals([]);
//     setHargaSeal(0);
//     setShowBagianMotor2(false);
//   };

//   const handleJenisMotorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     const subcategory = filteredSubcategories.find((s) => s.name === value);
//     setFormData({
//       ...formData,
//       jenisMotor: value,
//       bagianMotor: "",
//       bagianMotor2: "",
//       motor: "",
//       motorLainnya: "",
//       seal: "",
//     });
//     setSelectedSubcategoryId(subcategory?.id || null);
//     setHargaLayanan(0);
//     setSelectedSeals([]);
//     setHargaSeal(0);
//     setShowBagianMotor2(false);
//   };

//   const handleBagianMotorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setFormData({
//       ...formData,
//       bagianMotor: value,
//       bagianMotor2: "",
//       motor: "",
//       motorLainnya: "",
//       seal: "",
//     });
//     updateHarga(value, "");
//     setShowBagianMotor2(false);
//     setSelectedSeals([]);
//     setHargaSeal(0);
//   };

//   const handleBagianMotor2Change = (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     const value = e.target.value;
//     setFormData({ ...formData, bagianMotor2: value });
//     updateHarga(formData.bagianMotor, value);
//   };

//   const handleMotorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setFormData({ ...formData, motor: value, motorLainnya: "", seal: "" });
//     setSelectedSeals([]);
//     setHargaSeal(0);
//   };

//   const handleSealChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setFormData({ ...formData, seal: value });
//     const selectedSeal = filteredSeals.find((s) => s.type === value);
//     if (selectedSeal && selectedSeal.qty > 0) {
//       setHargaSeal(selectedSeal.price);
//       setSelectedSeals([selectedSeal]);
//     } else {
//       setHargaSeal(0);
//       setSelectedSeals([]);
//     }
//   };

//   const updateHarga = (bagianMotor: string, bagianMotor2: string) => {
//     let totalPrice = 0;

//     if (bagianMotor) {
//       const part = allMotorParts.find((mp) => mp.service === bagianMotor);
//       totalPrice += part?.price || 0;
//     }

//     if (bagianMotor2) {
//       const part2 = allMotorParts.find((mp) => mp.service === bagianMotor2);
//       totalPrice += part2?.price || 0;
//     }

//     setHargaLayanan(totalPrice);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmit(true);
//     setError(null);

//     try {
//       const form = e.currentTarget;
//       const formDataValues = new FormData(form);
//       const isChatAdmin = formDataValues.get("isChatAdmin") as string;
//       const sosmed = formDataValues.get("sosmed") as string;
//       const sumberInfo = formDataValues.get("sumber_info") as string;

//       // Validasi input
//       if (
//         !formData.nama ||
//         !formData.noWA ||
//         !formData.plat ||
//         !formData.gerai
//       ) {
//         throw new Error("Harap lengkapi semua kolom wajib.");
//       }
//       if (!formData.layanan || !formData.jenisMotor || !formData.bagianMotor) {
//         throw new Error("Harap pilih layanan, jenis motor, dan bagian motor.");
//       }
//       if (!formData.motor && !formData.motorLainnya) {
//         throw new Error("Harap pilih motor atau masukkan nama motor.");
//       }

//       const gerai = gerais.find((g) => g.name === formData.gerai);
//       const selectedMotor = motors.find((m) => m.name === formData.motor);
//       const motorPart = allMotorParts.find(
//         (mp) => mp.service === formData.bagianMotor
//       );

//       if (!gerai || !motorPart) {
//         throw new Error("Data gerai atau bagian motor tidak valid.");
//       }

//       const payload: ServiceOrderPayload = {
//         nama: formData.nama,
//         no_wa: formData.noWA,
//         plat: formData.plat,
//         gerai_id: gerai.id,
//         motor_id: selectedMotor?.id || 0,
//         motor_part_id: motorPart.id,
//         seal_ids: selectedSeals.map((s) => s.id),
//         total_harga: hargaLayanan + hargaSeal,
//         waktu: new Date().toISOString(),
//         status: "PROGRESS",
//         info: formData.bagianMotor2
//           ? `${
//               isChatAdmin === "sudah"
//                 ? `Sudah Chat Admin dari ${sosmed}`
//                 : "Datang Langsung"
//             }, Bagian Motor Kedua: ${formData.bagianMotor2}`
//           : isChatAdmin === "sudah"
//           ? `Sudah Chat Admin dari ${sosmed}`
//           : "Datang Langsung",
//         sumber_info: sumberInfo || "Unknown",
//         warranty_claimed: false,
//         layanan: formData.layanan,
//         subcategory: formData.jenisMotor,
//         motor: formData.motorLainnya || formData.motor,
//         bagian_motor: formData.bagianMotor,
//         harga_layanan: hargaLayanan,
//         harga_seal: hargaSeal,
//         seal: formData.seal,
//       };

//       if (formData.motorLainnya) {
//         payload.motor_name = formData.motorLainnya;
//       }

//       const response = await createServiceOrder(payload);

//       // Log respons untuk debugging
//       console.log("Respons diterima:", response);

//       // Simpan semua data pelanggan ke cookie
//       Cookies.set("pelangganGGSuspension", JSON.stringify(response), {
//         expires: 12 / 24, // Cookie berlaku selama 12 jam
//       });

//       setTimeout(() => {
//         window.location.href = `/#/antrian/${formData.gerai.toLowerCase()}`;
//       }, 1000);
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Gagal mengirim pesanan";
//       console.error("Error saat mengirim pesanan:", err);
//       setIsSubmit(false);
//       setError(errorMessage);
//     }
//   };

//   return (
//     <div>
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9d712] to-[#d38508]">
//         {isSubmit && (
//           <div className="h-full w-full fixed z-10 bg-black top-0 opacity-70"></div>
//         )}
//         {isLoading && (
//           <div className="fixed inset-0 flex items-center justify-center z-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-400"></div>
//           </div>
//         )}
//         <div className="glass-container bg-white backdrop-blur-lg rounded-2xl p-8 md:p-10 shadow-2xl border border-white/20 w-full max-w-md mx-4">
//           <h1 className="text-black text-2xl md:text-3xl font-bold text-center mb-6 drop-shadow-md">
//             Data Diri Customer
//           </h1>
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
//               {error}
//             </div>
//           )}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="flex gap-2 tablet:gap-4">
//               <input
//                 type="text"
//                 placeholder="Nama"
//                 required
//                 className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                 value={formData.nama}
//                 onChange={(e) =>
//                   setFormData({ ...formData, nama: e.target.value })
//                 }
//               />
//               <input
//                 type="text"
//                 placeholder="Plat Motor"
//                 required
//                 className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                 value={formData.plat}
//                 onChange={(e) =>
//                   setFormData({ ...formData, plat: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <input
//                 type="text"
//                 placeholder="No WA"
//                 required
//                 pattern="\+62[0-9]{9,12}"
//                 title="Nomor WA harus diawali +62 dan memiliki 9-12 digit"
//                 className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                 value={formData.noWA}
//                 onChange={(e) =>
//                   setFormData({ ...formData, noWA: e.target.value })
//                 }
//               />
//             </div>

//             <div>
//               <select
//                 required
//                 className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                 value={formData.gerai}
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     gerai: e.target.value,
//                     layanan: "",
//                     jenisMotor: "",
//                     bagianMotor: "",
//                     bagianMotor2: "",
//                     motor: "",
//                     motorLainnya: "",
//                     seal: "",
//                   })
//                 }
//               >
//                 <option value="" disabled>
//                   Pilih Lokasi Gerai
//                 </option>
//                 {gerais.map((gerai) => (
//                   <option key={gerai.id} value={gerai.name}>
//                     {gerai.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <select
//                 className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                 onChange={handleLayananChange}
//                 required
//                 value={formData.layanan}
//                 disabled={!formData.gerai || categories.length === 0}
//               >
//                 <option disabled value="">
//                   Pilih Layanan
//                 </option>
//                 {categories.map((category) => (
//                   <option key={category.id} value={category.name}>
//                     {category.name}
//                   </option>
//                 ))}
//               </select>
//               {categories.length === 0 && (
//                 <p className="text-red-500 mt-2">
//                   Tidak ada layanan tersedia. Silakan coba lagi.
//                 </p>
//               )}
//             </div>

//             <div>
//               <select
//                 className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                 required
//                 onChange={handleJenisMotorChange}
//                 value={formData.jenisMotor}
//                 disabled={
//                   !formData.layanan || filteredSubcategories.length === 0
//                 }
//               >
//                 <option disabled value="">
//                   Pilih Jenis Motor
//                 </option>
//                 {filteredSubcategories.map((subcategory) => (
//                   <option key={subcategory.id} value={subcategory.name}>
//                     {subcategory.name}
//                   </option>
//                 ))}
//               </select>
//               {formData.layanan && filteredSubcategories.length === 0 && (
//                 <p className="text-yellow-600 mt-2">
//                   Tidak ada jenis motor tersedia untuk layanan ini.
//                 </p>
//               )}
//             </div>

//             <div className="flex justify-between gap-3">
//               <select
//                 className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                 required
//                 onChange={handleBagianMotorChange}
//                 disabled={
//                   !formData.jenisMotor || filteredMotorParts.length === 0
//                 }
//                 value={formData.bagianMotor}
//               >
//                 <option disabled value="">
//                   Pilih Bagian Motor
//                 </option>
//                 {filteredMotorParts.map((part) => (
//                   <option key={part.id} value={part.service}>
//                     {part.service}
//                   </option>
//                 ))}
//                 {filteredMotorParts.length === 0 && formData.jenisMotor && (
//                   <option disabled value="">
//                     Tidak ada bagian motor tersedia
//                   </option>
//                 )}
//               </select>
//               <span
//                 onClick={() => {
//                   setShowBagianMotor2(!showBagianMotor2);
//                   setFormData({ ...formData, bagianMotor2: "" });
//                   updateHarga(formData.bagianMotor, "");
//                 }}
//                 className="bg-orange-400 flex justify-center w-10 h-10 rounded-full text-2xl text-white cursor-pointer font-bold"
//               >
//                 {showBagianMotor2 ? "-" : "+"}
//               </span>
//             </div>

//             {showBagianMotor2 && (
//               <div>
//                 <select
//                   className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                   onChange={handleBagianMotor2Change}
//                   disabled={
//                     !formData.jenisMotor || filteredMotorParts.length === 0
//                   }
//                   value={formData.bagianMotor2}
//                 >
//                   <option disabled value="">
//                     Pilih Bagian Motor Lainnya
//                   </option>
//                   {filteredMotorParts
//                     .filter((mp) => mp.service !== formData.bagianMotor)
//                     .map((part) => (
//                       <option key={part.id} value={part.service}>
//                         {part.service}
//                       </option>
//                     ))}
//                   {filteredMotorParts.filter(
//                     (mp) => mp.service !== formData.bagianMotor
//                   ).length === 0 &&
//                     formData.jenisMotor && (
//                       <option disabled value="">
//                         Tidak ada bagian motor lain tersedia
//                       </option>
//                     )}
//                 </select>
//               </div>
//             )}

//             <div>
//               <select
//                 className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                 required
//                 onChange={handleMotorChange}
//                 disabled={!formData.bagianMotor || motors.length === 0}
//                 value={formData.motor}
//               >
//                 <option disabled value="">
//                   Pilih Motor
//                 </option>
//                 {motors.map((motor) => (
//                   <option key={motor.id} value={motor.name}>
//                     {motor.name}
//                   </option>
//                 ))}
//                 <option value="Lainnya">Lainnya</option>
//               </select>
//               {formData.bagianMotor && motors.length === 0 && (
//                 <p className="text-yellow-600 mt-2">
//                   Tidak ada motor tersedia. Silakan pilih "Lainnya".
//                 </p>
//               )}
//             </div>

//             {formData.motor === "Lainnya" && (
//               <input
//                 required
//                 onChange={(e) =>
//                   setFormData({ ...formData, motorLainnya: e.target.value })
//                 }
//                 type="text"
//                 placeholder="Tulis Nama Motor"
//                 className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                 value={formData.motorLainnya}
//               />
//             )}

//             <div className="grid grid-cols-2 gap-5">
//               <div>
//                 <select
//                   className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                   onChange={handleSealChange}
//                   value={formData.seal}
//                   disabled={
//                     !formData.gerai ||
//                     (!formData.motor && !formData.motorLainnya) ||
//                     filteredSeals.length === 0
//                   }
//                 >
//                   <option value="">SEAL</option>
//                   {filteredSeals
//                     .filter((seal) => seal.qty > 0)
//                     .filter((seal) => seal.category.toUpperCase() == "SEAL")
//                     .map((seal) => (
//                       <option key={seal.id} value={seal.type}>
//                         {seal.type} (Rp. {seal.price.toLocaleString("id-ID")},
//                         Stok: {seal.qty})
//                       </option>
//                     ))}
//                 </select>
//                 {formData.gerai &&
//                   (formData.motor || formData.motorLainnya) &&
//                   filteredSeals.length === 0 && (
//                     <p className="text-yellow-600 mt-2">
//                       Tidak ada seal tersedia untuk motor dan gerai ini.
//                     </p>
//                   )}
//               </div>

//               <div>
//                 <select
//                   className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                   onChange={handleSealChange}
//                   value={formData.seal}
//                   disabled={
//                     !formData.gerai ||
//                     (!formData.motor && !formData.motorLainnya) ||
//                     filteredSeals.length === 0
//                   }
//                 >
//                   <option value="">AS</option>
//                   {filteredSeals
//                     .filter((seal) => seal.qty > 0)
//                     .filter((seal) => seal.type.toUpperCase() === "AS")
//                     .map((seal) => (
//                       <option key={seal.id} value={seal.type}>
//                         {seal.type} (Rp. {seal.price.toLocaleString("id-ID")},
//                         Stok: {seal.qty})
//                       </option>
//                     ))}
//                 </select>
//                 {formData.gerai &&
//                   (formData.motor || formData.motorLainnya) &&
//                   filteredSeals.length === 0 && (
//                     <p className="text-yellow-600 mt-2">
//                       Tidak ada seal tersedia untuk motor dan gerai ini.
//                     </p>
//                   )}
//               </div>

//               <div>
//                 <select
//                   className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                   onChange={handleSealChange}
//                   value={formData.seal}
//                   disabled={
//                     !formData.gerai ||
//                     (!formData.motor && !formData.motorLainnya) ||
//                     filteredSeals.length === 0
//                   }
//                 >
//                   <option value="">PER</option>
//                   {filteredSeals
//                     .filter((seal) => seal.qty > 0)
//                     .filter((seal) => seal.type.toUpperCase() === "PER")
//                     .map((seal) => (
//                       <option key={seal.id} value={seal.type}>
//                         {seal.type} (Rp. {seal.price.toLocaleString("id-ID")},
//                         Stok: {seal.qty})
//                       </option>
//                     ))}
//                 </select>
//                 {formData.gerai &&
//                   (formData.motor || formData.motorLainnya) &&
//                   filteredSeals.length === 0 && (
//                     <p className="text-yellow-600 mt-2">
//                       Tidak ada seal tersedia untuk motor dan gerai ini.
//                     </p>
//                   )}
//               </div>

//               <div>
//                 <select
//                   className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
//                   onChange={handleSealChange}
//                   value={formData.seal}
//                   disabled={
//                     !formData.gerai ||
//                     (!formData.motor && !formData.motorLainnya) ||
//                     filteredSeals.length === 0
//                   }
//                 >
//                   <option value="">OLI</option>
//                   {filteredSeals
//                     .filter((seal) => seal.qty > 0)
//                     .filter((seal) => seal.type.toUpperCase() === "OLI")
//                     .map((seal) => (
//                       <option key={seal.id} value={seal.type}>
//                         {seal.type} (Rp. {seal.price.toLocaleString("id-ID")},
//                         Stok: {seal.qty})
//                       </option>
//                     ))}
//                 </select>
//                 {formData.gerai &&
//                   (formData.motor || formData.motorLainnya) &&
//                   filteredSeals.length === 0 && (
//                     <p className="text-yellow-600 mt-2">
//                       Tidak ada seal tersedia untuk motor dan gerai ini.
//                     </p>
//                   )}
//               </div>
//             </div>

//             <div className="flex flex-col gap-1">
//               <p className="font-semibold">Sudah Chat Admin?</p>
//               <span className="flex items-center">
//                 <input
//                   onChange={() => setHasChatAdmin(true)}
//                   id="default-radio-2"
//                   type="radio"
//                   value="sudah"
//                   name="isChatAdmin"
//                   required
//                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
//                 />
//                 <label
//                   htmlFor="default-radio-2"
//                   className="ms-2 text-sm text-gray-900"
//                 >
//                   Sudah
//                 </label>
//               </span>
//               {hasChatAdmin && (
//                 <div className="flex gap-5">
//                   <span className="flex items-center">
//                     <input
//                       required
//                       id="IG"
//                       type="radio"
//                       value="IG"
//                       name="sosmed"
//                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
//                     />
//                     <label htmlFor="IG" className="ms-2 text-sm text-gray-900">
//                       IG
//                     </label>
//                   </span>
//                   <span className="flex items-center">
//                     <input
//                       required
//                       id="Tiktok"
//                       type="radio"
//                       value="Tiktok"
//                       name="sosmed"
//                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
//                     />
//                     <label
//                       htmlFor="Tiktok"
//                       className="ms-2 text-sm text-gray-900"
//                     >
//                       Tiktok
//                     </label>
//                   </span>
//                   <span className="flex items-center">
//                     <input
//                       required
//                       id="WA"
//                       type="radio"
//                       value="WA"
//                       name="sosmed"
//                       className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
//                     />
//                     <label htmlFor="WA" className="ms-2 text-sm text-gray-900">
//                       WA
//                     </label>
//                   </span>
//                 </div>
//               )}
//               <span className="flex items-center">
//                 <input
//                   required
//                   id="datang"
//                   type="radio"
//                   value="datang langsung"
//                   name="isChatAdmin"
//                   onChange={() => setHasChatAdmin(false)}
//                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
//                 />
//                 <label htmlFor="datang" className="ms-2 text-sm text-gray-900">
//                   Datang Langsung
//                 </label>
//               </span>
//             </div>

//             <div>
//               <h2 className="text-lg font-semibold">Sumber Informasi</h2>
//               <div className="flex gap-4">
//                 <span className="flex items-center gap-1">
//                   <input
//                     required
//                     id="IG2"
//                     name="sumber_info"
//                     value="IG"
//                     type="radio"
//                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
//                   />
//                   <label htmlFor="IG2">IG</label>
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <input
//                     id="Tiktok2"
//                     name="sumber_info"
//                     value="Tiktok"
//                     type="radio"
//                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
//                   />
//                   <label htmlFor="Tiktok2">Tiktok</label>
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <input
//                     id="Facebook"
//                     name="sumber_info"
//                     value="Facebook"
//                     type="radio"
//                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
//                   />
//                   <label htmlFor="Facebook">Facebook</label>
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <input
//                     id="Youtube"
//                     name="sumber_info"
//                     value="Youtube"
//                     type="radio"
//                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
//                   />
//                   <label htmlFor="Youtube">Youtube</label>
//                 </span>
//               </div>
//             </div>

//             {(hargaLayanan > 0 || hargaSeal > 0) && (
//               <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-4 shadow-lg border border-orange-600/50 transition-all duration-300 hover:shadow-xl">
//                 <div className="flex flex-col items-center gap-2">
//                   {hargaLayanan > 0 && (
//                     <div className="w-full flex justify-between items-center text-orange-100 font-semibold text-lg">
//                       <span className="flex items-center gap-2">
//                         <svg
//                           className="w-5 h-5 text-orange-400"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M13 10V3L4 14h7v7l9-11h-7z"
//                           />
//                         </svg>
//                         Layanan
//                       </span>
//                       <p className="text-orange-300">
//                         Rp. {hargaLayanan.toLocaleString("id-ID")}
//                       </p>
//                     </div>
//                   )}
//                   {hargaSeal > 0 && (
//                     <div className="w-full flex justify-between items-center text-orange-100 font-semibold text-lg">
//                       <span className="flex items-center gap-2">
//                         <svg
//                           className="w-5 h-5 text-orange-400"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0-4c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7z"
//                           />
//                         </svg>
//                         Seal
//                       </span>
//                       <p className="text-orange-300">
//                         Rp. {hargaSeal.toLocaleString("id-ID")}
//                       </p>
//                     </div>
//                   )}
//                   <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent my-2" />
//                   <div className="flex justify-between items-center w-full">
//                     <span className="text-orange-100 font-bold text-xl">
//                       Total Harga
//                     </span>
//                     <p className="text-2xl font-extrabold bg-gradient-to-r from-yellow-300 to-orange-600 text-transparent bg-clip-text">
//                       Rp. {(hargaLayanan + hargaSeal).toLocaleString("id-ID")}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <button
//               type="submit"
//               className="w-full py-3 bg-orange-400 text-white font-bold rounded-lg transition-all duration-300 uppercase tracking-wider cursor-pointer hover:bg-orange-500"
//               disabled={isSubmit || isLoading}
//             >
//               KIRIM
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormPelanggan;
