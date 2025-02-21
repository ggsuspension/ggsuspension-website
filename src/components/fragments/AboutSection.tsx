import { Users } from "lucide-react";
import { FaHistory } from "react-icons/fa";
import { GrAchievement } from "react-icons/gr";
import ReadMore from "./ReadMore";

export const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-blue-700">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-5 w-fit py-2 px-6 rounded-full place-self-center text-white">
          Tentang Kami
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
      {["Sejarah", "Visi & Misi", "Tim Profesional"].map((title, index) => (
        <div key={index} className="text-center bg-white p-5 rounded-xl">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            {title === "Sejarah" && (
              <FaHistory className="w-8 h-8 text-orange-600" />
            )}
            {title === "Visi & Misi" && (
              <GrAchievement className="w-8 h-8 text-orange-600" />
            )}
            {title === "Tim Profesional" && (
              <Users className="w-8 h-8 text-orange-600" />
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          {title === "Sejarah" && (
            <ReadMore>
              GG Suspension berawal dari sebuah bengkel kecil yang awalnya
              fokus pada perbaikan mesin motor. Dengan nama sederhana, bengkel
              ini melayani perbaikan dan servis mesin bagi pelanggan sekitar.
              Namun, dalam perjalanannya, pemilik bengkel mulai menyadari bahwa
              banyak pengendara yang mengalami masalah pada suspensi motor mereka,
              baik karena usia pemakaian, medan jalan yang berat, maupun kebutuhan
              untuk meningkatkan performa berkendara. Melihat peluang tersebut,
              bengkel mulai mencoba menangani perbaikan dan penyetelan
              shockbreaker. Awalnya hanya sebatas layanan tambahan, namun karena
              banyak pelanggan merasa puas dan merekomendasikan layanan ini,
              fokus bengkel perlahan bergeser. Permintaan yang semakin meningkat
              membuat pemilik memutuskan untuk lebih mendalami dunia suspensi,
              mempelajari teknologi terkini, dan meningkatkan keterampilan dalam
              tuning serta perbaikan shockbreaker. Akhirnya, bengkel bertransformasi
              menjadi spesialis suspensi motor dan lahirlah GG Suspension, yang
              berkomitmen untuk memberikan layanan terbaik dalam perbaikan,
              penyetelan, serta penjualan shockbreaker berkualitas tinggi. Dari
              bengkel mesin kecil hingga menjadi spesialis suspensi yang dipercaya
              banyak pengendara, GG Suspension terus berkembang dengan semangat
              inovasi dan kepuasan pelanggan sebagai prioritas utama.
            </ReadMore>
          )}
          {title === "Visi & Misi" && (<ReadMore>
              <p>
                <span className="font-semibold">Visi: </span>
                Menjadi bengkel spesialis suspensi motor terbaik di Indonesia
                yang menghadirkan kenyamanan, performa, dan keamanan berkendara
                melalui produk dan layanan berkualitas tinggi.
              </p>
              <p>
                <span className="font-semibold">Misi: </span>
                Memberikan layanan perbaikan dan penyetelan suspensi motor yang
                profesional, presisi, dan berkualitas tinggi. Menyediakan produk
                suspensi unggulan dengan teknologi terkini untuk meningkatkan
                performa dan kenyamanan berkendara. Mengedepankan kepuasan
                pelanggan dengan pelayanan ramah, cepat, dan transparan. Terus
                berinovasi dalam teknologi dan layanan untuk memenuhi kebutuhan
                komunitas otomotif. Membangun hubungan jangka panjang dengan
                pelanggan dan mitra bisnis melalui kepercayaan dan kualitas.
              </p>
            </ReadMore>
          )}
          {title === "Tim Profesional" && (
            <ReadMore>
              GG Suspension menunjukkan profesionalisme di setiap tahap
              pengerjaan. Mulai dari konsultasi, proses pengerjaan, hingga
              finishing, semua dilakukan dengan ketelitian dan keahlian tinggi.
              Mereka responsif, tepat waktu, dan selalu mengutamakan kepuasan
              pelanggan. Setiap detail diperhatikan dengan cermat sehingga
              menghasilkan kualitas kerja yang luar biasa. Saya sangat
              merekomendasikan GG Suspension bagi siapa saja yang mencari
              layanan suspensi yang andal dan berkualitas. Pengalaman dengan tim
              ini benar-benar memuaskan, dan saya yakin mereka akan terus
              memberikan layanan terbaik untuk setiap proyek yang mereka
              tangani.
            </ReadMore>
          )}
        </div>
      ))}
    </div>
      </div>
    </section>
  );
};
