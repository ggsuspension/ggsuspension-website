import FacebookVideoEmbed from "./FacebookEmbed";
import InstagramEmbed from "./InstagramEmbed";
import TikTokEmbed from "./TiktokEmbed";
import YouTubeShortsEmbed from "./YoutubeEmbed";

export default function VideoSection() {
  // const articles = [
  //   {
  //     id: 1,
  //     title: "Perawatan Shock dengan Baik",
  //     excerpt: "Beginilah upaya untuk merawat Shock Anda agar tetap optimal..",
  //     category: "maintenance",
  //     image: "/api/placeholder/400/250",
  //   },
  //   {
  //     id: 2,
  //     title: "Review Produk Terbaru",
  //     excerpt: "Ulasan lengkap suspensi premium...",
  //     category: "review",
  //     image: "/api/placeholder/400/250",
  //   },
  //   {
  //     id: 3,
  //     title: "Tips Suspensi Motor",
  //     excerpt: "Panduan setting suspensi untuk berbagai kondisi...",
  //     category: "tips",
  //     image: "/api/placeholder/400/250",
  //   },
  //   {
  //     id: 4,
  //     title: "Upgrade Performa Motor",
  //     excerpt: "Cara meningkatkan performa motor tanpa merusak mesin...",
  //     category: "performance",
  //     image: "/api/placeholder/400/250",
  //   },
  // ];

  return (
    <section id="video" className="">
      {/* Article Section */}
      <section className="py-16 bg-orange-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="desktop:text-5xl text-4xl font-bold">
              VIDEO <span className="text-white">KAMI</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-yellow-500 mx-auto mt-2"></div>
            <p className="text-white max-w-2xl tablet:text-xl italic text-lg mt-2 mx-auto">
              Jelajahi video kami untuk kebutuhan suspensi motor kalian
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
          <InstagramEmbed url="https://www.instagram.com/reel/DEr6ZBQTVRh/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" />
          <TikTokEmbed url="https://www.tiktok.com/@officialggsuspension/video/7453838245709827333?is_from_webapp=1&sender_device=pc&web_id=7454433338032948737" />
          <YouTubeShortsEmbed videoId="gsre3HCNBAg" />
          <FacebookVideoEmbed videoUrl="https://www.facebook.com/reel/1095316702355739" />
          </div>
          

          {/* Articles Grid */}
          {/* <div className="flex flex-wrap gap-4"> */}
            {/* {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="relative">
                  <img
                    src={"./mekanik.jpg"}
                    alt={article.title}
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black text-lg font-bold px-3 py-1 rounded-full">
                    {article.category === "maintenance" && "Perawatan"}
                    {article.category === "performance" && "Performa"}
                    {article.category === "tips" && "Tips"}
                    {article.category === "review" && "Review"}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <a
                    href="#"
                    className="text-blue-700 font-medium hover:text-blue-600 transition flex items-center"
                  >
                    Baca selengkapnya
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            ))} */}
          {/* </div> */}
        </div>
      </section>
    </section>
  );
}
