import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Layout from "./components/dashboard";
import ScanQR from "./components/fragments/ScanQR";
import FormPelayanan from "./components/pages/FormPelanggan";

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
    path: "/pelanggan",
    element: <FormPelayanan />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
