import axios from "axios";
import { Motor, MotorPart, Sparepart } from "@/types";

interface ApiOptions {
  signal?: AbortSignal;
}

export const API_BASE_URL = "https://backend-web.ggsuspension.net/api";
export const FRONTEND_URL = "https://ggsuspension.net";
// export const API_BASE_URL = "http://localhost:8000/api";
// export const FRONTEND_URL = "http://localhost:5173";

export async function getMotors(options: ApiOptions = {}): Promise<Motor[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/motors/getAll`, {
      signal: options.signal,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch motors: ${error.message}`);
  }
}

export async function getMotorParts(
  options: ApiOptions = {}
): Promise<MotorPart[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/motorParts`, {
      signal: options.signal,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch motor parts: ${error.message}`);
  }
}

export async function getServices(
  options: ApiOptions = {}
): Promise<{ id: number; name: string }[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories/getAll`, {
      signal: options.signal,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch services: ${error.message}`);
  }
}

export async function getServiceTypes(
  serviceId?: number,
  options: ApiOptions = {}
): Promise<{ id: number; name: string }[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/subcategories/getAll`, {
      params: serviceId !== undefined ? { serviceId } : undefined,
      signal: options.signal,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch service types: ${error.message}`);
  }
}

export async function getGerais(
  options: ApiOptions = {}
): Promise<{ id: number; name: string }[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/gerais/getAll`, {
      signal: options.signal,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch gerais: ${error.message}`);
  }
}

export async function getSealsByGerai(
  geraiId: number,
  options: ApiOptions = {}
): Promise<Sparepart[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/seals/gerai/${geraiId}`, {
      signal: options.signal,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Failed to fetch seals for gerai ${geraiId}: ${error.message}`
    );
  }
}

export async function getSealsByGeraiId(
  geraiId: number | undefined
): Promise<any> {
  try {
    const response = await axios.get(`${API_BASE_URL}/seals/gerai/${geraiId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Failed to fetch seals for gerai ${geraiId}: ${error.message}`
    );
  }
}

export async function createServiceOrder(data: any): Promise<{ id: number }> {
  try {
    const response = await axios.post(`${API_BASE_URL}/orders/create`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to create service order: ${error.message}`);
  }
}

export async function getCustomers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/customers/getAll`);
    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch customers: ${error.message}`);
  }
}

// export const getPelangganByDateRange = async (
//   startDate: string,
//   endDate: string,
//   options: ApiOptions = {}
// ): Promise<Pelanggan[]> => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/antrian`, {
//       params: { startDate, endDate },
//       signal: options.signal,
//     });
//     console.log("Raw Pelanggan Response:", response.data);
//     return Array.isArray(response.data) ? response.data : [];
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       throw new Error(
//         `Failed to fetch pelanggan: ${
//           error.response.data?.error || error.message
//         }`
//       );
//     }
//     throw new Error(`Failed to fetch pelanggan: ${(error as Error).message}`);
//   }
// };
