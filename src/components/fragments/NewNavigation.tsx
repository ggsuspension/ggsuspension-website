import { Facebook, Youtube } from "lucide-react";
import { useState } from "react";
import { BsInstagram, BsTiktok } from "react-icons/bs";
import { Link } from "react-scroll";

export default function NewNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const url = window.location.hash;

  const itemNav = [
    { nama: "LAYANAN KAMI", link: "layanan_kami" },
    { nama: "CEK HARGA", link: "cek_harga" },
    { nama: "VISI & MISI", link: "visi&misi" },
    { nama: "GERAI", link: "gerai" },
    { nama: "KONTAK", link: "footer" },
    { nama: "TESTIMONI", link: "testimoni" },
    { nama: "VIDEO KAMI", link: "artikel" },
    { nama: "ANTRIAN GERAI", link: "antrian" },
    { nama: "KLAIM GARANSI", link: "klaim_garansi" },
    { nama: "SCAN QR", link: "scan" },
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-black/50">
      <div className="flex items-center justify-between desktop:gap-32 px-4 py-2 shadow-md text-white">
        <div className="flex items-center w-full desktop:justify-end">
          <div className="h-16 w-32 flex items-center justify-center">
            <span onClick={() => window.location.reload()}>
              <a href="/" className="cursor-pointer">
                <img src="/LOGO%20REMAKE.png" alt="" className="h-12" />
              </a>
            </span>
          </div>
          <nav className="hidden md:flex ml-6 space-x-6">
            <div className="relative group">
              <div className="px-2 py-6 font-medium flex items-center group cursor-pointer">
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
                <div className="group-hover:flex hidden flex-col absolute -bottom-[13em] right-0 pb-4 px-4 pt-2 bg-black/50 gap-5">
                  {/* <Link
                    to="/home"
                    duration={500}
                    className="hover:text-yellow-300 cursor-pointer"
                  ></Link> */}
                  <Link
                    to="/layanan_kami"
                    className="hover:text-yellow-300 cursor-pointer"
                  >
                    LAYANAN KAMI
                  </Link>
                  <a
                    href="/#/antrian"
                    className="hover:text-yellow-300 cursor-pointer"
                  >
                    ANTRIAN GERAI
                  </a>
                  <a
                    href="/#/klaim_garansi"
                    className="hover:text-yellow-300 cursor-pointer"
                  >
                    KLAIM GARANSI
                  </a>
                </div>
              </div>
              <div className="absolute hidden group-hover:block bg-white shadow-lg w-48">
                {/* Dropdown content here */}
              </div>
            </div>
            <Link
              smooth={true}
              duration={500}
              to="gerai"
              className="px-2 py-6 cursor-pointer font-medium"
            >
              GERAI
            </Link>
            <Link
              smooth={true}
              duration={500}
              to="cek_harga"
              className="px-2 py-6 cursor-pointer font-medium"
            >
              CEK HARGA
            </Link>

            <div className="relative group">
              <div className="px-2 py-6 font-medium flex items-center group cursor-pointer">
                TENTANG KAMI
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
                <div className="group-hover:flex hidden flex-col absolute -bottom-[8.5em] right-0 pb-4 px-4 pt-2 bg-black/50 gap-5">
                  <Link
                    to="visi&misi"
                    smooth={true}
                    duration={500}
                    className="hover:text-yellow-300 cursor-pointer"
                  >
                    VISI & MISI
                  </Link>
                  <Link
                    to="testimoni"
                    smooth={true}
                    duration={500}
                    className="hover:text-yellow-300 cursor-pointer"
                  >
                    TESTIMONI
                  </Link>
                  <Link
                    to="artikel"
                    smooth={true}
                    duration={500}
                    className="hover:text-yellow-300 cursor-pointer"
                  >
                    VIDEO KAMI
                  </Link>
                </div>
              </div>
              <div className="absolute hidden group-hover:block bg-white shadow-lg w-48">
                {/* Dropdown content here */}
              </div>
            </div>

            <Link
              smooth={true}
              duration={500}
              to="footer"
              className="px-2 py-6 font-medium cursor-pointer"
            >
              KONTAK
            </Link>

            <a href="./#/scan" className="px-2 py-6 cursor-pointer font-medium">
              SCAN QR
            </a>
          </nav>
        </div>

        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            {/* <button className="h-16 w-16 bg-black hidden tablet:flex items-center justify-center text-white">
              <FaMapMarkerAlt className="h-5 w-5" />
            </button> */}
            <span className="flex gap-3 tablet:gap-5 items-center laptop:mr-10">
              <a
                className="tablet:text-2xl"
                href="https://www.instagram.com/officialggsuspension"
              >
                <BsInstagram />
              </a>
              <a
                className="tablet:text-2xl"
                href="https://www.tiktok.com/@officialggsuspension"
              >
                <BsTiktok />
              </a>
              <a
                className="tablet:text-2xl"
                href="https://www.facebook.com/profile.php?id=61567120288124"
              >
                <Facebook />
              </a>
              <a
                className="tablet:text-2xl"
                href="https://www.youtube.com/@officialggsuspension"
              >
                <Youtube />
              </a>
            </span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-4 ${url != "" ? "hidden" : "block"}`}
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

      {/* Mobile menu */}
      {isOpen && (
        <div>
          {itemNav.map((item, index) => (
            <div
              className="md:hidden bg-black/40 shadow-md text-white pb-2"
              key={index}
            >
              {/* {item.link=="tentang_kami"&&<Link smooth={true}
                  duration={500}
                  to={item.link} className={`cursor-pointer py-3 px-4  hover:text-yellow-400 flex items-center gap-1`}><MdKeyboardArrowRight />{item.nama}</Link>} */}
              {item.link == "antrian" ||
              item.link == "klaim_garansi" ||
              item.link == "scan" ? (
                <a
                  className="cursor-pointer block py-2 px-4  hover:text-yellow-400"
                  href={`/#/${item.link}`}
                >
                  {item.nama}
                </a>
              ) : (
                <Link
                  smooth={true}
                  duration={500}
                  to={item.link}
                  onClick={() => setIsOpen(false)}
                  className={`cursor-pointer block py-2 px-4  hover:text-yellow-400 ${
                    item.link == "tentang_kami" ? "hidden" : ""
                  }`}
                >
                  {item.nama}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
