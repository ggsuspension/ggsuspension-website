import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Layout from "./components/dashboard";
import ScanQR from "./components/fragments/ScanQR";
import FormPelayanan from "./components/pages/FormPelanggan";
import AntrianPage from "./components/pages/AntrianPage";

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
    element: <ScanQR />,
  },
  {
    path: "/form-pelanggan",
    element: <FormPelayanan />,
  },
  {
    path: "/antrian/:gerai",
    element: <AntrianPage />,
  },
]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
