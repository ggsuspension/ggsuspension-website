// components/Footer.tsx
import { Clock8 } from "lucide-react";
import { BsInstagram, BsTiktok } from "react-icons/bs";
import { FaLocationDot } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="flex gap-3">
            <img
              src="/LOGO%20REMAKE.png"
              alt="GG Suspension"
              className="w-10 h-10"
            />
            <h3 className="text-2xl font-bold mb-4">GG Suspension</h3>
          </div>
          <div>
            <h4 className="font-semibold">JAM OPERASIONAL</h4>
            <ul className="text-gray-400">
              <li>Buka Setiap Hari</li>
              <li className="flex items-center gap-2">
                <Clock8 /> 08.00 - 17.00 WIB
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-xl font-bold">ALAMAT KAMI</h4>
            <p className="text-gray-400 flex gap-1">
              <FaLocationDot />
              <a href="https://maps.app.goo.gl/nUE1ptZQuaQQsaxg7">
              <i className="fas fa-map-marker-alt"></i>BEKASI - Jl. Kelana,
              Cibuntu, Cibitung, Bekasi
              </a>
            </p>
            <p className="text-gray-400 flex gap-1">
              <FaLocationDot />
              <a href="https://maps.app.goo.gl/Nj3KB4oveM4R3ugA7">
              <i className="fas fa-map-marker-alt"></i>TANGERANG - Jl. Dr.
              Soetomo, Joglo, Karang Tengah, Tangerang
              </a>
            </p>
            <p className="text-gray-400 flex gap-1">
              <FaLocationDot />
              <a href="https://maps.app.goo.gl/gF33nGxzY41FPpTG6">
              <i className="fas fa-map-marker-alt"></i>DEPOK - Jl. Tole
              Iskandar, Abadijaya, Sukmajaya, Depok
              </a>
            </p>
            <p className="text-gray-400 flex gap-1">
              <FaLocationDot />
              <a href="https://maps.app.goo.gl/46v1C4KK8njbWbSDA">
              <i className="fas fa-map-marker-alt"></i>JAKTIM - Jl. Malaka,
              Malaka Sari, Duren Sawit, Jakarta Timur
              </a>
            </p>
            <p className="text-gray-400 flex gap-1">
              <FaLocationDot />
              <a href="https://maps.app.goo.gl/afCf8QTr3uxHqBn18">
              <i className="fas fa-map-marker-alt"></i>JAKSEL - Jl. Raya Pasar
              Minggu, Pancoran, Jakarta Selatan
              </a>
            </p>
            <p className="text-gray-400 flex gap-1">
              <FaLocationDot />
              <a href="https://maps.app.goo.gl/gbg5PmY11nP63cXC8">
              <i className="fas fa-map-marker-alt"></i>CIKARANG - Jl.
              Cilemahabang, Jayamukti, Cikarang Pusat
              </a>
            </p>
            <p className="text-gray-400 flex gap-1">
              <FaLocationDot />
              <a href="https://maps.app.goo.gl/e6fiH1iwo3SzyDYT6">
              <i className="fas fa-map-marker-alt"></i>BOGOR - Jl. Rimba Baru,
              Pasirkuda, Kec. Bogor Bar., Bogor
              </a>
            </p>
          </div>

          <div>
            <h4 className="font-semibold">SOCIAL MEDIA</h4>
            <div className="flex flex-col">
              <a
                href="#"
                className="flex gap-2 items-center text-gray-400 hover:text-white"
              >
                <BsInstagram />
                ggsuspension
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-gray-400 hover:text-white"
              >
                <BsTiktok />
                ggsuspension
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 GG Suspension. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
