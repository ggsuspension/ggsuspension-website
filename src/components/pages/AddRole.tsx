import { registerUser } from "@/utils/ggAPI";
import { getGerais } from "@/utils/ggsAPI";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
const AddRole = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  const [listGerai, setListGerai] = useState<any>([]);
  const [formData, setFormData] = useState<any>({
    nama: "",
    role: "",
    gerai: "",
    password: "",
  });
  useEffect(() => {
    async function getGerai() {
      const result = await getGerais();
      setListGerai(result);
    }
    getGerai();
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setIsSubmit(true);
    setIsLoading(true);
    await registerUser({
      username: formData.nama,
      password: formData.password,
      role: formData.role.toUpperCase(),
      gerai_id: formData.gerai,
    });
    Swal.fire({
      title: "Sukses",
      text: "Berhasil menambahkan role",
      icon: "success",
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e9d712] to-[#d38508]">
        {isSubmit && (
          <div className="h-full w-full fixed z-10 bg-black top-0 opacity-70"></div>
        )}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-400"></div>
          </div>
        )}
        <div className="glass-container bg-white backdrop-blur-lg rounded-2xl p-8 md:p-10 shadow-2xl border border-white/20 w-full max-w-md mx-4">
          <h1 className="text-black text-2xl md:text-3xl font-bold text-center mb-6 drop-shadow-md">
            Tambah Role
          </h1>
          {/* {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )} */}
          <form className="space-y-6">
            <div className="flex gap-2 tablet:gap-4">
              <input
                type="text"
                placeholder="Masukkan Nama"
                required
                className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                value={formData.nama}
                onChange={(e: any) => {
                  setFormData({ ...formData, nama: e.target.value });
                }}
              />
            </div>
            <div className="flex gap-2 tablet:gap-4">
              <input
                type="text"
                placeholder="Masukkan Password"
                required
                className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                }}
              />
            </div>
            <div className="flex gap-2 tablet:gap-4">
              <input
                type="text"
                placeholder="Masukkan Role"
                required
                className="w-full px-4 py-3 bg-slate-100 backdrop-blur-sm rounded-lg border border-white/20 placeholder:text-black/70 text-black focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
                value={formData.role}
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value });
                }}
              />
            </div>

            <div className="flex gap-2 tablet:gap-4">
              <select
              required
                onChange={(e: any) =>
                  setFormData({ ...formData, gerai: e.target.value })
                }
                value={formData.gerai}
                id=""
              >
                <option value="">Pilih Gerai</option>
                {listGerai.map((item: any) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-orange-400 text-white font-bold rounded-lg transition-all duration-300 uppercase tracking-wider cursor-pointer hover:bg-orange-500"
              disabled={isSubmit || isLoading}
              onClick={handleSubmit}
            >
              KIRIM
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRole;
