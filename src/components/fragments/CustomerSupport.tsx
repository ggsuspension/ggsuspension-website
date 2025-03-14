import { useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { FcCustomerSupport } from "react-icons/fc";
import { IoIosArrowDown, IoMdRefresh } from "react-icons/io";
import { RiCustomerService2Fill } from "react-icons/ri";
import integrasiAPI from "../../utils/integrasiAPI";

export default function CustomerSupport() {
  const [isCSActive, setIsCSActive] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [arrayText, setArrayText] = useState<any>([]);
  const [text, setText] = useState("");
  return (
    <>
      {isCSActive && (
        <div className="bg-white w-3/4 h-1/2 tablet:w-1/2 desktop:w-1/4 fixed bottom-12 z-50 right-3 border-2 border-gray-100 rounded-lg">
          <span className="bg-orange-500 w-full h-1/6 flex justify-between px-1 items-center">
            <span className="flex gap-1 items-center">
              <FcCustomerSupport className="tablet:text-3xl text-2xl" />
              <h1 className="text-white text-center h-full flex items-center text-sm tablet:text-lg">
                Customer Support
              </h1>
            </span>
            <IoIosArrowDown
              onClick={() => setIsCSActive(!isCSActive)}
              className="text-xl"
            />
          </span>
          <span className="flex flex-col gap-2 w-full h-5/6 p-3 bg-white overflow-auto pb-12">
            <p className="flex text-sm text-white bg-gray-600 w-3/4 p-2 rounded-lg">
              Halo masbro! Selamat datang di GG Suspension
            </p>
            <p className="flex text-sm text-white bg-gray-600 w-3/4 p-2 rounded-lg">
              Saya GG min siap membantu!
            </p>
            {arrayText.length > 0 &&
              arrayText.map((item: any, i: number) => (
                <div key={i}>
                  {item.isUser && (
                    <p className="flex place-self-end text-sm bg-green-600 text-white w-3/4 p-2 rounded-lg">
                      {item.isUser}
                    </p>
                  )}
                  {!item.isUser && (
                    <p className="flex text-sm bg-gray-600 text-white w-3/4 p-2 rounded-lg">
                      {item}
                    </p>
                  )}
                </div>
              ))}
            {/* <p className="flex text-xs">Halo masbro! Selamat datang di GG Suspension <PiHandPalmFill className="text-2xl bg-yellow-200" /></p> */}
          </span>
          <span className="absolute bottom-0 w-full h-[12%] bg-orange-500 flex justify-center items-center gap-2">
            <input
              onChange={(e) => setText(e.target.value)}
              className="h-1/2 w-3/4 rounded-lg pl-2"
              type="text"
              value={text}
            />
            {!isSend && (
              <BsFillSendFill
                onClick={() => {
                  setIsSend(!isSend);
                  setText("");
                  const objText = { isUser: text };
                  setArrayText([...arrayText, objText]);
                  console.log(arrayText);
                  integrasiAPI(arrayText, text).then((res) => {
                    setArrayText([...arrayText, objText, res]);
                    setIsSend(false);
                  });
                }}
                className="text-white"
              />
            )}
            {isSend && (
              <IoMdRefresh className="text-white animate-spin text-2xl" />
            )}
          </span>
        </div>
      )}
      <RiCustomerService2Fill
        onClick={() => setIsCSActive(!isCSActive)}
        className={`fixed bg-orange-500 text-white w-8 tablet:w-10 h-8 tablet:h-10 bottom-[2em] right-4 p-2 z-30 rounded-full`}
      />
    </>
  );
}
