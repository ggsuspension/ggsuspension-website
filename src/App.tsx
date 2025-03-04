import { createHashRouter, Navigate, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Layout from "./components/dashboard";
import ScanQR from "./components/fragments/ScanQR";
import AntrianPage from "./components/pages/AntrianPage";
import { getCookie } from "./utils/getCookie";
import AntrianSemuaGerai from "./components/pages/AntrianSemuaGerai";

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
    element: <ScanQR/>,
  },
  {
  path: "/antrian",
    element: <AntrianSemuaGerai/>,
  },
  {
    path: "/antrian/:gerai",
    element: cookieDataPelanggan?<AntrianPage />:<Navigate to="/scan"/>,
  },
  {
    path: "/admin/finance",
    element: <Layout/>,
  },
]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
