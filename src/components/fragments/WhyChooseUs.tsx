import { PiSealQuestionFill } from "react-icons/pi";

export default function WhyChooseUs() {
  const mengapaHarus = [
    {
      main: "Spesialisasi Suspensi",
      desc: "GG Suspension adalah bengkel khusus yang fokus pada suspensi shock, sehingga mereka memiliki keahlian mendalam untuk memastikan kualitas dan performa yang optimal.",
    },
    {
      main: "Teknisi Berpengalaman",
      desc: "Tim teknisi di GG Suspension berpengalaman dan terlatih dalam menangani berbagai jenis kendaraan, mulai dari motor, mobil, hingga kendaraan khusus lainnya.",
    },
    {
      main: "Jaminan Kualitas",
      desc: "Tim teknisi di GG Suspension berpengalaman dan terlatih dalam menangani berbagai jenis kendaraan, mulai dari motor, mobil, hingga kendaraan khusus lainnya.",
    },
    {
      main: "Testimoni Positif",
      desc: "Banyak pelanggan puas yang merekomendasikan GG Suspension karena hasil kerja yang memuaskan dan pelayanan yang ramah.",
    },
  ];
  return (
    <section className="desktop:flex justify-center  desktop:gap-10 pt-[4em] pb-[8em] bg-blue-700">
      <div className="flex justify-center items-center tablet:gap-4 gap-2">
        <span className="flex flex-col">
          <h1 className="tablet:text-7xl text-4xl font-extrabold text-yellow-400 italic">
            Mengapa
          </h1>
          <h3 className="text-white tablet:text-3xl text-lg font-semibold tablet:mt-2">
            GG Suspension
          </h3>
        </span>
        <PiSealQuestionFill className="tablet:text-[10em] text-[5em] text-red-500 animate-pulse rotate-12" />
      </div>
      <div className="flex flex-wrap tablet:gap-12 gap-5 justify-center w-3/4 place-self-center mt-2 desktop:w-1/2">
        {mengapaHarus.map((item, index) => (
          <div
            key={index}
            className="bg-white p-3 desktop:p-8 rounded-xl w-full"
          >
            <h3 className="font-bold desktop:text-2xl text-xl">{item.main}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
