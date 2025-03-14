// import { useState } from "react";
// import { motion } from "framer-motion";
// import { ChevronRight, Star, Heart, Coffee, Book } from "lucide-react";

// const InitializePage = () => {
//   const [hoveredOption, setHoveredOption] = useState<any>(null);

//   const options = [
//     {
//       id: 1,
//       title: "MM",
//       description: "Lihat koleksi karya-karya terbaik kami",
//       icon: Star,
//       color: "bg-amber-500",
//     },
//     {
//       id: 2,
//       title: "Layanan",
//       description: "Temukan berbagai layanan yang kami tawarkan",
//       icon: Heart,
//       color: "bg-orange-500",
//     },
//     {
//       id: 3,
//       title: "Tentang Kami",
//       description: "Pelajari lebih lanjut tentang tim kami",
//       icon: Coffee,
//       color: "bg-yellow-400",
//     },
//     {
//       id: 4,
//       title: "Kontak",
//       description: "Hubungi kami untuk kolaborasi",
//       icon: Book,
//       color: "bg-amber-400",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-orange-500 flex flex-col gap-[4em] items-center justify-center p-4">
//       <motion.h1
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="text-7xl md:text-6xl font-poppins text-white mb-10 text-center flex flex-col"
//       >
//         <span className="font-bold tracking-widest">Selamat Datang</span>
//         <span className="text-6xl font-bold">di</span>
//         <span className="text-yellow-300 text-6xl font-semibold italic">GG Suspension<img src="./shock.png" className="w-[2em] inline" alt="" /></span>
//       </motion.h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
//         {options.map((option) => (
//           <motion.div
//             key={option.id}
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.5, delay: option.id * 0.15 }}
//             className={`relative overflow-hidden rounded-xl cursor-pointer group`}
//             onMouseEnter={() => setHoveredOption(option.id)}
//             onMouseLeave={() => setHoveredOption(null)}
//           >
//             <div className="p-8 border border-gray-700 rounded-xl bg-gray-800 h-full flex flex-col">
//               <div className="flex items-center mb-4">
//                 <div className={`p-3 rounded-lg ${option.color} mr-4`}>
//                   <option.icon className="h-6 w-6 text-white" />
//                 </div>
//                 <h2 className="text-xl font-bold text-white">{option.title}</h2>
//               </div>

//               <p className="text-gray-300 mb-4 flex-grow">{option.description}</p>

//               <div className="flex justify-end">
//                 <motion.div
//                   animate={{
//                     x: hoveredOption === option.id ? -5 : 0,
//                     opacity: hoveredOption === option.id ? 1 : 0.7
//                   }}
//                   className={`${option.color} rounded-full p-2 transition-all duration-300`}
//                 >
//                   <ChevronRight className="h-5 w-5 text-white" />
//                 </motion.div>
//               </div>
//             </div>

//             <motion.div
//               className={`absolute inset-0 ${option.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
//               initial={{ scale: 0 }}
//               animate={{
//                 scale: hoveredOption === option.id ? 1.2 : 0,
//                 opacity: hoveredOption === option.id ? 0.05 : 0
//               }}
//               transition={{ duration: 0.5 }}
//             />
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default InitializePage;

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Moon,
  Rocket,
  Zap,
  Palette,
  Music,
  Wrench,
} from "lucide-react";
import { FaMotorcycle } from "react-icons/fa6";
import { BsGearFill } from "react-icons/bs";

const CreativeWebsite = () => {
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);

  const options = [
    {
      id: 1,
      title: "GG Suspension",
      img: "./LOGO%20REMAKE.png",
      url:"/#/ohme",
      description:
        "Branding, UI/UX, dan solusi desain kreatif yang eye-catching",
      icon: Palette,
      color: "from-pink-500 to-purple-600",
      accent: "bg-purple-500",
      pattern:
        "radial-gradient(circle, rgba(168,85,247,0.3) 10%, transparent 10.5%) 0 0/20px 20px",
    },
    {
      id: 2,
      title: "GG Nusantara",
      description: "Menangani shock kiriman dari seluruh nusantara ",
      img: "./GGN.png",
      url:"/#/nusantara",
      icon: Rocket,
      color: "from-cyan-500 to-blue-600",
      accent: "bg-blue-500",
      pattern:
        "linear-gradient(135deg, rgba(59,130,246,0.2) 25%, transparent 25%, transparent 50%, rgba(59,130,246,0.2) 50%, rgba(59,130,246,0.2) 75%, transparent 75%, transparent) 0 0/20px 20px",
    },
    {
      id: 3,
      title: "GG Pro",
      description: "Animasi dan visual yang membuat brand Anda lebih hidup",
      img: "./GG%20PRO.png",
      url:"/#/pro",
      icon: Zap,
      color: "from-amber-400 to-orange-600",
      accent: "bg-orange-500",
      pattern:
        "repeating-linear-gradient(45deg, rgba(249,115,22,0.1) 0, rgba(249,115,22,0.1) 2px, transparent 0, transparent 50%) 0 0/20px 20px",
    },
    {
      id: 4,
      title: "GG Product",
      description:
        "Konten berkualitas yang menarik audiens dan meningkatkan engagement",
      img: "./GG%20PRO.png",
      url:"/#/product",
      icon: Music,
      color: "from-emerald-400 to-teal-600",
      accent: "bg-teal-500",
      pattern:
        "repeating-radial-gradient(rgba(20,184,166,0.2) 0, rgba(20,184,166,0.2) 1px, transparent 1px, transparent 100%) 0 0/20px 20px",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-orange-500 flex flex-col items-center justify-center p-6 gap-[4em]">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="md:text-6xl font-poppins text-white mb-10 text-center flex flex-col "
      >
        <span className="text-8xl font-bold tracking-widest">
          Selamat Datang
        </span>
        <span className="text-6xl font-bold">di</span>
        <span className="text-yellow-300 text-6xl font-semibold italic  relative">
          GG SUSPENSION
          <motion.div
            className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-white to-yellow-300"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 1 }}
          />
          <img src="./shock.png" className="w-[2em] inline" alt="" />
        </span>
      </motion.h1>
      {/* Floating icons decoration */}
      <motion.div
        className="absolute top-40 left-10 text-white opacity-80 "
        animate={{ y: [0, -15, 0], rotate: 5 }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <FaMotorcycle className="rotate-12" size={60} />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-10 text-white opacity-30"
        animate={{ y: [0, 15, 0], rotate: -5 }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <Moon size={50} />
      </motion.div>

      <motion.div
        className="absolute top-10 right-10 text-white opacity-60"
        animate={{ y: [0, -10, 0], rotate: 10 }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        <BsGearFill size={30}/>
        <BsGearFill className="animate-spin absolute right-0" size={40}/>
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 text-white opacity-30"
        animate={{ y: [0, 10, 0], rotate: -10 }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <Sparkles size={35} />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}>
      <h2 className="mt-5 text-5xl tracking-widest font-bold text-white text-center">
        <Wrench className="inline w-12 h-12"/> BERIKUT PELAYANAN KAMI :
      </h2>
      </motion.h1>
      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full  relative z-10 rounded-xl">
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.8 }}
            className="relative overflow-hidden cursor-pointer group"
            onMouseEnter={() => setHoveredOption(option.id)}
            onMouseLeave={() => setHoveredOption(null)}
            style={{
              backgroundImage: option.pattern,
            }}
          >
            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity duration-300 group-hover:opacity-95`}
            />

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 rounded-full opacity-10" />
            <div className="absolute bottom-0 left-0 w-16 h-16 -mb-8 -ml-8 rounded-full opacity-10" />

            {/* Content */}
            <a href={option.url} className="relative h-fit flex justify-center flex-col items-center bg-blue-700/90 rounded-xl p-5">
              <p className="text-4xl mb-2 font-bold text-white text-center">
                {option.title.toUpperCase()}
              </p>
              {/* <option.icon className="h-7 w-7 text-white" /> */}
              <img src={option.img} className="w-[15em]" alt="" />

              <motion.div
                className="mt-4"
                animate={{
                  x: hoveredOption === option.id ? 8 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  className="px-5 py-2 rounded-full border border-white/30  font-medium flex items-center space-x-2 backdrop-blur-sm bg-yellow-300 hover:bg-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{option.description}</span>
                </motion.button>
              </motion.div>
            </a>

            {/* Glow effect */}
            <motion.div
              className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `linear-gradient(90deg, transparent, ${
                  hoveredOption === option.id
                    ? "rgba(255,255,255,0.2)"
                    : "transparent"
                }, transparent)`,
                backgroundSize: "200% 100%",
              }}
              animate={{
                backgroundPosition:
                  hoveredOption === option.id
                    ? ["100% 0%", "0% 0%"]
                    : "100% 0%",
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CreativeWebsite;
