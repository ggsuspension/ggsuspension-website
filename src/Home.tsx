import Footer from "./components/fragments/Footer";
import { TestimonialsSection } from "./components/fragments/TestimonialSection";
import HeaderCarousel from "./components/fragments/Carousel";
import { ServicesSection } from "./components/fragments/ServiceSection";
import { AboutSection } from "./components/fragments/AboutSection";
import { HeroSection } from "./components/fragments/HeroSection";
import { Navigation } from "./components/fragments/Navigation";
import WhyChooseUs from "./components/fragments/WhyChooseUs";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import ArticleSection from "./components/fragments/VideoSection";
import CustomerSupport from "./components/fragments/CustomerSupport";
import { dataListMotor } from "./utils/dataListMotor";
import { getCookie } from "./utils/getCookie";
import PriceChecker from "./components/fragments/GeraiSection";

// Komponen AnimatedSection untuk membungkus setiap section
const AnimatedSection = ({ children, className = "" }: any) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Main Website component
const Home = () => {
  const [listMotor, setListMotor] = useState<any>(undefined);
  const [gerai, setGerai] = useState<any>(undefined);
  const [nomorWA, setNomorWA] = useState<any>(undefined);
  const geraiCookie = getCookie("geraiSelected");
  console.log(nomorWA);
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
      nama: "PAKET REBOUND & DOWNSIZE",
      desc: "Kombinasi ini ideal bagi kendaraan yang ingin mendapatkan performa suspensi maksimal dengan respons cepat serta pengurangan berat total",
    },
  ];

  useEffect(() => {
    setListMotor(dataListMotor);
    const listGerai: any = {
      bekasi: 6282225232505,
      tangerang: 6283833977411,
      depok: 6285213335797,
      jaktim: 6281318911480,
      bogor: 6281318911476,
      cikarang: 6281316666812,
      jaksel: 6282299903985,
    };

    const geraiResult = geraiCookie
      ? Object.keys(listGerai).find(
          (item) => item.toLowerCase() === geraiCookie.toLowerCase()
        )
      : Object.keys(listGerai).find(
          (item) => item.toLowerCase() === gerai?.toLowerCase()
        );
    geraiResult && setNomorWA(listGerai[geraiResult]);
  }, [geraiCookie, gerai]);

  function setGeraiSelected(geraiSelected: any) {
    setGerai(geraiSelected);
  }
  const handleWhatsAppClick = () => {
    const listGerai: any = {
      bekasi: 6282225232505,
      tangerang: 6283833977411,
      depok: 6285213335797,
      jaktim: 6281318911480,
      bogor: 6281318911476,
      cikarang: 6281316666812,
      jaksel: 6282299903985,
    };

    const geraiResult = geraiCookie
      ? Object.keys(listGerai).find(
          (item) => item.toLowerCase() === geraiCookie.toLowerCase()
        )
      : Object.keys(listGerai).find(
          (item) => item.toLowerCase() === gerai?.toLowerCase()
        );
    if (!gerai && !geraiCookie) {
      alert("Silahkan pilih gerai terlebih dahulu!");
      return;
    }
    geraiResult && window.open(`https://wa.me/${listGerai[geraiResult]}`);
  };

  return (
    <div className="relative min-h-screen bg-blue-700 font-poppins overflow-hidden">
      <Navigation namaGerai={setGeraiSelected} />

      <div className="w-full h-[40em] tablet:h-[55em] desktop:h-[50em]">
        <HeaderCarousel />
      </div>

      <AnimatedSection>
        <HeroSection data={listMotor && listMotor.layanan} />
      </AnimatedSection>

      <AnimatedSection>
        <AboutSection />
      </AnimatedSection>

      <AnimatedSection>
        <WhyChooseUs />
      </AnimatedSection>

      <AnimatedSection>
        <ServicesSection services={SEMUA_LAYANAN} />
      </AnimatedSection>

      <AnimatedSection>
        <PriceChecker
        // hargaSeal={listMotor && listMotor.seal}
        // hargaLayanan={listMotor && listMotor.layanan}
        // gerai={nomorWA && nomorWA}
        />
      </AnimatedSection>

      <AnimatedSection>
        <TestimonialsSection />
      </AnimatedSection>

      <AnimatedSection>
        <ArticleSection />
      </AnimatedSection>

      <Footer />

      <motion.img
        src="./LOGO%20WA.webp"
        className="fixed z-40 bottom-4 right-4 w-8 bg-white rounded-full cursor-pointer"
        alt="WhatsApp"
        onClick={handleWhatsAppClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />

      <CustomerSupport />
    </div>
  );
};

export default Home;
