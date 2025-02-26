import { setDataPelanggan } from "@/firebase/service";
import { setCookie } from "@/utils/setCookie";
import { useState } from "react";

const FormPelanggan = () => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    id: "",
    nama: "",
    gerai: "",
    layanan: "",
    motor: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsSubmit(true);
    formData.id = formData.nama + Math.random().toString().substring(3, 8);
    setDataPelanggan(formData).then((res) => {
      if (res?.gerai) {
        const response = setCookie("pelangganGGSuspension", JSON.stringify(res));
        if (response.status)
          window.location.reload()
      }
    });
  };

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
            <select
              required
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent appearance-none transition-all"
              value={formData.layanan}
              onChange={(e) =>
                setFormData({ ...formData, layanan: e.target.value })
              }
            >
              <option value="" disabled className="bg-white text-black">
                Pilih Layanan
              </option>
              <option value="REBOUND" className="bg-white text-black">
                REBOUND
              </option>
              <option value="DOWNSIZE" className="bg-white text-black">
                DOWNSIZE
              </option>
              <option value="MAINTENANCE" className="bg-white text-black">
                MAINTENANCE
              </option>
              <option
                value="PAKET REBOUND & DOWNSIZE"
                className="bg-white text-black"
              >
                PAKET REBOUND & DOWNSIZE
              </option>
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="Motor"
              required
              className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
              value={formData.motor}
              onChange={(e) =>
                setFormData({ ...formData, motor: e.target.value })
              }
            />
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
