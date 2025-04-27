import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import ScanQR from "./components/fragments/ScanQR";
import AntrianPage from "./components/pages/AntrianPage";
import AntrianSemuaGerai from "./components/pages/AntrianSemuaGerai";
import FormPelanggan from "./components/pages/FormPelanggan";
import Nusantara from "./components/pages/Nusantara";
import Sample from "./components/pages/Sample";
import KlaimGaransi from "./components/pages/KlaimGaransi";
import Login from "./components/auth/login";
import { getCookie } from "./utils/getCookie";
import ProtectedRoute from "./components/ProtectedRoute";
import Antrian from "./components/admin/antrian";
import Finance from "./components/admin/finance";
import LayoutManager from "./components/manager/antrian";
import DashboardAdmin from "./components/admin";
import DashboardCEO from "./components/manager";
import Seals from "./components/admin/seal";
import ListRequest from "./components/gudang/ListRequest";
import SealManagement from "./components/gudang/sealManagement";
import DashboardGudang from "./components/gudang";
import FinanceCEO from "./components/manager/finance";
import AllGeraiSpareparts from "./components/cservices/spareparts";
import AntrianCS from "./components/cservices/antrian";

// Ambil data cookie
let cookieDataPelanggan: any = getCookie("pelangganGGSuspension");
cookieDataPelanggan = cookieDataPelanggan && JSON.parse(cookieDataPelanggan);

// Komponen ProtectedRoute
// const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
//   const token = getAuthToken();
//   if (!token) {
//     return <Navigate to="/admin/login" replace />;
//   }
//   return children;
// };

// Definisikan router
const router = createHashRouter([
  {
    path: "/",
    element: <Sample />,
  },
  {
    path: "/menu",
    element: <Home />,
  },
  {
    path: "/ceo-dashboard",
    element: (
      <ProtectedRoute allowedRoles={["CEO"]}>
        <DashboardCEO />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ceo-antrian",
    element: (
      <ProtectedRoute allowedRoles={["CEO"]}>
        <LayoutManager />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ceo-finance",
    element: (
      <ProtectedRoute allowedRoles={["CEO"]}>
        <FinanceCEO />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard-admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <DashboardAdmin />
      </ProtectedRoute>
    ),
  },
  {
    path: "/antrian-admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <Antrian />
      </ProtectedRoute>
    ),
  },
  {
    path: "/antrian-ceo",
    element: (
      <ProtectedRoute allowedRoles={["CEO"]}>
        <LayoutManager />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard-gudang",
    element: (
      <ProtectedRoute allowedRoles={["GUDANG"]}>
        <DashboardGudang />
      </ProtectedRoute>
    ),
  },
  {
    path: "/list-requests",
    element: (
      <ProtectedRoute allowedRoles={["GUDANG"]}>
        <ListRequest />
      </ProtectedRoute>
    ),
  },
  {
    path: "/finance",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "CEO"]}>
        <Finance />
      </ProtectedRoute>
    ),
  },
  {
    path: "/seals-gudang",
    element: (
      <ProtectedRoute allowedRoles={["GUDANG"]}>
        <SealManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/seal",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "CEO"]}>
        <Seals />
      </ProtectedRoute>
    ),
  },
  {
    path: "/antrians",
    element: (
      <ProtectedRoute allowedRoles={["CS"]}>
        <AntrianCS />
      </ProtectedRoute>
    ),
  },
  {
    path: "/spareparts",
    element: (
      <ProtectedRoute allowedRoles={["CS"]}>
        <AllGeraiSpareparts />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth/login",
    element: <Login />,
  },
  {
    path: "/scan",
    element: <ScanQR />,
  },
  {
    path: "/form-pelanggan",
    element: <FormPelanggan />,
  },
  {
    path: "/antrian",
    element: <AntrianSemuaGerai />,
  },
  {
    path: "/antrian/:gerai",
    element: <AntrianPage />,
  },
  {
    path: "/nusantara",
    element: <Nusantara />,
  },
  {
    path: "/klaim_garansi",
    element: <KlaimGaransi />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
