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

const SparepartManagement = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [seals, setSeals] = useState<WarehouseSeal[]>([]);
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    motor_id: 0,
    size: "",
    price: 0,
    qty: 1,
    type: "",
    category: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const spareparts = ["SEAL", "AS", "OLI", "PER"];

  useEffect(() => {
    console.log("userRole:", userRole);
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
  console.log("formData:", formData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    formData.category = formData.category.toUpperCase();
    try {
      if (editId) {
        await updateWarehouseSeal(editId, formData).then((res) => {
        Swal.fire("Berhasil", "Seal berhasil diperbarui.", "success");
          if (res) {
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        });
      } else {
        if (
          !formData.price ||
          !formData.qty ||
          !formData.type ||
          !formData.category
        ) {
          Swal.fire(
            "Error",
            "Semua field harus diisi untuk menambahkan seal.",
            "error"
          );
          return;
        }
        Swal.fire("Berhasil", "Seal berhasil ditambahkan.", "success");
        await createWarehouseSeal(formData).then((res) => {
          if (res) {
            setTimeout(() => {
              window.location.reload();
            }, 500);
          }
        });
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
      size: seal.size,
      price: seal.price,
      qty: seal.qty,
      type: seal.type,
      category: seal.category,
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
    setFormData({
      motor_id: 0,
      size: "",
      price: 0,
      qty: 0,
      type: "",
      category: "",
    });
    setIsModalOpen(false);
  };

  if (!userRole) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavbarDashboard userRole={userRole} />
      <main className="mt-20 px-6 flex-1 m-2">
        <div className="flex flex-row justify-between m-2">
          <h2 className="text-xl font-semibold text-gray-700 mt-4">
            Manajemen Sparepart
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Tambah Sparepart
          </button>
        </div>
        {loading ? (
          <p className="mt-6 text-xl text-gray-600">Memuat data...</p>
        ) : seals.length > 0 ? (
          <table className="w-full mt-6 bg-white rounded-lg shadow-md border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border-b">NO</th>
                <th className="p-3 border-b">Motor</th>
                <th className="p-3 border-b">Kategori</th>
                <th className="p-3 border-b">Tipe</th>
                <th className="p-3 border-b">Size</th>
                <th className="p-3 border-b">Harga (Rp)</th>
                <th className="p-3 border-b">Jumlah</th>
                <th className="p-3 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {seals.map((seal, index) => (
                <tr key={seal.id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{index + 1}</td>
                  <td className="p-3 border-b">
                    {seal.motor
                      ? seal.motor.name.toUpperCase()
                      : "UNTUK BANYAK MOTOR"}
                  </td>
                  <td className="p-3 border-b">
                    {seal.category.toUpperCase()}
                  </td>
                  <td className="p-3 border-b">{seal.type.toUpperCase()}</td>
                  <td className="p-3 border-b">{seal.size}</td>
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
                {editId ? "Edit Seal" : "Tambah Sparepart"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Kategori Sparepart
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value={0}>Pilih Sparepart</option>
                    {spareparts.map((sparepart, index) => (
                      <option key={index} value={sparepart}>
                        {sparepart}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Motor</label>
                  <select
                    name="motor_id"
                    value={formData.motor_id}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
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
                  <label className="block text-gray-700">Size Sparepart</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Tipe Sparepart</label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Harga (Rp)</label>
                  <input
                    name="price"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                    value={formData.price}
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
                    min="1"
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

export default SparepartManagement;
