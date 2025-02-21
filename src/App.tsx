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
import axios from "axios";
import ArticleSection from "./components/fragments/ArticleSection";

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
    axios.get("http://localhost:8000/api/list-motor").then((res) => {
      setListMotor(res.data[0]);
    });
  }, []);

  return (
    <div className="min-h-screen bg-blue-700 font-poppins overflow-hidden">
      <Navigation />
      {/* <SideNav /> */}
      <div className="w-full h-[40em] tablet:h-[55em] desktop:h-[50em]">
        <HeaderCarousel />
      </div>
      <HeroSection data={listMotor && JSON.parse(listMotor.layanan)} />
      <AboutSection />
      <WhyChooseUs />
      <ServicesSection services={SEMUA_LAYANAN} />
      <CekHargaSection
        hargaSeal={listMotor && JSON.parse(listMotor.seal)}
        hargaLayanan={listMotor && JSON.parse(listMotor.layanan)}
      />
      <TestimonialsSection />
      <ArticleSection />
      {/* <SelectOptionSeal hargaSeal={listMotor&&JSON.parse(listMotor.seal)}/> */}
      <Footer />
    </div>
  );
};

export default Website;
