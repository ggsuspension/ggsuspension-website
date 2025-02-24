export default function ArticleSection() {
  const arrayArticle=[{img:"./layanan-mekanik.jpg",judul:"Perawatan Shock dengan Baik",desc:"Beginilah upaya untuk merawat Shock Anda agar tetap optimal.."},{img:"./mekanik.jpg",judul:"Review Produk Terbaru",desc:"Ulasan lengkap suspensi premium..."},{img:"./layanan-mekanik.jpg",judul:"Tips Suspensi Motor",desc:"Panduan setting suspensi untuk berbagai kondisi..."}]
  return (
    <section id="article" className="bg-orange-500 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl text-white font-bold text-center mb-5">
          Artikel & Tips
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {arrayArticle.map((article=>(<div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img
              src={article.img}
              className="bg-gray-300 h-48 w-full object-cover"
            ></img>
            <div className="p-6">
              <h3 className="font-semibold text-xl mb-2">
                {article.judul}
              </h3>
              <p className="text-gray-600 mb-4">
               {article.desc}
              </p>
              <span className="text-blue-600 font-semibold hover:text-blue-800">
                Baca selengkapnya
              </span>
            </div>
          </div>)))}
        </div>
      </div>
    </section>
  );
}
