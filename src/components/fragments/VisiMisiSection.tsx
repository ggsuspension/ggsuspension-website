import React from "react";

interface VisionMissionProps {
  shopName?: string;
}

const VisionMissionSection: React.FC<VisionMissionProps> = ({
  shopName = "GG Suspension",
}) => {
  return (
    <section
      id="visi-misi"
      className="relative bg-orange-500 py-20 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-8 border-gray-800"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full border-8 border-blue-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-8 border-red-500"></div>
      </div>

      {/* Decorative tools */}
      <div className="absolute -left-10 top-1/4 text-gray-700 opacity-10 transform rotate-45">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="150"
          height="150"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0Zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708ZM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11Z" />
        </svg>
      </div>

      <div className="absolute -right-16 bottom-1/4 text-gray-700 opacity-10 transform -rotate-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="180"
          height="180"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M4 .5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1Zm0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-1Zm0 3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1Zm0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-1Zm0 3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1Z" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <img
              src="./LOGO%20REMAKE.png"
              className="w-8 inline p-[2px] bg-yellow-300 rounded-full"
              alt=""
            />{" "}
            VISI & MISI <span className="text-gray-800">{shopName}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-white to-yellow-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Vision Card */}
          <div className="bg-gray-800 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/20">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h3 className="ml-4 text-2xl font-bold text-white">Visi Kami</h3>
            </div>

            <div className="space-y-4 text-gray-300">
              <p>
                Menjadi bengkel spesialis suspensi motor terbaik di Indonesia
                yang menghadirkan kenyamanan, performa, dan keamanan berkendara
                melalui produk dan layanan berkualitas tinggi.
              </p>

              <div className="pl-4 border-l-4 border-yellow-500 italic">
                "Memberikan solusi perawatan kendaraan terbaik dengan integritas
                dan keahlian teknis yang tak tertandingi."
              </div>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-gray-800  backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="ml-4 text-2xl font-bold text-white">Misi Kami</h3>
            </div>

            <div className="space-y-4 text-gray-300">
              <p>
                Misi kami adalah menyediakan layanan perbaikan dan perawatan
                kendaraan berkualitas tinggi dengan standar bengkel profesional
                modern namun tetap dengan harga yang terjangkau.
              </p>

              <ul className="space-y-3">
                <li className="flex">
                  <div className="mt-1 mr-3 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>
                    Memberikan layanan reparasi kendaraan berkualitas tinggi
                    dengan teknisi bersertifikat
                  </span>
                </li>
                <li className="flex">
                  <div className="mt-1 mr-3 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>
                    Memastikan transparansi dalam proses diagnosis dan perbaikan
                  </span>
                </li>
                <li className="flex">
                  <div className="mt-1 mr-3 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>
                    Menggunakan peralatan diagnostik dan perbaikan terkini
                  </span>
                </li>
                <li className="flex">
                  <div className="mt-1 mr-3 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>
                    Menerapkan praktik ramah lingkungan dalam operasional
                    bengkel
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionMissionSection;
