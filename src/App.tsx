import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Layout from "./components/dashboard";
import ScanQR from "./components/fragments/ScanQR";
import FormPelayanan from "./components/pages/FormPelanggan";
import AntrianPage from "./components/pages/AntrianPage";
import { getCookie } from "./utils/getCookie";

let cookieDataPelanggan: any = getCookie("pelangganGGSuspension");
cookieDataPelanggan = cookieDataPelanggan&&JSON.parse(cookieDataPelanggan);
const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/admin",
    element: <Layout />,
  },
  {
    path: "/scan",
    element: !cookieDataPelanggan?<ScanQR />:<Navigate to={`/antrian/${cookieDataPelanggan.gerai.toLowerCase()}`}/>,
  },
  {
    path: "/form-pelanggan",
    element: !cookieDataPelanggan?<FormPelayanan/>:<Navigate to={`/antrian/${cookieDataPelanggan.gerai.toLowerCase()}`} />,
  },
  {
    path: "/antrian/:gerai",
    element: cookieDataPelanggan?<AntrianPage />:<Navigate to="/scan"/>,
  },
]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
