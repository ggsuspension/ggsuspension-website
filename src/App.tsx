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

// Main Website component
const Website = () => {
  const [listMotor, setListMotor] = useState<any>(undefined);
  const SEMUA_LAYANAN = [
    "REBOUND",
    "DOWNSIZE",
    "MAINTENANCE",
    "UPGRADE",
    "PAKET REBOUND & DOWNSIZE",
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

  return (
    <div className="relative min-h-screen bg-blue-700 font-poppins overflow-hidden">
      <Navigation />
      {/* <SideNav /> */}
      <div className="w-full h-[40em] tablet:h-[55em] desktop:h-[50em]">
        <HeaderCarousel />
      </div>
      <HeroSection data={listMotor && listMotor.layanan} />
      <AboutSection />
      <WhyChooseUs />
      <ServicesSection services={SEMUA_LAYANAN} />
      <CekHargaSection
        hargaSeal={listMotor&&listMotor.seal}
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
        onClick={()=>window.open("https://wa.me/6282112345678")}
      />
      <CustomerSupport/>
    </div>
  );
};

export default Website;
