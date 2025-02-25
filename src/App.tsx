import { createHashRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Layout from "./components/dashboard/layout";
import ScanQR from "./components/fragments/ScanQR";

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
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
