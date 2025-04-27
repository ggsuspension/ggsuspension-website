import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  username: string;
  geraiId: number;
  gerai: { name: string };
  role: string;
  iat?: number;
  exp?: number;
}

export const getAuthToken = (): string | null => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    console.error("Token tidak ditemukan di localStorage");
    return null;
  }
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    console.log("Decoded Token:", decoded); // Log untuk cek isi token
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.error("Token telah kedaluwarsa");
      removeAuthToken();
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error memvalidasi token:", error);
    return null;
  }
};

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("auth_token");
  console.log("Token dihapus dari localStorage");
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem("auth_token", token);
  console.log("Token disimpan di localStorage:", token);
};
