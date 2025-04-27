import { Facebook, Youtube } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { BsInstagram, BsTiktok } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { useLocation } from "react-router-dom";
import { Link } from "react-scroll";

export default function NewNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen1, setDropdownOpen1] = useState<number | null>(null);
  const [dropdownOpen2, setDropdownOpen2] = useState<number | null>(null);
  const dropdownRef1 = useRef<HTMLDivElement | null>(null);
  const dropdownRef2 = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  // Halaman yang menyembunyikan navigasi
  const hiddenNavPaths = ["/antrian", "/klaim_garansi"];
  const isHidden = hiddenNavPaths.includes(location.pathname);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef1.current &&
        !dropdownRef1.current.contains(event.target as Node) &&
        dropdownRef2.current &&
        !dropdownRef2.current.contains(event.target as Node)
      ) {
        setDropdownOpen1(null);
        setDropdownOpen2(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full bg-black/50">
      <div className="flex items-center justify-between px-8 py-2 shadow-md text-white relative container mx-auto">
        {/* Logo Tetap Ditampilkan */}
        <div className="h-16 w-32 flex items-center justify-start">
          <a href="/" className="cursor-pointer">
            <img src="/LOGO%20REMAKE.png" alt="Logo" className="h-12" />
          </a>
        </div>

        {/* Navigasi hanya ditampilkan jika tidak dalam halaman tertentu */}
        {!isHidden && (
          <>
            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-6">
              <div className="relative" ref={dropdownRef1}>
                <button
                  className="flex items-center justify-betweenpx-2 py-6 font-medium hover:text-yellow-300"
                  onClick={() =>
                    setDropdownOpen1(dropdownOpen1 === 0 ? null : 0)
                  }
                >
                  LAYANAN
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {dropdownOpen1 === 0 && (
                  <div className="absolute left-0 mt-2 w-48 bg-black/80 shadow-md">
                    {/* <a
                      href="/layanan_kami"
                      className="block px-4 py-2 hover:text-yellow-300 cursor-pointer"
                      onClick={() => setDropdownOpen1(null)}
                    >
                      
                    </a> */}
                    <Link
                      smooth={true}
                      duration={500}
                      to="layanan_kami"
                      className="block px-4 py-2 hover:text-yellow-300 cursor-pointer"
                      onClick={() => setDropdownOpen1(null)}
                    >
                      LAYANAN KAMI
                    </Link>
                    <a
                      href="/#/antrian"
                      className="block px-4 py-2 hover:text-yellow-300 cursor-pointer"
                      onClick={() => setDropdownOpen1(null)}
                    >
                      ANTRIAN GERAI
                    </a>
                    <a
                      href="/#/klaim_garansi"
                      className="block px-4 py-2 hover:text-yellow-300 cursor-pointer"
                      onClick={() => setDropdownOpen1(null)}
                    >
                      KLAIM GARANSI
                    </a>
                  </div>
                )}
              </div>
              <Link
                smooth={true}
                duration={500}
                to="cek_harga"
                className="px-2 py-6 font-medium cursor-pointer hover:text-yellow-300"
              >
                CEK HARGA
              </Link>
              <div className="relative" ref={dropdownRef2}>
                <button
                  className="flex items-center justify-between px-2 py-6 font-medium hover:text-yellow-300"
                  onClick={() =>
                    setDropdownOpen2(dropdownOpen2 === 0 ? null : 0)
                  }
                >
                  TENTANG
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {dropdownOpen2 === 0 && (
                  <div className="absolute left-0 mt-2 w-48 bg-black/80 shadow-md">
                    <Link
                      smooth={true}
                      duration={500}
                      to="visi-misi"
                      className="block px-4 py-2 hover:text-yellow-300 cursor-pointer"
                      onClick={() => setDropdownOpen2(null)}
                    >
                      VISI & MISI
                    </Link>
                    <Link
                      smooth={true}
                      duration={500}
                      to="testimoni"
                      className="block px-4 py-2 hover:text-yellow-300 cursor-pointer"
                      onClick={() => setDropdownOpen2(null)}
                    >
                      TESTIMONIAL
                    </Link>
                    <Link
                      smooth={true}
                      duration={500}
                      to="artikel"
                      className="block px-4 py-2 hover:text-yellow-300 cursor-pointer"
                      onClick={() => setDropdownOpen2(null)}
                    >
                      VIDEO KAMI
                    </Link>
                  </div>
                )}
              </div>
              <Link
                smooth={true}
                duration={500}
                to="gerai"
                className="px-2 py-6 font-medium cursor-pointer hover:text-yellow-300"
              >
                GERAI
              </Link>
              <Link
                smooth={true}
                duration={500}
                to="footer"
                className="px-2 py-6 font-medium cursor-pointer hover:text-yellow-300"
              >
                KONTAK
              </Link>
              <a
                href="./#/scan"
                className="px-2 py-6 font-medium cursor-pointer hover:text-yellow-300"
              >
                SCAN QR
              </a>
            </nav>
          </>
        )}

        {/* Ikon Sosial Media Tetap Ditampilkan */}
        <div className="flex items-center justify-end gap-4">
          <a
            href="https://www.instagram.com/officialggsuspension"
            className="text-2xl"
          >
            <BsInstagram className="text-white hover:text-yellow-300 transition-colors duration-200" />
          </a>
          <a
            href="https://www.tiktok.com/@officialggsuspension"
            className="text-2xl"
          >
            <BsTiktok className="text-white hover:text-yellow-300 transition-colors duration-200" />
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61567120288124"
            className="text-2xl"
          >
            <Facebook className="text-white hover:text-yellow-300 transition-colors duration-200" />
          </a>
          <a
            href="https://www.youtube.com/@officialggsuspension"
            className="text-2xl"
          >
            <Youtube className="text-white hover:text-yellow-300 transition-colors duration-200" />
          </a>
          {/* Tombol Hamburger dipindahkan ke kanan icon */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-4 z-50"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {!isHidden && isOpen && (
        <div className="md:hidden bg-black/40 shadow-md text-white pb-2">
          <span className="group block py-2 px-4 cursor-pointer">
            LAYANAN <IoIosArrowDown className="inline" />
            <Link
              smooth={true}
              duration={500}
              to="layanan_kami"
              className="group-hover:block hidden py-2 px-4 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              LAYANAN KAMI
            </Link>
            <a
              href="./#/klaim_garansi"
              className="group-hover:block hidden py-2 px-4 cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              KLAIM GARANSI
            </a>
          </span>

          <span className="group block py-2 px-4 cursor-pointer">
            TENTANG KAMI <IoIosArrowDown className="inline" />
            <Link
              smooth={true}
              duration={500}
              to="visi-misi"
              className="group-hover:block hidden py-2 px-4  cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              VISI & MISI
            </Link>
            <Link
              smooth={true}
              duration={500}
              to="testimoni"
              className="group-hover:block hidden py-2 px-4  cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              TESTIMONI
            </Link>
            <Link
              smooth={true}
              duration={500}
              to="video"
              className="group-hover:block hidden py-2 px-4  cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              VIDEO KAMI
            </Link>
          </span>

          <Link
            smooth={true}
            duration={500}
            to="cek_harga"
            className="block py-2 px-4 hover:text-yellow-400 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            CEK HARGA
          </Link>
          <Link
            smooth={true}
            duration={500}
            to="gerai"
            className="block py-2 px-4 hover:text-yellow-400 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            GERAI
          </Link>
          <Link
            smooth={true}
            duration={500}
            to="footer"
            className="block py-2 px-4 hover:text-yellow-400 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            KONTAK
          </Link>
          <a
            href="/#/antrian"
            className="block py-2 px-4 hover:text-yellow-400 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            ANTRIAN GERAI
          </a>
          <a
            href="/#/scan"
            className="block py-2 px-4 hover:text-yellow-400 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            SCAN QR
          </a>
        </div>
      )}
    </header>
  );
}
