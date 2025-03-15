import {
  setCancelNow,
  setFinishNow,
  updateDataPelanggan,
} from "@/firebase/service";
import React, { useState } from "react";
import Swal from "sweetalert2";

const TabelAntrianHarian: React.FC<{ data: any }> = ({ data }) => {
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});

  function handleEdit(id: string, field: string, value: string) {
    setEditedData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  }

  function handleSaveEdit(id: string, originalData: any) {
    if (!editedData[id]) return;
  
    const updatedItem = { ...originalData, ...editedData[id] };
  
    updateDataPelanggan(updatedItem)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data pelanggan telah diperbarui.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload(); // Reload halaman setelah sukses
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Terjadi kesalahan saat memperbarui data.",
        });
      });
  
    setEditedData((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  
    setEditMode((prev) => ({ ...prev, [id]: false }));
  }
  

  function handleFinish(item: any) {
    setFinishNow(item).then(() => {
      Swal.fire("Selesai!", "Pekerjaan telah diselesaikan.", "success");
    });
  }

  function handleCancel(id: string) {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data ini akan dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, batalkan!",
    }).then((result) => {
      if (result.isConfirmed) {
        setCancelNow(id).then(() => {
          Swal.fire("Dibatalkan!", "Data telah dibatalkan.", "success");
        });
      }
    });
  }

  return (
    <div className="tablet:w-3/4 w-full mx-auto min-h-screen p-4 rounded-lg">
      <div className="flex flex-col gap-[5em]">
        {data ? (
          data.map((row: any) => (
            <div
              className="bg-white p-5 w-full self-center rounded-lg shadow-xl"
              key={row.id}
            >
              <h2 className="text-xl sm:text-2xl font-bold italic mb-4">
                GERAI {row.gerai}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50 font-light text-sm sm:text-lg">
                      <th className="border p-2">Antrian</th>
                      <th className="border p-2">Nama</th>
                      <th className="border p-2">Plat</th>
                      <th className="border p-2">No WA</th>
                      <th className="border p-2">Layanan</th>
                      <th className="border p-2">Jenis Motor</th>
                      <th className="border p-2">Bagian Motor</th>
                      <th className="border p-2">Motor</th>
                      <th className="border p-2">Seal</th>
                      <th className="border p-2">Harga Layanan</th>
                      <th className="border p-2">Total Harga</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {row.data
                      .sort((a: any, b: any) => a.waktu - b.waktu)
                      .map((item: any, i: number) => (
                        <tr
                          key={item.id}
                          className="bg-white border-b text-center"
                        >
                          <td className="border p-2">{i + 1}</td>
                          {[
                            "nama",
                            "plat",
                            "noWA",
                            "layanan",
                            "jenisMotor",
                            "bagianMotor",
                            "motor",
                            "seal",
                            "hargaLayanan",
                            "totalHarga",
                          ].map((field) => (
                            <td key={field} className="border p-2">
                              <input
                                type="text"
                                value={
                                  editedData[item.id]?.[field] ?? item[field]
                                }
                                onChange={(e) =>
                                  handleEdit(item.id, field, e.target.value)
                                }
                                disabled={!editMode[item.id]}
                                className={`px-3 py-2 w-[150px] sm:w-[200px] text-center ${
                                  editMode[item.id]
                                }`}
                              />
                            </td>
                          ))}
                          <td className="border p-2">
                            {item.status ? (
                              <span className="text-green-600 font-semibold">
                                FINISH
                              </span>
                            ) : (
                              <span className="text-yellow-500 font-semibold">
                                PROGRESS
                              </span>
                            )}
                          </td>
                          <td className="border p-2 flex gap-2 justify-center">
                            {!editMode[item.id] ? (
                              <button
                                onClick={() =>
                                  setEditMode((prev) => ({
                                    ...prev,
                                    [item.id]: true,
                                  }))
                                }
                                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                              >
                                Edit
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSaveEdit(item.id, item)}
                                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                              >
                                Simpan
                              </button>
                            )}
                            {!item.status && (
                              <>
                                <button
                                  onClick={() => handleFinish(item)}
                                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                                >
                                  Finish
                                </button>
                                <button
                                  onClick={() => handleCancel(item.id)}
                                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Tidak ada data.</p>
        )}
      </div>
    </div>
  );
};

export default TabelAntrianHarian;
