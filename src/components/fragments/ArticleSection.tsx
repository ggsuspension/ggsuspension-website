export default function ArticleSection() {
  return (
    <section id="article" className="bg-orange-500 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl text-white font-bold text-center mb-5">Artikel & Tips</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="bg-gray-300 h-48"></div>
            <div className="p-6">
              <h3 className="font-semibold text-xl mb-2">
                Perawatan Shockbreaker
              </h3>
              <p className="text-gray-600 mb-4">
                Tips merawat suspensi agar tetap optimal...
              </p>
              <span
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                Baca selengkapnya
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="bg-gray-300 h-48"></div>
            <div className="p-6">
              <h3 className="font-semibold text-xl mb-2">
                Review Produk Terbaru
              </h3>
              <p className="text-gray-600 mb-4">
                Ulasan lengkap suspensi premium...
              </p>
              <span
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                Baca selengkapnya
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <div className="bg-gray-300 h-48"></div>
            <div className="p-6">
              <h3 className="font-semibold text-xl mb-2">
                Tips Suspensi Motor
              </h3>
              <p className="text-gray-600 mb-4">
                Panduan setting suspensi untuk berbagai kondisi...
              </p>
              <span
                className="text-blue-600 font-semibold hover:text-blue-800"
              >
                Baca selengkapnya
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
