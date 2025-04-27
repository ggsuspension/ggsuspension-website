import React from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken, decodeToken } from "@/utils/auth";

// Definisikan tipe props untuk ProtectedRoute
interface ProtectedRouteProps {
  children: React.ReactNode; // Menggantikan Element agar lebih fleksibel
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const token = getAuthToken();

  if (!token) {
    // Jika tidak ada token, arahkan ke login
    return <Navigate to="/auth/login" replace />;
  }

  const decoded = decodeToken(token);
  if (!decoded || !decoded.role) {
    // Jika token tidak valid atau tidak ada role, arahkan ke login
    return <Navigate to="/auth/login" replace />;
  }

  // Periksa apakah role pengguna ada dalam allowedRoles
  if (!allowedRoles.includes(decoded.role)) {
    // Jika role tidak diizinkan, arahkan ke halaman lain (misalnya /admin)
    return <Navigate to="/" replace />;
  }

  // Jika semua pengecekan lolos, render children
  return <>{children}</>;
};

export default ProtectedRoute;
