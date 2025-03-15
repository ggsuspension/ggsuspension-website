import PremiumTestimonials from "../fragments/Testimoni";
import PriceChecker from "../fragments/GeraiSection";
import VisionMissionSection from "../fragments/VisiMisiSection";
import NewNavigation from "../fragments/NewNavigation";
import ArticleSection from "../fragments/VideoSection";
import GeraiSection from "../layouts/CekHarga";
import LayananSection from "../layouts/LayananSection";
import FooterSection from "../layouts/Footer";
import CustomerSupport from "../fragments/CustomerSupport";

const Sample: React.FC = () => {
  const categories = [
    {
      id: 3,
      name: "GG SUSPENSION",
      logo: "./LOGO%20REMAKE.png",
      image:
        "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 1,
      name: "GG NUSANTARA",
      logo: "./GGN.png",
      image: "./GGNusantara.jpg",
    },
    {
      id: 2,
      name: "GG PRO",
      logo: "./GG%20PRO.png",
      image:
        "https://images.unsplash.com/photo-1542282088-fe8426682b8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      name: "GG PRODUCT",
      logo: "./GG%20PRODUK.png",
      image:
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Navbar Section */}
        <NewNavigation />
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
          src="./banner-15detik.mp4"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative h-64 cursor-pointer hover:opacity-90 transition-opacity duration-300"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${category.image})`,
                filter: "brightness(0.8)",
              }}
            />
            <div className="absolute inset-0 flex items-end justify-center p-8">
              <div className="text-center">
                <div className="w-36 h-1 bg-yellow-400 mx-auto mb-4"></div>
                <span className="flex items-center gap-1">
                  <img src={category.logo} className="w-5" alt="" />
                  <h3 className="text-white text-xl font-bold">
                    {category.name}
                  </h3>
                </span>
              </div>
            </div>
          </div>
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
