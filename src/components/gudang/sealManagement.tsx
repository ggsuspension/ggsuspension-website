import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthToken, decodeToken, removeAuthToken } from "@/utils/auth";
import {
  getWarehouseSeals,
  createWarehouseSeal,
  updateWarehouseSeal,
  deleteWarehouseSeal,
  getMotors,
} from "@/utils/ggAPI";
import Swal from "sweetalert2";
import NavbarDashboard from "../fragments/NavbarDashboard";
import { Motor, WarehouseSeal } from "@/types";

const SealManagement = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [seals, setSeals] = useState<WarehouseSeal[]>([]);
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    motor_id: 0,
    cc_range: "",
    price: 0,
    qty: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initializeUser = () => {
      const token = getAuthToken();
      if (!token) {
        showSwalWarning(
          "Login Diperlukan",
          "Silakan login terlebih dahulu.",
          "/auth/login"
        );
        return;
      }

      const decoded = decodeToken(token);
      if (!decoded) {
        removeAuthToken();
        showSwalWarning(
          "Token Tidak Valid",
          "Silakan login ulang.",
          "/auth/login"
        );
        return;
      }

      setUserRole(decoded.role);

      if (decoded.role !== "GUDANG") {
        showSwalWarning(
          "Akses Ditolak",
          "Halaman ini hanya untuk GUDANG.",
          "/dashboard"
        );
        return;
      }
    };

    initializeUser();
  }, [navigate]);

  useEffect(() => {
    if (userRole === "GUDANG") {
      fetchSeals();
      fetchMotors();
    }
  }, [userRole]);

  const fetchSeals = async () => {
    setLoading(true);
    try {
      const data = await getWarehouseSeals();
      console.log("Fetched seals data:", data);
      setSeals(data);
      if (data.length === 0) {
        console.warn("No seals data returned from API");
      }
    } catch (error: any) {
      console.error("Error fetching seals:", error.message);
      Swal.fire("Error", "Gagal mengambil data seal.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchMotors = async () => {
    try {
      const data = await getMotors();
      console.log("Fetched motors data:", data);
      setMotors(data);
    } catch (error) {
      console.error("Error fetching motors:", error);
      Swal.fire("Error", "Gagal mengambil data motor.", "error");
    }
  };

  const showSwalWarning = (title: string, text: string, redirectTo: string) => {
    Swal.fire({
      icon: "warning",
      title,
      text,
      timer: 1500,
      showConfirmButton: false,
    }).then(() => navigate(redirectTo, { replace: true }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "motor_id" || name === "price" || name === "qty"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        const updatedSeal = await updateWarehouseSeal(editId, formData);
        setSeals((prev) =>
          prev.map((seal) => (seal.id === editId ? updatedSeal : seal))
        );
        Swal.fire("Berhasil", "Seal berhasil diperbarui.", "success");
      } else {
        if (
          !formData.motor_id ||
          !formData.cc_range ||
          !formData.price ||
          !formData.qty
        ) {
          Swal.fire(
            "Error",
            "Semua field harus diisi untuk menambahkan seal.",
            "error"
          );
          return;
        }
        const newSeal = await createWarehouseSeal(formData);
        setSeals((prev) => [...prev, newSeal]);
        Swal.fire("Berhasil", "Seal berhasil ditambahkan.", "success");
      }
      resetForm();
    } catch (error: any) {
      console.error("Error submitting seal:", error);
      const message = error.response?.data?.message || "Gagal menyimpan seal.";
      Swal.fire("Error", message, "error");
    }
  };

  const handleEdit = (seal: WarehouseSeal) => {
    setEditId(seal.id);
    setFormData({
      motor_id:
        (seal.motor && motors.find((m) => m.name === seal.motor?.name)?.id) ||
        0,
      cc_range: seal.cc_range,
      price: seal.price,
      qty: seal.qty,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah Anda yakin ingin menghapus seal ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya",
      cancelButtonText: "Tidak",
    });

    if (result.isConfirmed) {
      try {
        await deleteWarehouseSeal(id);
        setSeals((prev) => prev.filter((seal) => seal.id !== id));
        Swal.fire("Berhasil", "Seal berhasil dihapus.", "success");
      } catch (error) {
        console.error("Error deleting seal:", error);
        Swal.fire("Error", "Gagal menghapus seal.", "error");
      }
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({ motor_id: 0, cc_range: "", price: 0, qty: 0 });
    setIsModalOpen(false);
  };

  if (!userRole) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarDashboard userRole={userRole} />
      <main className="mt-20 px-6 flex-1 m-2">
        <div className="flex flex-row justify-between m-2">
          <h2 className="text-xl font-semibold text-gray-700 mt-4">
            Manajemen Seal Gudang
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tambah Seal
          </button>
        </div>
        {loading ? (
          <p className="mt-6 text-xl text-gray-600">Memuat data...</p>
        ) : seals.length > 0 ? (
          <table className="w-full mt-6 bg-white rounded-lg shadow-md border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border-b">ID</th>
                <th className="p-3 border-b">Motor</th>
                <th className="p-3 border-b">CC Range</th>
                <th className="p-3 border-b">Harga (Rp)</th>
                <th className="p-3 border-b">Jumlah</th>
                <th className="p-3 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {seals.map((seal) => (
                <tr key={seal.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{seal.id}</td>
                  <td className="p-3 border-b">
                    {seal.motor ? seal.motor.name : "Motor Tidak Diketahui"}
                  </td>
                  <td className="p-3 border-b">{seal.cc_range}</td>
                  <td className="p-3 border-b">
                    {seal.price.toLocaleString("id-ID")}
                  </td>
                  <td className="p-3 border-b">{seal.qty}</td>
                  <td className="p-3 border-b">
                    <button
                      onClick={() => handleEdit(seal)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(seal.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-6 text-gray-600">Tidak ada data seal saat ini.</p>
        )}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editId ? "Edit Seal" : "Tambah Seal"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Motor</label>
                  <select
                    name="motor_id"
                    value={formData.motor_id}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value={0}>Pilih Motor</option>
                    {motors.map((motor) => (
                      <option key={motor.id} value={motor.id}>
                        {motor.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">CC Range</label>
                  <input
                    type="text"
                    name="cc_range"
                    value={formData.cc_range}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Harga (Rp)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Jumlah</label>
                  <input
                    type="number"
                    name="qty"
                    value={formData.qty}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="0"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SealManagement;
