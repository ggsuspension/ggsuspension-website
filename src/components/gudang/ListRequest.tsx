import { useEffect, useState } from "react";
import NavbarDashboard from "../fragments/NavbarDashboard";
import Swal from "sweetalert2";
import { decodeToken, getAuthToken, removeAuthToken } from "@/utils/auth";
import { useNavigate } from "react-router-dom";
import {
  getAllStockRequests,
  approveStockRequest,
  rejectStockRequest,
} from "@/utils/ggAPI";
import { StockRequest } from "@/types";

const ListRequest = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [stockRequests, setStockRequests] = useState<StockRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Login Diperlukan",
        text: "Silakan login terlebih dahulu.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/auth/login", { replace: true });
      });
      return;
    }

    const decoded = decodeToken(token);
    if (!decoded) {
      removeAuthToken();
      Swal.fire({
        icon: "error",
        title: "Token Tidak Valid",
        text: "Silakan login ulang.",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/auth/login", { replace: true });
      });
      return;
    }

    console.log("Decoded Token:", decoded);
    setUserRole(decoded.role);
    setUserName(decoded.username || "Admin");
  }, [navigate]);

  useEffect(() => {
    const fetchStockRequests = async () => {
      if (userRole !== "GUDANG") return;

      setLoading(true);
      try {
        const data = await getAllStockRequests();
        console.log("Data StockRequest dari API:", data);

        if (!data || !Array.isArray(data) || data.length === 0) {
          setStockRequests([]);
          Swal.fire({
            icon: "info",
            title: "Tidak Ada Data",
            text: "Tidak ada stock requests saat ini.",
            timer: 1500,
            showConfirmButton: false,
          });
          return;
        }

        data.forEach((item, index) => {
          if (
            !item.gerai ||
            !item.warehouse_seal ||
            !item.warehouse_seal.motor
          ) {
            console.warn(`Item ${index} (ID: ${item.id}) bermasalah:`, {
              gerai: item.gerai,
              warehouse_seal: item.warehouse_seal,
              motor: item.warehouse_seal?.motor,
            });
          }
        });

        setStockRequests(data);
      } catch (error: any) {
        console.error("Fetch Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal mengambil data stock requests.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStockRequests();
  }, [userRole]);

  const handleApprove = async (id: number) => {
    try {
      const updatedRequest = await approveStockRequest(id);
      console.log("Stock request disetujui:", updatedRequest);

      setStockRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id
            ? {
                ...request,
                status: updatedRequest.status,
                approved_at: updatedRequest.approved_at,
              }
            : request
        )
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Stock request telah disetujui.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error("Approve Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Gagal menyetujui stock request.",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const updatedRequest = await rejectStockRequest(id);
      console.log("Stock request ditolak:", updatedRequest);

      setStockRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id
            ? {
                ...request,
                status: updatedRequest.status,
                rejected_at: updatedRequest.rejected_at,
              }
            : request
        )
      );

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Stock request telah ditolak.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error("Reject Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Gagal menolak stock request.",
      });
    }
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const renderContent = () => {
    if (!userRole) {
      return <p>Loading...</p>;
    }

    console.log("User Role:", userRole);

    if (userRole === "GUDANG") {
      return (
        <div>
          <h3 className="text-2xl mb-2 font-bold">Daftar Stock Requests</h3>
          {loading ? (
            <p>Memuat data...</p>
          ) : stockRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full mt-4 border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Nama Gerai</th>
                    <th className="p-2 border">Nama Seal</th>
                    <th className="p-2 border">Jumlah</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Tanggal Request</th>
                    <th className="p-2 border">Tanggal Approve</th>
                    <th className="p-2 border">Tanggal Reject</th>
                    <th className="p-2 border">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {stockRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="p-2 border">{request.id}</td>
                      <td className="p-2 border">
                        {request.gerai?.name ||
                          `Gerai ID: ${request.gerai_id || "N/A"}`}
                      </td>
                      <td className="p-2 border">
                        {request.warehouse_seal?.motor?.name &&
                        request.warehouse_seal?.cc_range
                          ? `${request.warehouse_seal.motor.name} ${request.warehouse_seal.cc_range}`
                          : `Seal ID: ${request.warehouse_seal_id || "N/A"}`}
                      </td>
                      <td className="p-2 border">{request.qty_requested}</td>
                      <td className="p-2 border">
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            request.status === "PENDING"
                              ? "bg-yellow-500"
                              : request.status === "APPROVED"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {request.status === "PENDING"
                            ? "Menunggu"
                            : request.status === "APPROVED"
                            ? "Disetujui"
                            : "Ditolak"}
                        </span>
                      </td>
                      <td className="p-2 border">
                        {formatDate(request.created_at)}
                      </td>
                      <td className="p-2 border">
                        {formatDate(request.approved_at)}
                      </td>
                      <td className="p-2 border">
                        {formatDate(request.rejected_at)}
                      </td>
                      <td className="p-2 border">
                        {request.status === "PENDING" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>Tidak ada stock requests saat ini.</p>
          )}
        </div>
      );
    }

    if (userRole === "ADMIN") {
      return (
        <div>
          <h2 className="text-2xl font-bold mb-4">Hello, {userName}</h2>
          <p>Ini adalah halaman List Request untuk role ADMIN.</p>
        </div>
      );
    }

    return <p>Role Anda ({userRole}) belum memiliki akses ke konten ini.</p>;
  };

  return (
    <div>
      <NavbarDashboard userRole={userRole} />
      <main className="container mx-auto mt-20 p-4 m-4">{renderContent()}</main>
    </div>
  );
};

export default ListRequest;
