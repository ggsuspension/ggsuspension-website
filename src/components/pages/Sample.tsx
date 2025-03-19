import PremiumTestimonials from "../fragments/Testimoni";
import PriceChecker from "../fragments/GeraiSection";
import VisionMissionSection from "../fragments/VisiMisiSection";
import ArticleSection from "../fragments/VideoSection";
import GeraiSection from "../layouts/CekHarga";
import LayananSection from "../layouts/LayananSection";
import FooterSection from "../layouts/Footer";
import CustomerSupport from "../fragments/CustomerSupport";
import Navbar from "../fragments/Navbar";

const Sample: React.FC = () => {
  const categories = [
    {
      id: 3,
      name: "GG SUSPENSION",
      logo: "./LOGO%20REMAKE.png",
      image: "./ggsuspension.jpg",
      instagram: "https://www.instagram.com/officialggsuspension",
    },
    {
      id: 1,
      name: "GG NUSANTARA",
      logo: "./GGN.png",
      image: "./GGNusantara.jpg",
      instagram: "https://www.instagram.com/ggsuspension_nusantara",
    },
    {
      id: 2,
      name: "GG PRO",
      logo: "./GG%20PRO.png",
      image:
        "https://images.unsplash.com/photo-1542282088-fe8426682b8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      instagram: "https://www.instagram.com/ggprosuspension",
    },
    {
      id: 3,
      name: "GG PRODUCT",
      logo: "./GG%20PRODUK.png",
      image:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      instagram: "https://www.instagram.com/ggsuspensionproduk",
    },
  ];

  return (
    <div className="bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Navbar Section */}
        {/* <NewNavigation /> */}
        <Navbar />
        <video
          src="./banner-mobile-15detik.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{ width: "100%", height: "100%" }}
          className="bg-white desktop:hidden"
        />
        <video
          src="./banner-dekstop.mov"
          autoPlay
          muted
          loop
          style={{ width: "100%" }}
          className="bg-black/90 hidden desktop:block"
        />
        <div className="absolute top-0 desktop:hidden bg-black w-full h-full opacity-30 z-10"></div>
        <div className="absolute bottom-20 left-5 flex flex-col z-20 desktop:hidden">
          <span className="text-white font-bold text-4xl">SEMUA BUTUH</span>
          <span className="text-orange-500 font-bold text-4xl italic">
            SHOCK ENAK
          </span>
        </div>
      </div>

      {/* Category Section */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {categories.map((category) => (
          <a
            key={category.id}
            href={category.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-64 cursor-pointer group overflow-hidden block"
          >
            <div
              key={category.id}
              className="relative h-64 cursor-pointer group overflow-hidden"
            >
              {/* Gambar latar belakang */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:blur-[3px] group-hover:drop-shadow-lg group-hover:scale-150 w-full h-full"
                style={{
                  backgroundImage: `url(${category.image})`,
                  filter: "brightness(0.8)",
                }}
              />

              {/* Konten kategori */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="text-center">
                  <span className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:scale-110">
                    {/* Logo yang membesar saat hover */}
                    <img
                      src={category.logo}
                      className="w-12 opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-150 group-hover:drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]"
                      alt={category.name}
                    />
                    {/* Nama kategori */}
                    <h3 className="text-white text-xl font-bold opacity-100 transition-all duration-300 group-hover:text-2xl">
                      {category.name}
                    </h3>
                    {/* Garis bawah */}
                    <div className="w-36 h-1 bg-yellow-400 mx-auto mb-4"></div>
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-orange-500 w-full py-12 relative" id="layanan_kami">
        <div className="bg-white w-full h-1/3 absolute bottom-0"></div>
        <LayananSection></LayananSection>
      </div>

      <div className="min-h-screen">
        <GeraiSection></GeraiSection>
        <PriceChecker />
        {/* Yellow circle element in bottom left (similar to what's seen in the image) */}
        <CustomerSupport />
        <PremiumTestimonials />
        <VisionMissionSection />
        <ArticleSection />
        {/* Footer */}
        <FooterSection />
      </div>
    </div>
  );
};

export default Sample;
