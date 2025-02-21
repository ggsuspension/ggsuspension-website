import { useState } from "react"
import { FaHome } from "react-icons/fa"
import { FaDollarSign, FaWrench } from "react-icons/fa6"
import { IoIosArrowBack, IoIosArrowDroprightCircle } from "react-icons/io"
import { IoChatbubble } from "react-icons/io5"
import { MdArticle } from "react-icons/md"

export const SideNav=()=>{
const [isSideNav,setIsSideNav]=useState(true);
    return(
<>
{isSideNav ? (
    <div className="bg-orange-600 w-fit h-fit fixed right-2 rounded-tl-full rounded-br-full top-1/2 -translate-y-1/2 hover:opacity-100 z-30 items-center justify-center font-bold py-10 px-2 flex flex-col gap-3 cursor-pointer text-2xl">
      <IoIosArrowBack
        className="text-orange-600 text-3xl absolute top-1/2 -left-7 -translate-y-1/2"
        onClick={() => setIsSideNav(!isSideNav)}
      />
      <a href="#home">
        <FaHome className="bg-white rounded-full p-1"></FaHome>
      </a>
      <a href="#services">
        <FaWrench className="bg-white rounded-full p-1"></FaWrench>
      </a>
      <a href="#harga">
        <FaDollarSign className="bg-white rounded-full p-1"></FaDollarSign>
      </a>
      <a href="#testimoni">
        <IoChatbubble className="bg-white rounded-full p-1"></IoChatbubble>
      </a>
      <a href="#article">
        <MdArticle className="bg-white rounded-full p-1" />
      </a>
    </div>
  ) : (
    <IoIosArrowDroprightCircle
      onClick={() => setIsSideNav(!isSideNav)}
      className="text-4xl cursor-pointer fixed opacity-70 text-orange-600 top-1/2 -translate-y-1/2 hover:opacity-100 z-20 items-center justify-center font-bold right-1 bg-white rounded-full"
    />
  )}
</>
    )
}
{/* SideNav */}
