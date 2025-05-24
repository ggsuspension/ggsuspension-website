import React from "react";
import Swal from "sweetalert2";
import type { GroupedAntrian, TransformedAntrian } from "@/types";
import { updateCustomer } from "@/utils/ggAPI";
import { getChannel } from "@/utils/realtime";

interface TabelAntrianHarianEditProps {
  data: GroupedAntrian[];
  dataSeal: any;
  isLoading: boolean;
  onEdit: (item: TransformedAntrian) => void;
  onFinish: (id: number, sparepart_id: number) => Promise<void>;
  onCancel: (id: number) => Promise<void>;
  editItem: any | null;
  setEditItem: React.Dispatch<React.SetStateAction<any | null>>;
  onUpdate: (e: React.FormEvent) => Promise<void>;
}

const TabelAntrianHarianEdit: React.FC<TabelAntrianHarianEditProps> = ({
  data,
  dataSeal,
  isLoading,
  onEdit,
  onCancel,
  editItem,
  setEditItem,
  onUpdate,
  onFinish,
}) => {
  if (isLoading)
    return <p className="text-center text-gray-600">Memuat data...</p>;
  if (!data || data.length === 0)
    return <p className="text-center text-gray-600">Tidak ada data antrian.</p>;

  const channel = getChannel();
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
          {/* <h2 className="text-xl font-semibold mb-2">{group.gerai}</h2> */}
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
                  <th className="border p-2 text-sm">Bagian Motor Lain</th>
                  <th className="border p-2 text-sm">Harga Layanan</th>
                  <th className="border p-2 text-sm">Sparepart</th>
                  <th className="border p-2 text-sm">Harga Sparepart</th>
                  <th className="border p-2 text-sm">Total</th>
                  <th className="border p-2 text-sm">Status</th>
                  <th className="border p-2 text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {group.data.map((item: any) => {
                  const isEditing = editItem && editItem.id === item.id;
                  return (
                    <tr key={item.id}>
                      <td className="border p-2 text-sm">
                        {isEditing ? (
                          <input
                            className="border p-1 rounded w-full text-sm"
                            value={editItem?.nama || ""}
                            onChange={(e) =>
                              setEditItem((prev: any) => {
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
                                    hargaSparepart: item.hargaSparepart,
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
                              setEditItem((prev: any) => {
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
                                    hargaSparepart: item.hargaSparepart,
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
                              setEditItem((prev: any) => {
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
                                    hargaSparepart: item.hargaSparepart,
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
                      <td className="border p-2 text-sm">
                        {isEditing ? (
                          <input
                            className="border p-1 rounded w-full text-sm"
                            value={editItem?.layanan || ""}
                            onChange={(e) =>
                              setEditItem((prev: any) => {
                                if (!prev) {
                                  return {
                                    id: item.id,
                                    nama: item.nama,
                                    plat: item.plat,
                                    no_wa: item.no_wa,
                                    layanan: e.target.value,
                                    subcategory: item.subcategory,
                                    motor: item.motor,
                                    bagianMotor: item.bagianMotor,
                                    hargaLayanan: item.hargaLayanan,
                                    hargaSparepart: item.hargaSparepart,
                                    totalHarga: item.totalHarga,
                                    status: item.status,
                                    waktu: item.waktu,
                                    gerai: item.gerai,
                                  };
                                }
                                return {
                                  ...prev,
                                  layanan: e.target.value,
                                };
                              })
                            }
                          />
                        ) : (
                          item.layanan
                        )}
                      </td>
                      <td className="border p-2 text-sm">
                        {isEditing ? (
                          <input
                            className="border p-1 rounded w-full text-sm"
                            value={editItem?.subcategory || ""}
                            onChange={(e) =>
                              setEditItem((prev: any) => {
                                if (!prev) {
                                  return {
                                    id: item.id,
                                    nama: item.nama,
                                    plat: item.plat,
                                    no_wa: item.no_wa,
                                    layanan: item.layanan,
                                    subcategory: e.target.value,
                                    motor: item.motor,
                                    bagianMotor: item.bagianMotor,
                                    hargaLayanan: item.hargaLayanan,
                                    hargaSparepart: item.hargaSparepart,
                                    totalHarga: item.totalHarga,
                                    status: item.status,
                                    waktu: item.waktu,
                                    gerai: item.gerai,
                                  };
                                }
                                return {
                                  ...prev,
                                  subcategory: e.target.value,
                                };
                              })
                            }
                          />
                        ) : (
                          item.subcategory
                        )}
                      </td>
                      <td className="border p-2 text-sm">
                        {" "}
                        <td className="border p-2 text-sm">
                          {isEditing ? (
                            <input
                              className="border p-1 rounded w-full text-sm"
                              value={editItem?.motor || ""}
                              onChange={(e) =>
                                setEditItem((prev: any) => {
                                  if (!prev) {
                                    return {
                                      id: item.id,
                                      nama: item.nama,
                                      plat: item.plat,
                                      no_wa: item.no_wa,
                                      layanan: item.layanan,
                                      subcategory: item.subcategory,
                                      motor: e.target.value,
                                      bagianMotor: item.bagianMotor,
                                      hargaLayanan: item.hargaLayanan,
                                      hargaSparepart: item.hargaSparepart,
                                      totalHarga: item.totalHarga,
                                      status: item.status,
                                      waktu: item.waktu,
                                      gerai: item.gerai,
                                    };
                                  }
                                  return {
                                    ...prev,
                                    motor: e.target.value,
                                  };
                                })
                              }
                            />
                          ) : (
                            item.motor
                          )}
                        </td>
                      </td>
                      <td className="border p-2 text-sm">
                        {isEditing ? (
                          <input
                            className="border p-1 rounded w-full text-sm"
                            value={editItem?.bagianMotor || ""}
                            onChange={(e) =>
                              setEditItem((prev: any) => {
                                if (!prev) {
                                  return {
                                    id: item.id,
                                    nama: item.nama,
                                    plat: item.plat,
                                    no_wa: item.no_wa,
                                    layanan: item.layanan,
                                    subcategory: item.subcategory,
                                    motor: item.motor,
                                    bagianMotor: e.target.value,
                                    hargaLayanan: item.hargaLayanan,
                                    hargaSparepart: item.hargaSparepart,
                                    totalHarga: item.totalHarga,
                                    status: item.status,
                                    waktu: item.waktu,
                                    gerai: item.gerai,
                                  };
                                }
                                return {
                                  ...prev,
                                  bagianMotor: e.target.value,
                                };
                              })
                            }
                          />
                        ) : (
                          item.bagianMotor
                        )}
                      </td>
                      <td className="border p-2 text-sm">
                        {isEditing ? (
                          <input
                            className="border p-1 rounded w-full text-sm"
                            value={editItem?.bagianMotor2 || ""}
                            onChange={(e) =>
                              setEditItem((prev: any) => {
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
                                    hargaSparepart: item.hargaSparepart,
                                    totalHarga: item.totalHarga,
                                    status: item.status,
                                    waktu: item.waktu,
                                    gerai: item.gerai,
                                  };
                                }
                                return {
                                  ...prev,
                                  bagianMotor2: e.target.value,
                                };
                              })
                            }
                          />
                        ) : (
                          item.bagianMotor2
                        )}
                      </td>

                      <td className="border p-2 text-sm">
                        {isEditing ? (
                          <input
                            className="border p-1 rounded w-full text-sm"
                            value={editItem?.hargaLayanan || ""}
                            onChange={(e) =>
                              setEditItem((prev: any) => {
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
                                    hargaSparepart: item.hargaSparepart,
                                    totalHarga: item.totalHarga,
                                    status: item.status,
                                    waktu: item.waktu,
                                    gerai: item.gerai,
                                  };
                                }
                                return {
                                  ...prev,
                                  hargaLayanan: e.target.value,
                                };
                              })
                            }
                          />
                        ) : (
                          item.hargaLayanan.toLocaleString()
                        )}
                      </td>
                      {item.sparepart && !isEditing ? (
                        <td className="border p-2 text-sm">{item.sparepart}</td>
                      ) : (
                        <td>
                          <select
                            onChange={(e: any) => {
                              const confirmation = confirm(
                                "Apakah Anda yakin ingin menambahkan seal?"
                              );
                              if (confirmation) {
                                if (JSON.parse(e.target.value).qty == 0) {
                                  return Swal.fire({
                                    icon: "warning",
                                    title: "Gagal!",
                                    text: "Stok Sparepart sudah habis.",
                                    timer: 2000,
                                    showConfirmButton: false,
                                  });
                                }
                                const sendMessage = (data: any) => {
                                  channel?.send({
                                    type: "broadcast",
                                    event: "sparepart",
                                    payload: {
                                      data,
                                      timestamp: new Date().toISOString(),
                                    },
                                  });
                                };
                                sendMessage(item.gerai);
                                updateCustomer({
                                  ...JSON.parse(e.target.value),
                                  id: item.id,
                                }).then((res) => {
                                  if (res.success) window.location.reload();
                                });
                              } else {
                                return;
                              }
                            }}
                            name=""
                            id=""
                          >
                            <option value="">Tambah Sparepart</option>
                            {dataSeal.map((item: any) => (
                              <option
                                value={JSON.stringify({
                                  sparepart: item.type + " - " + item.size,
                                  harga_sparepart: item.price,
                                  sparepart_id: item.id,
                                  qty: item.qty,
                                })}
                              >
                                {item.type} - {item.size} -{item.qty}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}
                      <td className="border p-2 text-sm">
                        {item.hargaSparepart.toLocaleString()}
                      </td>
                      <td className="border p-2 text-sm">
                        Rp.{" "}
                        {(
                          item.hargaLayanan + item.hargaSparepart
                        ).toLocaleString()}
                      </td>
                      <td className="border p-2 text-sm font-bold">
                        {item.status}
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
                            {item.status == "PROGRESS" && (
                              <div className="flex flex-col gap-1">
                                <button
                                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                                  onClick={() => onEdit(item)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm"
                                  onClick={() => {
                                    let yakin = confirm(
                                      "Apakah kamu yakin ingin FINISH Motor ini?"
                                    );

                                    if (yakin) {
                                      // aksi jika pengguna klik OK
                                      onFinish(item.id, item.sparepart_id);
                                    } else {
                                      // aksi jika pengguna klik Cancel
                                      return;
                                    }
                                  }}
                                >
                                  Finish
                                </button>
                                <button
                                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                                  onClick={() => {
                                    let yakin = confirm(
                                      "Apakah kamu yakin ingin CANCEL Motor ini?"
                                    );

                                    if (yakin) {
                                      // aksi jika pengguna klik OK
                                      handleCancelClick(item);
                                    } else {
                                      // aksi jika pengguna klik Cancel
                                      return;
                                    }
                                  }}
                                >
                                  Cancel
                                </button>
                              </div>
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
