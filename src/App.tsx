import Footer from "./components/fragments/Footer";
import { TestimonialsSection } from "./components/fragments/TestimonialSection";
import HeaderCarousel from "./components/fragments/Carousel";
import { ServicesSection } from "./components/fragments/ServiceSection";
import { AboutSection } from "./components/fragments/AboutSection";
import { HeroSection } from "./components/fragments/HeroSection";
import { Navigation } from "./components/fragments/Navigation";
import WhyChooseUs from "./components/fragments/WhyChooseUs";
import CekHargaSection from "./components/fragments/CekHargaSection";

import { useEffect, useState } from "react";
import ArticleSection from "./components/fragments/ArticleSection";
import CustomerSupport from "./components/fragments/CustomerSupport";
import { dataListMotor } from "./utils/dataListMotor";
import { getCookie } from "./utils/getCookie";

// Main Website component
const Website = () => {
  const [listMotor, setListMotor] = useState<any>(undefined);
  const [gerai, setGerai] = useState<any>(undefined);
  const geraiCookie = getCookie("geraiSelected");
  const SEMUA_LAYANAN = [
    {
      nama: "REBOUND",
      desc: "Mengoptimalkan kemampuan shock absorber untuk kembali ke posisi semula setelah mengalami penekanan atau benturan",
    },
    {
      nama: "DOWNSIZE",
      desc: "Mengoptimalkan suspensi dengan mengganti shock absorber berat dengan model yang lebih ringan dan kompak, sehingga mengurangi total beban kendaraan",
    },
    {
      nama: "MAINTENANCE",
      desc: "Merupakan perawatan rutin untuk memastikan semua komponen suspensi, khususnya shock absorber, tetap bekerja optimal.",
    },
    {
      nama: "UPGRADE",
      desc: "Penggantian shock absorber standar dengan tipe high performance, penyetelan ulang suspensi agar lebih responsif",
    },
    {
      nama: "PAKET REBOUND & DOWNSIZE",
      desc: "Kombinasi ini ideal bagi kendaraan yang ingin mendapatkan performa suspensi maksimal dengan respons cepat serta pengurangan berat total",
    },
  ];
  useEffect(() => {
    // axios
    //   .get(
    //     "https://backend-gg-suspension-production.up.railway.app/api/list-motor"
    //   )
    //   .then((res) => {
    //     setListMotor(res.data[0]);
    //   });
    setListMotor(dataListMotor);
  }, []);
  function setGeraiSelected(geraiSelected: any) {
    setGerai(geraiSelected);
  }

  return (
    <div className="relative min-h-screen bg-blue-700 font-poppins overflow-hidden">
      <Navigation namaGerai={setGeraiSelected} />
      {/* <SideNav /> */}
      <div className="w-full h-[40em] tablet:h-[55em] desktop:h-[50em]">
        <HeaderCarousel />
      </div>
      <HeroSection data={listMotor && listMotor.layanan} />
      <AboutSection />
      <WhyChooseUs />
      <ServicesSection services={SEMUA_LAYANAN} />
      <CekHargaSection
        hargaSeal={listMotor && listMotor.seal}
        hargaLayanan={listMotor && listMotor.layanan}
      />
      <TestimonialsSection />
      <ArticleSection />
      {/* <SelectOptionSeal hargaSeal={listMotor&&JSON.parse(listMotor.seal)}/> */}
      <Footer />
      <img
        src="./LOGO%20WA.webp"
        className="fixed z-40 bottom-4 right-4 w-8 bg-white rounded-full"
        alt=""
        onClick={() => {
          const listGerai: any = {
            bekasi: 6282225232505,
            tangerang: 6283833977411,
            depok: 6285213335797,
            jaktim: 6281318911480,
            bogor: 6281318911476,
            cikarang: 6281316666812,
            jaksel: 6282299903985,
          };
          const geraiResult=geraiCookie?Object.keys(listGerai).find(
            (item) => item.toLowerCase() == geraiCookie.toLowerCase()
          ):Object.keys(listGerai).find(
            (item) => item.toLowerCase() == gerai.toLowerCase()
          );
          if (!gerai && !geraiCookie)
            return alert("Silahkan pilih gerai terlebih dahulu!");
          geraiResult&&window.open(`https://wa.me/${listGerai[geraiResult]}`);
        }}
      />
      <CustomerSupport />
    </div>
  );
};

export default Website;
