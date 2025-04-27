import React from "react";
import Swal from "sweetalert2";
import type { GroupedAntrian, TransformedAntrian } from "@/types";

interface TabelAntrianHarianEditProps {
  data: GroupedAntrian[];
  isLoading: boolean;
  onEdit: (item: TransformedAntrian) => void;
  onFinish: (id: number) => Promise<void>;
  onCancel: (id: number) => Promise<void>;
  editItem: TransformedAntrian | null;
  setEditItem: React.Dispatch<React.SetStateAction<TransformedAntrian | null>>;
  onUpdate: (e: React.FormEvent) => Promise<void>;
}

const TabelAntrianHarianEdit: React.FC<TabelAntrianHarianEditProps> = ({
  data,
  isLoading,
  onEdit,
  onFinish,
  onCancel,
  editItem,
  setEditItem,
  onUpdate,
}) => {
  if (isLoading)
    return <p className="text-center text-gray-600">Memuat data...</p>;
  if (!data || data.length === 0)
    return <p className="text-center text-gray-600">Tidak ada data antrian.</p>;

  const statusOptions = ["PROGRESS", "FINISHED", "CANCELLED"];

  const handleFinishClick = (item: TransformedAntrian) => {
    // Validasi: Hanya bisa "Finish" dari status "PROGRESS"
    if (item.status !== "PROGRESS") {
      Swal.fire({
        icon: "warning",
        title: "Tidak Diizinkan",
        text: "Order harus dalam status 'PROGRESS' sebelum bisa diselesaikan.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    onFinish(item.id);
  };

  const handleCancelClick = (item: TransformedAntrian) => {
    // Validasi: Tidak bisa "Cancel" jika sudah "FINISHED"
    if (item.status === "FINISHED") {
      Swal.fire({
        icon: "warning",
        title: "Tidak Diizinkan",
        text: "Order yang sudah 'FINISHED' tidak bisa dibatalkan.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    onCancel(item.id);
  };

  return (
    <div className="space-y-6 mt-6">
      {data.map((group: GroupedAntrian) => (
        <div key={group.gerai} className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{group.gerai}</h2>
          {/* Wrapper div untuk scroll horizontal dengan scrollbar kustom */}
          <div className="custom-scrollbar">
            <table className="w-full table-auto border min-w-[1200px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-sm">Nama</th>
                  <th className="border p-2 text-sm">Plat</th>
                  <th className="border p-2 text-sm">No WA</th>
                  <th className="border p-2 text-sm">Layanan</th>
                  <th className="border p-2 text-sm">Subkategori</th>
                  <th className="border p-2 text-sm">Motor</th>
                  <th className="border p-2 text-sm">Bagian Motor</th>
                  <th className="border p-2 text-sm">Harga Layanan</th>
                  <th className="border p-2 text-sm">Harga Seal</th>
                  <th className="border p-2 text-sm">Total</th>
                  <th className="border p-2 text-sm">Status</th>
                  <th className="border p-2 text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {group.data.map((item: TransformedAntrian) => {
                  console.log("Rendering item:", item, "editItem:", editItem);
                  const isEditing = editItem && editItem.id === item.id;
                  return (
                    <tr key={item.id}>
                      <td className="border p-2 text-sm">
                        {isEditing ? (
                          <input
                            className="border p-1 rounded w-full text-sm"
                            value={editItem?.nama || ""}
                            onChange={(e) =>
                              setEditItem((prev) => {
                                if (!prev) {
                                  return {
                                    id: item.id,
                                    nama: e.target.value,
                                    plat: item.plat,
                                    no_wa: item.no_wa,
                                    layanan: item.layanan,
                                    subcategory: item.subcategory,
                                    motor: item.motor,
                                    bagianMotor: item.bagianMotor,
                                    hargaLayanan: item.hargaLayanan,
                                    hargaSeal: item.hargaSeal,
                                    totalHarga: item.totalHarga,
                                    status: item.status,
                                    waktu: item.waktu,
                                    gerai: item.gerai,
                                  };
                                }
                                return {
                                  ...prev,
                                  nama: e.target.value,
                                };
                              })
                            }
                          />
                        ) : (
                          item.nama
                        )}
                      </td>
                      <td className="border p-2 text-sm">
                        {isEditing ? (
                          <input
                            className="border p-1 rounded w-full text-sm"
                            value={editItem?.plat || ""}
                            onChange={(e) =>
                              setEditItem((prev) => {
                                if (!prev) {
                                  return {
                                    id: item.id,
                                    nama: item.nama,
                                    plat: e.target.value,
                                    no_wa: item.no_wa,
                                    layanan: item.layanan,
                                    subcategory: item.subcategory,
                                    motor: item.motor,
                                    bagianMotor: item.bagianMotor,
                                    hargaLayanan: item.hargaLayanan,
                                    hargaSeal: item.hargaSeal,
                                    totalHarga: item.totalHarga,
                                    status: item.status,
                                    waktu: item.waktu,
                                    gerai: item.gerai,
                                  };
                                }
                                return {
                                  ...prev,
                                  plat: e.target.value,
                                };
                              })
                            }
                          />
                        ) : (
                          item.plat
                        )}
                      </td>
                      <td className="border p-2 text-sm">
                        {isEditing ? (
                          <input
                            className="border p-1 rounded w-full text-sm"
                            value={editItem?.no_wa || ""}
                            onChange={(e) =>
                              setEditItem((prev) => {
                                if (!prev) {
                                  return {
                                    id: item.id,
                                    nama: item.nama,
                                    plat: item.plat,
                                    no_wa: e.target.value,
                                    layanan: item.layanan,
                                    subcategory: item.subcategory,
                                    motor: item.motor,
                                    bagianMotor: item.bagianMotor,
                                    hargaLayanan: item.hargaLayanan,
                                    hargaSeal: item.hargaSeal,
                                    totalHarga: item.totalHarga,
                                    status: item.status,
                                    waktu: item.waktu,
                                    gerai: item.gerai,
                                  };
                                }
                                return {
                                  ...prev,
                                  no_wa: e.target.value,
                                };
                              })
                            }
                          />
                        ) : (
                          item.no_wa
                        )}
                      </td>
                      <td className="border p-2 text-sm">{item.layanan}</td>
                      <td className="border p-2 text-sm">{item.subcategory}</td>
                      <td className="border p-2 text-sm">{item.motor}</td>
                      <td className="border p-2 text-sm">{item.bagianMotor}</td>
                      <td className="border p-2 text-sm">
                        {item.hargaLayanan.toLocaleString()}
                      </td>
                      <td className="border p-2 text-sm">
                        {item.hargaSeal.toLocaleString()}
                      </td>
                      <td className="border p-2 text-sm">
                        {item.totalHarga.toLocaleString()}
                      </td>
                      <td className="border p-2 text-sm">
                        {isEditing ? (
                          <select
                            className="border p-1 rounded w-full text-sm"
                            value={editItem?.status || "PROGRESS"}
                            onChange={(e) =>
                              setEditItem((prev) => {
                                if (!prev) {
                                  return {
                                    id: item.id,
                                    nama: item.nama,
                                    plat: item.plat,
                                    no_wa: item.no_wa,
                                    layanan: item.layanan,
                                    subcategory: item.subcategory,
                                    motor: item.motor,
                                    bagianMotor: item.bagianMotor,
                                    hargaLayanan: item.hargaLayanan,
                                    hargaSeal: item.hargaSeal,
                                    totalHarga: item.totalHarga,
                                    status: e.target.value as
                                      | "PROGRESS"
                                      | "FINISHED"
                                      | "CANCELLED",
                                    waktu: item.waktu,
                                    gerai: item.gerai,
                                  };
                                }
                                return {
                                  ...prev,
                                  status: e.target.value as
                                    | "PROGRESS"
                                    | "FINISHED"
                                    | "CANCELLED",
                                };
                              })
                            }
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          item.status
                        )}
                      </td>
                      <td className="p-2 space-x-2 flex justify-between items-center">
                        {isEditing ? (
                          <>
                            <button
                              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-sm"
                              onClick={onUpdate}
                            >
                              Simpan
                            </button>
                            <button
                              className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 text-sm"
                              onClick={() => setEditItem(null)}
                            >
                              Batal
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                              onClick={() => onEdit(item)}
                            >
                              Edit
                            </button>
                            {item.status !== "FINISHED" &&
                              item.status !== "CANCELLED" && (
                                <>
                                  <button
                                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm"
                                    onClick={() => handleFinishClick(item)}
                                  >
                                    Finish
                                  </button>
                                  <button
                                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                                    onClick={() => handleCancelClick(item)}
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabelAntrianHarianEdit;
