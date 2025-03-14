import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Layout from "./components/dashboard";
import ScanQR from "./components/fragments/ScanQR";
import AntrianPage from "./components/pages/AntrianPage";
import { getCookie } from "./utils/getCookie";
import AntrianSemuaGerai from "./components/pages/AntrianSemuaGerai";
import FormPelanggan from "./components/pages/FormPelanggan";
import Nusantara from "./components/pages/Nusantara";
import Sample from "./components/pages/Sample";

let cookieDataPelanggan: any = getCookie("pelangganGGSuspension");
cookieDataPelanggan = cookieDataPelanggan && JSON.parse(cookieDataPelanggan);
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
    path: "/admin",
    element: <Layout />,
  },
  {
    path: "/admin/edit",
    element: <Layout />,
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
    path: "/admin/finance",
    element: <Layout />,
  },
  {
    path: "/nusantara",
    element: <Nusantara />,
  },
]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
