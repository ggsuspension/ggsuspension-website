import { useState } from "react";
import { LayoutDashboard, Wallet, List, PackageCheck } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeAuthToken } from "@/utils/auth";
import Swal from "sweetalert2";
import { IoIosLogOut } from "react-icons/io";

interface NavbarProps {
  userRole: string | null;
}

export default function NavbarDashboard({ userRole }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation(); // Mendapatkan rute saat ini
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      icon: "success",
      title: "Logged Out",
      text: "Anda telah berhasil logout.",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      removeAuthToken();
      navigate("/auth/login", { replace: true });
    });
  };

  // Definisikan menu berdasarkan role
  const menuItemsByRole = {
    admin: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
        path: "/dashboard-admin",
      },
      {
        name: "Antrian",
        icon: <List className="h-4 w-4" />,
        path: "/antrian-admin",
      },
      {
        name: "Spareparts",
        icon: <PackageCheck className="h-4 w-4" />,
        path: "/seal",
      },
      {
        name: "Finance",
        icon: <Wallet className="h-4 w-4" />,
        path: "/finance",
      },
    ],
    gudang: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
        path: "/dashboard-gudang",
      },
      {
        name: "List Request",
        icon: <List className="h-4 w-4" />,
        path: "/list-requests",
      },
      {
        name: "Spareparts",
        icon: <PackageCheck className="h-4 w-4" />,
        path: "/seals-gudang",
      },
    ],
    ceo: [
      {
        name: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
        path: "/ceo-dashboard",
      },
      {
        name: "Antrian",
        icon: <List className="h-4 w-4" />,
        path: "/ceo-antrian",
      },
      {
        name: "Finance",
        icon: <Wallet className="h-4 w-4" />,
        path: "/ceo-finance",
      },
    ],
    cs: [
      {
        name: "Antrian",
        icon: <List className="h-4 w-4" />,
        path: "/antrians",
      },
      {
        name: "Spareparts",
        icon: <PackageCheck className="h-4 w-4" />,
        path: "/spareparts",
      },
    ],
  };

  // Debugging: Periksa nilai userRole
  console.log("User Role in Navbar:", userRole);

  // Normalisasi userRole ke huruf kecil agar case-insensitive
  const normalizedRole =
    userRole?.toLowerCase() as keyof typeof menuItemsByRole;
  const menuItems =
    normalizedRole && menuItemsByRole[normalizedRole]
      ? menuItemsByRole[normalizedRole]
      : [];

  return (
    <header className="bg-orange-500 border-b px-6 py-3 md:py-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        <a className="flex items-center text-white font-medium">
          <img
            src="./LOGO%20REMAKE.png"
            className="w-10 h-10 md:w-12 md:h-12 shadow-lg rounded-full border-2"
            alt="Logo"
          />
          <span className="ml-4 text-base md:text-lg font-bold">
            Dashboard {userRole || "Loading..."}
          </span>
        </a>

        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:flex flex-col md:flex-row md:items-center md:space-x-4 absolute md:relative top-full left-0 w-full md:w-auto bg-orange-500 md:bg-transparent shadow-lg md:shadow-none transition-all duration-300`}
        >
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 p-3 text-white transition md:text-base ${
                  location.pathname === item.path
                    ? "bg-orange-600 rounded-md shadow-sm"
                    : "hover:bg-orange-600"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))
          ) : (
            <span className="p-3 text-white">No menu available</span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 p-3 text-white hover:bg-orange-600 transition md:text-base"
          >
            <IoIosLogOut />
          </button>
        </nav>
      </div>
    </header>
  );
}
