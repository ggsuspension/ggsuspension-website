import axios from "axios";
import {
  Motor,
  ServiceOrderPayload,
  WarehouseSeal,
  CreateSealPayload,
  StockRequest,
  Antrian,
  Sparepart,
} from "@/types";
import { getAuthToken, setAuthToken } from "./auth";
import { API_BASE_URL } from "./ggsAPI";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Interceptor: Menambahkan token ke header", {
        token,
        headers: config.headers,
        url: config.url,
      });
    } else {
      console.warn("No auth token found in localStorage", { url: config.url });
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized request", {
        url: error.config.url,
        response: error.response.data,
      });
      localStorage.removeItem("auth_token");
      window.location.href = "/#/auth/login";
    }
    return Promise.reject(error);
  }
);

export const formatDateForAPI = (date: Date): string => {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
};
export const formatDateIncomeExpense = (date: Date): string => {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  return `${year}-${month}-${day}`;
};

// Fungsi untuk register
export const registerUser = async (data: {
  username: string;
  password: string;
  gerai_id: string;
  role?: string;
}) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to register user: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to register: ${(error as Error).message}`);
  }
};

// Fungsi untuk login
export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/login", data);
    const { token } = response.data;
    setAuthToken(token); // Menggunakan setAuthToken dari auth.ts
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to login: ${error.response.data?.error || error.message}`
      );
    }
    throw new Error(`Failed to login: ${(error as Error).message}`);
  }
};

export const getServices = async ({
  signal,
}: { signal?: AbortSignal } = {}): Promise<{ id: number; name: string }[]> => {
  try {
    const response = await api.get("/categories/getAll", { signal });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch services: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to fetch services: ${(error as Error).message}`);
  }
};

export const getServiceTypes = async (
  categoryId?: number,
  { signal }: { signal?: AbortSignal } = {}
): Promise<{ id: number; name: string }[]> => {
  try {
    const response = await api.get("/subcategories/getAll", {
      params: categoryId ? { categoryId } : undefined,
      signal,
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch service types: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to fetch service types: ${(error as Error).message}`
    );
  }
};

export const getMotors = async ({
  signal,
}: { signal?: AbortSignal } = {}): Promise<Motor[]> => {
  try {
    const response = await api.get("/motors/getAll", { signal });
    console.log("getMotors - Data:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("getMotors - Error:", error);
    throw new Error(`Failed to fetch motors: ${(error as Error).message}`);
  }
};

export async function getMotorParts(options: any = {}) {
  try {
    const response = await api.get(`/motorParts`, {
      signal: options.signal,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch motor parts: ${error.message}`);
  }
}

export const getAllSeals = async ({
  signal,
}: { signal?: AbortSignal } = {}): Promise<Sparepart[]> => {
  try {
    const response = await api.get(`/seals/getAll`, {
      signal,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    return response.data;
  } catch (error) {
    console.error("getAllSeals - Error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch seals: ${error.response?.data?.error || error.message}`
      );
    }
    throw new Error(`Failed to fetch seals: ${(error as Error).message}`);
  }
};

// Fungsi untuk mengambil seal berdasarkan geraiId dan motorId (opsional)
export const getSealsByGerai = async ({
  geraiId,
  motorId,
  signal,
}: {
  geraiId: number;
  motorId?: number;
  signal?: AbortSignal;
}): Promise<Sparepart[]> => {
  try {
    const seals = await getAllSeals({ signal });

    const filteredSeals = seals.filter(
      (seal) =>
        seal.gerai_id === geraiId &&
        (!motorId || seal.motor_id === motorId) &&
        seal.qty > 0
    );

    console.log(
      `getSealsByGerai - Filtered Seals for Gerai ${geraiId}:`,
      filteredSeals
    );
    return filteredSeals;
  } catch (error) {
    console.error("getSealsByGerai - Error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch seals by gerai: ${
          error.response?.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to fetch seals by gerai: ${(error as Error).message}`
    );
  }
};

export const updateSeal = async (id: number, qty?: number) => {
  try {
    const seals = await api.put(`/seals/update/${id}`, { qty });
    return seals.data;
  } catch (error) {
    console.error("getSealsByGerai - Error:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch seals by gerai: ${
          error.response?.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to fetch seals by gerai: ${(error as Error).message}`
    );
  }
};

// Fungsi untuk mengirim permintaan seal baru
export const requestSeal = async (payload: {
  gerai_id: number;
  sparepart_id: number;
  qty_requested: number;
}) => {
  try {
    const response = await api.post("/seals/stock-requests", payload);
    console.log("Response from requestSeal:", response.data); // Log respons
    console.log("created_at:", response.data.data.created_at); // Log created_at
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to request seal: ${error.response.data?.error || error.message}`
      );
    }
    throw new Error(`Failed to request seal: ${(error as Error).message}`);
  }
};

export const approveStockRequest = async (id: number) => {
  try {
    const response = await api.post(`/seals/stock-requests/${id}/approve`);
    console.log("Response from approveStockRequest:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to approve stock request: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to approve stock request: ${(error as Error).message}`
    );
  }
};

export const rejectStockRequest = async (id: number) => {
  try {
    const response = await api.post(`/seals/stock-requests/${id}/rejected`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error rejecting stock request:", {
      id,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw new Error(
      error.response?.data?.message || "Gagal menolak stock request"
    );
  }
};

export const getStockRequestsByGerai = async (geraiId: number) => {
  try {
    const response = await api.get(`/seals/stock-requests/gerai/${geraiId}`);
    if (!response.data || !response.data.data) {
      console.warn("No data found in response:", response.data);
      return [];
    }
    console.log("Extracted Stock Requests:", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching stock requests:", {
      geraiId,
      error: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });
    return [];
  }
};

export const createServiceOrder = async (
  data: ServiceOrderPayload
): Promise<any> => {
  try {
    const response = await api.post("/orders/create", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to create order: ${error.response.data?.error || error.message}`
      );
    }
    throw new Error(`Failed to create order: ${(error as Error).message}`);
  }
};

export const createPelanggan = async (data: any): Promise<any> => {
  try {
    const response = await api.post("/customers/create", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to create pelanggan: ${error.response.status} - ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to create pelanggan: ${(error as Error).message}`);
  }
};

export const getAntrianByDateAndGerai = async ({
  geraiId,
  date,
}: {
  geraiId: number | string;
  date: string;
}): Promise<{ data: Antrian[] }> => {
  try {
    const response = await api.get("/antrian", {
      params: {
        gerai_id: geraiId,
        date,
      },
    });
    return {
      data: Array.isArray(response.data.data) ? response.data.data : [],
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      let message = data?.error || error.message;
      if (status === 401) {
        message = "Sesi telah berakhir. Silakan login ulang.";
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      } else if (status === 403) {
        message = "Akses ditolak. Anda tidak memiliki izin untuk gerai ini.";
      } else if (status === 422) {
        message = data?.details
          ? Object.values(data.details).join(", ")
          : "Input tidak valid.";
      } else if (status === 404) {
        message = "Data antrian tidak ditemukan.";
      }
      throw new Error(message);
    }
    throw new Error(`Gagal mengambil antrian: ${(error as Error).message}`);
  }
};

export const getAntrian = async ({
  geraiId,
  date,
}: {
  geraiId: number | string;
  date: string;
}): Promise<{ data: Antrian[] }> => {
  try {
    const response = await api.get("/antrian", {
      params: {
        gerai_id: geraiId,
        date,
      },
    });
    return {
      data: Array.isArray(response.data.data) ? response.data.data : [],
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      let message = data?.error || error.message;
      if (status === 401) {
        message = "Sesi telah berakhir. Silakan login ulang.";
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      } else if (status === 403) {
        message = "Akses ditolak. Anda tidak memiliki izin untuk gerai ini.";
      } else if (status === 422) {
        message = data?.details
          ? Object.values(data.details).join(", ")
          : "Input tidak valid.";
      } else if (status === 404) {
        message = "Data antrian tidak ditemukan.";
      }
      throw new Error(message);
    }
    throw new Error(`Gagal mengambil antrian: ${(error as Error).message}`);
  }
};

export const updateAntrian = async (id: number, data: any) => {
  try {
    const token = getAuthToken();
    console.log(
      "updateAntrian - Token:",
      token ? "Ada token" : "Tidak ada token"
    );
    console.log("updateAntrian - Data dikirim:", JSON.stringify(data, null, 2));
    if (!token) {
      console.error(
        "updateAntrian: Tidak ada token autentikasi. Mengarahkan ke login."
      );
      window.location.href = "/auth/login";
      throw new Error("No authentication token found. Please login again.");
    }

    const response = await api.put(`/antrian/${id}`, data);
    console.log("updateAntrian - Respons:", response.data);
    return response.data;
  } catch (error) {
    console.error("updateAntrian - Error:", error);
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        console.error(
          "updateAntrian: Token tidak valid atau kedaluwarsa. Mengarahkan ke login."
        );
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
        throw new Error("Sesi telah berakhir. Silakan login ulang.");
      }
      throw new Error(
        `Failed to update antrian: ${data?.error || error.message}`
      );
    }
    throw new Error(`Failed to update antrian: ${(error as Error).message}`);
  }
};

export const finishOrder = async (id: number): Promise<any> => {
  try {
    const response = await api.post(`/antrian/finish/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to finish order: ${error.response.data?.error || error.message}`
      );
    }
    throw new Error(`Failed to finish order: ${(error as Error).message}`);
  }
};

export const cancelOrder = async (id: number): Promise<any> => {
  try {
    const response = await api.post(`/antrian/cancel/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to cancel order: ${error.response.data?.error || error.message}`
      );
    }
    throw new Error(`Failed to cancel order: ${(error as Error).message}`);
  }
};

export const getAntrianSemuaGerai = async (): Promise<any> => {
  try {
    const response = await api.get("/antrian/all");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch antrian: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to fetch antrian: ${(error as Error).message}`);
  }
};

export const getAllCustomers = async (): Promise<any> => {
  try {
    const response = await api.get("/customers/getAll");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch customers: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to fetch customers: ${(error as Error).message}`);
  }
};

export const getCustomersByGerai = async (gerai: string): Promise<any> => {
  try {
    const response = await api.get(`/customers/${gerai}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch customers: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to fetch customers: ${(error as Error).message}`);
  }
};

export const getAntrianByGeraiAndDate = async (date: string, gerai: any) => {
  try {
    let semua_antrian = await getAntrianCustomer();
    semua_antrian = semua_antrian.filter(
      (item: any) => item.gerai.toLowerCase() == gerai.toLowerCase()
    );
    semua_antrian = semua_antrian.filter(
      (item: any) => item.created_at.split("T")[0] == date.split("T")[0]
    );
    return semua_antrian;

    // let geraiId: number;
    // if (typeof gerai === "string") {
    //   const gerais = await getGerais();
    //   const selectedGerai = gerais.find(
    //     (g) => g.name.toLowerCase() === gerai.toLowerCase()
    //   );
    //   if (!selectedGerai) {
    //     throw new Error(`Gerai ${gerai} tidak ditemukan`);
    //   }
    //   geraiId = selectedGerai.id;
    // } else {
    //   geraiId = gerai;
    // }
    // const response = await api.get("/antrian", {
    //   params: { date, gerai_id: geraiId },
    // });
    // console.log("getAntrianByGeraiAndDate - Response:", response.data);
    // return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch antrian: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to fetch antrian: ${(error as Error).message}`);
  }
};

export const getAllAntrianByDate = async (date: string) => {
  try {
    const geraiList = await getGerais();
    const promises = geraiList.map((gerai) =>
      getAntrianByGeraiAndDate(date, gerai.name)
    );
    const results = await Promise.all(promises);
    return results.flat();
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch all antrian: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to fetch all antrian: ${(error as Error).message}`);
  }
};

export const updatePelanggan = async (data: any): Promise<any> => {
  try {
    const response = await api.put(`/customers/${data.id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to update pelanggan: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to update pelanggan: ${(error as Error).message}`);
  }
};

export const getPelangganByDateRange = async (
  startDate: string,
  endDate: string,
  plat: string
): Promise<any> => {
  try {
    const response = await api.get("/customers", {
      params: { startDate, endDate, plat },
    });
    console.log("Raw Pelanggan Response:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch pelanggan: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to fetch pelanggan: ${(error as Error).message}`);
  }
};

export const claimWarranty = async (id: string): Promise<any> => {
  try {
    const response = await api.post(`/customers/${id}/claim-warranty`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to claim warranty: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to claim warranty: ${(error as Error).message}`);
  }
};

export const getServicePricing = async (): Promise<any> => {
  try {
    const response = await api.get("/services/service-pricing");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch service pricing: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to fetch service pricing: ${(error as Error).message}`
    );
  }
};

export const getTotalPendapatan = async (
  startDate?: string,
  endDate?: string
): Promise<number> => {
  try {
    const response = await api.get("/daily-net-revenue/total-revenue", {
      params: {
        startDate: startDate || formatDateForAPI(new Date()),
        endDate: endDate || formatDateForAPI(new Date()),
      },
    });
    return response.data.data || 0;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch total pendapatan: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to fetch total pendapatan: ${(error as Error).message}`
    );
  }
};

export const getPendapatanPerGerai = async (
  startDate?: string,
  endDate?: string
): Promise<{
  data: { gerai: string; date: string; totalRevenue: number }[];
}> => {
  try {
    const response = await api.get("/finance/gerai", {
      params: { startDate, endDate },
    });
    return {
      data: Array.isArray(response.data.data) ? response.data.data : [],
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch pendapatan per gerai: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to fetch pendapatan per gerai: ${(error as Error).message}`
    );
  }
};

export const getGerais = async ({
  signal,
}: { signal?: AbortSignal } = {}): Promise<
  {
    id: number;
    name: string;
    location: string;
    createdAt: string;
    updatedAt: string;
  }[]
> => {
  try {
    const response = await api.get("/gerais/getAll", { signal });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("getGerais - Error:", error);
    throw new Error(`Failed to fetch gerais: ${(error as Error).message}`);
  }
};

export const getDailyTrend = async (
  startDate: string,
  endDate: string,
  geraiId?: number
): Promise<{ data: { date: string; netRevenue: number; gerai: string }[] }> => {
  try {
    const response = await api.get("/daily-net-revenue/daily-trend", {
      params: {
        startDate,
        endDate,
        gerai_id: geraiId,
      },
    });
    const data = Array.isArray(response.data.data)
      ? response.data.data.map((item: any) => ({
          date: item.date,
          netRevenue: parseFloat(item.netRevenue || item.net_revenue || "0"),
          gerai: item.gerai?.name || item.gerai || "",
        }))
      : [];
    return { data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch daily trend: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to fetch daily trend: ${(error as Error).message}`);
  }
};

export const getDailyIncomeExpense = async (
  date: string,
  geraiId?: number
): Promise<{
  data: { total_revenue: string; total_expenses: string; net_revenue: string };
}> => {
  try {
    const response = await api.get("/daily-net-revenue/daily-income-expense", {
      params: {
        date,
        gerai_id: geraiId,
      },
    });
    console.log(
      "getDailyIncomeExpense response:",
      JSON.stringify(response.data, null, 2)
    );
    const data = response.data.data || {
      total_revenue: "0",
      total_expenses: "0",
      net_revenue: "0",
    };
    return { data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch daily income/expense: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to fetch daily income/expense: ${(error as Error).message}`
    );
  }
};

export const getDailyTrendTotal = async (
  startDate: string,
  endDate: string,
  geraiId?: number
): Promise<number> => {
  try {
    const response = await api.get("/daily-net-revenues/daily-trend", {
      params: { startDate, endDate, geraiId, page: 1, limit: 1 },
    });
    return response.data.pagination?.totalItems || 0;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch daily trend total: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to fetch daily trend total: ${(error as Error).message}`
    );
  }
};


export const calculateDailyNetRevenue = async (
  date: string,
  batchSize: number = 50
): Promise<any> => {
  try {
    const response = await api.post("/daily-net-revenue/calculate", {
      date,
      batchSize,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to calculate daily net revenue: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to calculate daily net revenue: ${(error as Error).message}`
    );
  }
};

export async function antrianSemuaGerai() {
  try {
    const response = await api.get("/antrian/getAll");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch antrian: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to fetch antrian: ${(error as Error).message}`);
  }
}
export async function totalPendapatan(id: number) {
  try {
    let pendapatan = await api.get("/antrian/getAll");
    pendapatan = pendapatan.data.data
      .filter((item: any) => item.gerai_id == id)
      .filter((item: any) => item.status === "FINISHED")
      .reduce((total: number, item: any) => total + item.harga_layanan, 0);
    return pendapatan;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch antrian: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to fetch antrian: ${(error as Error).message}`);
  }
}

// export const getAllExpenses = async (
//   geraiId?: number,
//   startDate?: string,
//   endDate?: string
// ): Promise<{
//   data: {
//     geraiId: number;
//     amount: number;
//     date: string;
//     description?: string;
//     expenseCategoryId?: number;
//   }[];
//   total: number;
// }> => {
//   try {
//     const response = await api.get("/expenses", {
//       params: {
//         geraiId,
//         startDate,
//         endDate,
//       },
//     });
//     const data = Array.isArray(response.data.data)
//       ? response.data.data.map((item: any) => ({
//           geraiId: item.geraiId,
//           amount: item.amount,
//           date: item.date,
//           description: item.description || "",
//           expenseCategoryId: item.expenseCategoryId,
//         }))
//       : [];
//     const total = response.data.pagination?.totalItems || data.length;
//     return { data, total };
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(
//         `Failed to fetch expenses: ${
//           error.response.data?.error || error.message
//         }`
//       );
//     }
//     throw new Error(`Failed to fetch expenses: ${(error as Error).message}`);
//   }
// };

export const getDailyTrendAll = async (
  startDate: string,
  endDate: string
): Promise<{
  data: {
    gerai_id: number;
    gerai: string;
    data: { date: string; netRevenue: number }[];
  }[];
}> => {
  try {
    console.log("getDailyTrendAll params:", { startDate, endDate });
    const response = await api.get("/daily-net-revenue/daily-trend-all", {
      params: { startDate, endDate },
    });
    console.log(
      "getDailyTrendAll response:",
      JSON.stringify(response.data, null, 2)
    );
    const data = Array.isArray(response.data.data)
      ? response.data.data.map((item: any) => ({
          gerai_id: item.gerai_id,
          gerai: item.gerai,
          data: item.data.map((d: any) => ({
            date: d.date,
            netRevenue: parseFloat(d.netRevenue || "0"),
          })),
        }))
      : [];
    return { data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("getDailyTrendAll error:", {
        status: error.response.status,
        data: error.response.data,
        params: { startDate, endDate },
      });
      throw new Error(
        `Failed to fetch daily trend all: ${
          error.response.data?.error || error.message
        }`
      );
    }
    console.error("getDailyTrendAll non-Axios error:", error);
    throw new Error(
      `Failed to fetch daily trend all: ${(error as Error).message}`
    );
  }
};

export const getAllExpensesAll = async (
  startDate: string,
  endDate: string
): Promise<{
  data: { gerai_id: number; gerai: string; data: any[] }[];
}> => {
  try {
    console.log("getAllExpensesAll params:", { startDate, endDate });
    const response = await api.get("/expenses/all-gerais", {
      params: { startDate, endDate },
    });
    console.log(
      "getAllExpensesAll response:",
      JSON.stringify(response.data, null, 2)
    );
    const data = Array.isArray(response.data.data)
      ? response.data.data.map((item: any) => ({
          gerai_id: item.gerai_id,
          gerai: item.gerai,
          data: item.data,
        }))
      : [];
    return { data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("getAllExpensesAll error:", {
        status: error.response.status,
        data: error.response.data,
        params: { startDate, endDate },
      });
      throw new Error(
        `Failed to fetch expenses all: ${
          error.response.data?.error || error.message
        }`
      );
    }
    console.error("getAllExpensesAll non-Axios error:", error);
    throw new Error(
      `Failed to fetch expenses all: ${(error as Error).message}`
    );
  }
};

export const getAllExpenses = async (
  geraiId: number,
  startDate: string,
  endDate: string
): Promise<{ data: any[] }> => {
  try {
    console.log("getAllExpenses params:", {
      gerai_id: geraiId,
      startDate,
      endDate,
    });
    const response = await api.get("/expenses/all", {
      params: {
        gerai_id: geraiId,
        startDate,
        endDate,
      },
    });
    console.log(
      "getAllExpenses response:",
      JSON.stringify(response.data, null, 2)
    );
    const data = Array.isArray(response.data.data) ? response.data.data : [];
    return { data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch expenses: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to fetch expenses: ${(error as Error).message}`);
  }
};

export const getAllExpensesTotal = async (
  geraiId?: number,
  startDate?: string,
  endDate?: string
): Promise<number> => {
  try {
    const response = await api.get("/expenses/getAll", {
      params: { geraiId, startDate, endDate, page: 1, limit: 1 },
    });
    return response.data.pagination?.totalItems || 0;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch expenses total: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to fetch expenses total: ${(error as Error).message}`
    );
  }
};
export const getTotalExpenses = async () => {
  const expenses = await api.get("/total-expenses");
  return expenses.data;
};

export const getTotalRevenue = async (
  startDate?: string,
  endDate?: string,
  geraiId?: string
): Promise<number> => {
  try {
    const response = await api.get("/daily-net-revenues/total-revenue", {
      params: { startDate, endDate, geraiId },
    });
    return response.data.totalRevenue || 0;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch total revenue: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to fetch total revenue: ${(error as Error).message}`
    );
  }
};

export const createExpense = async (data: {
  geraiId: number;
  category: string;
  amount: number;
  description: string;
  date: string;
}): Promise<any> => {
  try {
    const response = await api.post("/expenses/create", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to create expense: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(`Failed to create expense: ${(error as Error).message}`);
  }
};

export const getAllExpenseCategories = async (): Promise<
  { id: number; name: string }[]
> => {
  try {
    const response = await api.get("/expenses/categories");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to fetch expense categories: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to fetch expense categories: ${(error as Error).message}`
    );
  }
};

export const createWarehouseSeal = async (data: CreateSealPayload) => {
  try {
    await api.post("/warehouse-seals/create", {
      ...data,
      motor_id: data.motor_id != 0 ? data.motor_id : null,
    });
    return "BERHASIL";
  } catch (error) {
    // if (axios.isAxiosError(error) && error.response) {
    //   throw new Error(
    //     `Failed to create warehouse seal: ${
    //       error.response.data?.error || error.message
    //     }`
    //   );
    // }
    throw new Error(
      `Failed to create warehouse seal: ${(error as Error).message}`
    );
  }
};

export const getWarehouseSeals = async (): Promise<WarehouseSeal[]> => {
  try {
    console.log("Calling API: /warehouse-seals");
    const response = await api.get("/warehouse-seals");
    console.log("Raw API response for warehouse seals:", response.data);
    const seals = response.data.data || response.data;
    console.log("Extracted seals:", seals);
    return Array.isArray(seals) ? seals : [];
  } catch (error) {
    console.error("Error in getWarehouseSeals:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("API error response:", error.response.data);
      console.error("API error status:", error.response.status);
      console.error("API error headers:", error.response.headers);
      throw new Error(
        `Failed to fetch warehouse seals: ${
          error.response.data?.error || error.message
        }`
      );
    }
    console.error("Non-Axios error:", error);
    throw new Error(
      `Failed to fetch warehouse seals: ${(error as Error).message}`
    );
  }
};

export const updateWarehouseSeal = async (
  id: number,
  data: CreateSealPayload
): Promise<WarehouseSeal> => {
  try {
    const response = await api.put(`/warehouse-seals/${id}`, {
      category: data.category,
      type: data.type,
      size: data.size,
      price: data.price,
      qty: data.qty,
      motor_id: data.motor_id == 0 ? null : data.motor_id,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to update warehouse seal: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to update warehouse seal: ${(error as Error).message}`
    );
  }
};

export const deleteWarehouseSeal = async (id: number): Promise<void> => {
  try {
    const response = await api.delete(`/warehouse-seals/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        `Failed to delete warehouse seal: ${
          error.response.data?.error || error.message
        }`
      );
    }
    throw new Error(
      `Failed to delete warehouse seal: ${(error as Error).message}`
    );
  }
};

export const getAllStockRequests = async (): Promise<StockRequest[]> => {
  try {
    const response = await api.get("/seals/stock-requests/getAll");
    console.log("Raw API response for stock requests:", response.data);
    const requests = response.data.data || response.data;
    console.log("Extracted stock requests:", requests);
    return Array.isArray(requests) ? requests : [];
  } catch (error) {
    console.error("Error in getAllStockRequests:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("API error response:", error.response.data);
      console.error("API error status:", error.response.status);
      console.error("API error headers:", error.response.headers);
      throw new Error(
        `Failed to fetch stock requests: ${
          error.response.data?.error || error.message
        }`
      );
    }
    console.error("Non-Axios error:", error);
    throw new Error(
      `Failed to fetch stock requests: ${(error as Error).message}`
    );
  }
};

export async function addCustomer(data: any) {
  const result = await api.post("/customer", data);
  return result.data;
}

export async function updateCustomer(data: any) {
  const result = await api.put(`/customer/${data.id}`, data);
  return result.data;
}

export async function getAntrianCustomer() {
  const result = await api.get("/customer");
  return result.data;
}
export async function getImages() {
  const result = await api.get("/image");
  return result.data.data;
}
export async function postImages(data: any) {
  const result = await api.post("/image", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return result.data;
}
