import { FaScrewdriverWrench } from "react-icons/fa6";

export const ServicesSection = ({ services }:any) => {
    return (
      <section id="services" className="tablet:rounded-t-[10%] rounded-t-[8%] overflow-hidden bg-black/70 flex">
        <div className="bg-yellow-500 relative w-full tablet:w-1/2">
          <img className="w-full h-full object-cover object-center" src="./layanan-mekanik.jpg" alt="" />
          <div className="absolute top-0 bg-black w-full h-full opacity-50 z-10"></div>
        </div>
        <div className="tablet:py-10 tablet:px-12 py-6 pr-4 w-1/2 tablet:w-1/2">
          <h2 className="tablet:text-5xl text-2xl font-extrabold text-center w-fit py-2 px-6 text-yellow-400 place-self-center tablet:mb-5">
            Layanan Kami
          </h2>
          <div className="flex flex-col gap-5">
            {services.map((layanan:any, i:number) => (
              <div key={i} className="py-4 px-2 tablet:px-4 border-2 tablet:rounded-tr-[5em] rounded-tr-[2em] hover:shadow-lg transition flex justify-start bg-white gap-2">
                <FaScrewdriverWrench className="text-orange-600 text-xl tablet:text-2xl" />
                <span className="flex flex-col w-3/4">
                  <h3 className="text-sm font-semibold tablet:text-xl tablet:overflow-hidden">{layanan.nama}</h3>
                  <p className="text-xs tablet:text-lg">{layanan.desc}</p>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };