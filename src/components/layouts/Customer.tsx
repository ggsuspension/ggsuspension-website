import { updateCustomer } from "@/utils/ggAPI";
import {
  getMotorParts,
  getMotors,
  getServices,
  getServiceTypes,
} from "@/utils/ggsAPI";
import { useEffect, useState } from "react";
import {
  FaMotorcycle,
  FaWpforms,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Category, MotorPart, Motor } from "@/types";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import Swal from "sweetalert2";
import { useSearchParams } from "react-router-dom";
import { getChannel } from "@/utils/realtime";
import { setCookie } from "@/utils/setCookie";
import { motion } from "framer-motion";
import ModalWelcome from "../fragments/ModalWelcome";
import { CircleDotDashed } from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: {
    type: string;
    price: number;
    id: string;
    text: string;
    imageUrl: string;
  }[];
}

// Tipe data untuk jawaban
interface Answer {
  questionId: number;
  selectedOptionId: string;
  selectedOptionText: string;
  selectedOptionType: string;
}

export default function Customer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<any[]>([]);
  const [allSubcategoriesFixed, setAllSubcategoriesFixed] = useState<any[]>([]);
  const [allMotorParts, setAllMotorParts] = useState<MotorPart[]>([]);
  const [allMotorPartsFixed, setAllMotorPartsFixed] = useState<MotorPart[]>([]);
  const [motors, setMotors] = useState<Motor[]>([]);
  const [motorsFixed, setMotorsFixed] = useState<Motor[]>([]);
  const [price, setPrice] = useState({ bagianMotor1: 0, bagianMotor2: 0 });
  const [searchParams] = useSearchParams();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const [isModal, setIsModal] = useState(true);

  useEffect(() => {
    if (!searchParams.get("id")) window.location.href = "/#/customer-form";
    async function fetchData() {
      let [categoriesData, motorsData, motorPartsData, subcategoriesData] =
        await Promise.all([
          getServices(),
          getMotors(),
          getMotorParts(),
          getServiceTypes(),
        ]);
      const seen = new Set();
      setAllSubcategoriesFixed(subcategoriesData);
      setAllMotorPartsFixed(motorPartsData);
      subcategoriesData = subcategoriesData.filter(
        (item: any) => !seen.has(item.name) && seen.add(item.name)
      );
      motorPartsData = motorPartsData.filter(
        (item: any) => !seen.has(item.name) && seen.add(item.name)
      );
      setCategories(categoriesData.reverse());
      setAllMotorParts(motorPartsData);
      setMotors(motorsData);
      setMotorsFixed(motorsData);
      setAllSubcategories(subcategoriesData);
    }
    fetchData();
  }, []);

  const questions: Question[] = [
    {
      id: 1,
      text: "Masbro mau service apa nih?",
      options: categories.map((category) => ({
        type: "category",
        id: category.id.toString(),
        text: category.name,
        imageUrl: category.img_path,
        price: 0,
      })),
    },
    {
      id: 2,
      text: "Pilih jenis motor yang masbro punya",
      options: allSubcategories.map((subcategory) => ({
        type: "subcategory",
        id: subcategory.id.toString(),
        text: subcategory.name,
        imageUrl: subcategory.img_path,
        subcategory_id: subcategory.id,
        price: 0,
      })),
    },
    {
      id: 3,
      text: "Bagian motor apa nih masbro yang diservice?",
      options: allMotorParts.map((bagianMotor) => ({
        type: "motorpart",
        price: bagianMotor.price,
        id: bagianMotor.id.toString(),
        text: bagianMotor.name,
        imageUrl: bagianMotor.img_path,
      })),
    },
    {
      id: 4,
      text: "Mau nambah bagian motor lainnya?",
      options: allMotorParts.map((bagianMotor) => ({
        type: "motorpart2",
        price: bagianMotor.price,
        id: bagianMotor.id.toString(),
        text: bagianMotor.name,
        imageUrl: bagianMotor.img_path,
      })),
    },
    {
      id: 5,
      text: "Pilih motor yang masbro punya",
      options: motors.map((motor: any) => ({
        type: "motor",
        id: motor.id.toString(),
        text: motor.name,
        imageUrl: motor.img_path,
        price: 0,
      })),
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const currentQuestion = questions[currentQuestionIndex];

  const handleSelectOption = (
    optionId: string,
    optionText: string,
    optionPrice: number,
    optionType: string
  ) => {
    if (questions[currentQuestionIndex].options[0].type == "motorpart")
      setPrice({ ...price, bagianMotor1: optionPrice });
    if (questions[currentQuestionIndex].options[0].type == "motorpart2")
      setPrice({ ...price, bagianMotor2: optionPrice });
    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      selectedOptionText: optionText,
      selectedOptionType: optionType,
    };
    answers[currentQuestionIndex] = newAnswer;
    setAnswers([...answers]);
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 500);
    } else {
      setShowResults(true);
    }
  };

  const channel = getChannel();
  const sendMessage = (data: any) => {
    channel?.send({
      type: "broadcast",
      event: "message",
      payload: {
        data,
        timestamp: new Date().toISOString(),
      },
    });
  };

  async function handleSubmit() {
    setIsSubmit(true);
    const result = await updateCustomer({
      id: searchParams.get("id"),
      layanan: answers[0].selectedOptionText,
      jenis_motor: answers[1].selectedOptionText,
      bagian_motor: answers[2].selectedOptionText,
      bagian_motor2: answers.length < 5 ? "" : answers[3].selectedOptionText,
      motor:
        answers.length < 5
          ? answers[3].selectedOptionText
          : answers[4].selectedOptionText,
      harga_service: price.bagianMotor1 + price.bagianMotor2,
    });
    if (result.success) {
      setCookie("pelangganGGSuspension", JSON.stringify(result.data));
      sendMessage(result.data);
      setIsSubmit(false);
      Swal.fire("Sukses!", "Berhasil menambahkan antrian", "success");
      setTimeout(() => {
        window.location.href = `/#/antrian/${searchParams.get("gerai")}`;
        window.location.reload();
      }, 500);
    }
  }

  function handleMotorLainnya(e: any) {
    e.preventDefault();
    handleSelectOption("100", e.target.motor.value, 0, "motor");
    setIsInput(false);
  }

  useEffect(() => {
    if (answers.length > 0) {
      if (answers[currentQuestionIndex]?.selectedOptionType === "category") {
        let res = allSubcategoriesFixed.filter(
          (item) =>
            item.category?.name ===
            answers[currentQuestionIndex].selectedOptionText
        );
        setAllSubcategories(res);
      } else if (
        answers[currentQuestionIndex]?.selectedOptionType === "subcategory"
      ) {
        let res = allMotorPartsFixed.filter(
          (item) =>
            item.subcategory_id ==
            answers[currentQuestionIndex].selectedOptionId
        );
        setAllMotorParts(res);
      } else if (questions[currentQuestionIndex].options[0].type == "motor") {
        if (answers[1].selectedOptionText.includes("OHLINS")) {
          setAnswers([
            ...answers,
            {
              questionId: 5,
              selectedOptionId: "0",
              selectedOptionText: "Motor Lainnya",
              selectedOptionType: "motor",
            },
          ]);
          return setShowResults(true);
        }
        setMotors(
          motorsFixed.filter(
            (item) => item.subcategory == answers[1].selectedOptionText
          )
        );
      }
    }
  }, [answers, currentQuestionIndex]);

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-900 relative flex items-center justify-center p-6 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 1440 900"
        >
          <path
            fill="#ffffff"
            d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,224C1120,245,1280,267,1360,277.3L1440,288L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          />
        </svg>
        {isSubmit && (
          <>
            <div className="fixed inset-0 bg-black opacity-70 z-10"></div>
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-500 border-b-4"></div>
            </motion.div>
          </>
        )}
        <motion.div
          className="bg-black bg-opacity-90 rounded-xl shadow-2xl p-8 border-t-4 border-yellow-500 relative max-w-lg w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
          <div className="flex items-center justify-center mb-6">
            <FaWpforms className="text-4xl text-yellow-500 mr-3" />
            <h1 className="text-3xl font-extrabold text-white">REKAP FORM</h1>
          </div>
          <div className="space-y-5 mb-6">
            {questions.map((question, index) => {
              const answer = answers.find((a) => a.questionId === question.id);
              // const selectedOption = question.options.find(
              //   (o) => o.id === answer?.selectedOptionId
              // );
              return (
                <motion.div
                  key={question.id}
                  className="bg-gray-900 p-5 rounded-lg shadow-md border-l-4 border-orange-500"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className="font-bold text-white mb-2 flex items-center">
                    <FaCheckCircle className="text-orange-500 mr-2" />
                    {index + 1}. {question.text}
                  </p>
                  <p className="text-yellow-400 font-semibold">
                    {answer?.selectedOptionText || "Tidak dijawab"}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <div className="bg-gray-900 p-5 rounded-lg shadow-md mb-6">
            <p className="font-bold text-white flex items-center">
              <FaCheckCircle className="text-yellow-500 mr-2" />
              Total Harga
            </p>
            <p className="text-yellow-400 text-2xl font-bold">
              {(price.bagianMotor1 + price.bagianMotor2).toLocaleString(
                "id-ID",
                {
                  style: "currency",
                  currency: "IDR",
                }
              )}
            </p>
            <p className="text-red-500 text-sm mt-1 italic">
              *Harga tidak termasuk sparepart tambahan
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button
              onClick={() => setShowResults(false)}
              className="bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-gray-600 transition-all "
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IoIosArrowDropleftCircle className="text-2xl" />
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 rounded-lg shadow-lg hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center"
              disabled={isSubmit}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmit ? (
                <>
                  <div className="animate-spin h-5 w-5 border-t-2 border-black rounded-full mr-2"></div>
                  MEMPROSES...
                </>
              ) : (
                <>
                  <FaCheckCircle className="mr-2" />
                  KIRIM SEKARANG
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-700 via-orange-400 to-orange-800 relative p-6 overflow-hidden">
      {isModal && <ModalWelcome></ModalWelcome>}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 1440 900"
      >
        <path
          fill="#ffffff"
          d="M0,224L80,213.3C160,203,320,181,480,181.3C640,181,800,203,960,224C1120,245,1280,267,1360,277.3L1440,288L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        />
      </svg>
      <div className="container mx-auto">
        <motion.div
          className="bg-black bg-opacity-90 rounded-xl shadow-2xl p-8 border-t-4 border-yellow-500 relative"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-6">
            <h1 className="text-2xl tablet:text-5xl font-bold text-center text-white mb-2 flex items-center justify-center gap-3 bg-black bg-opacity-30 py-6  rounded-lg shadow-lg border-b-4 border-orange-500">
              FORM{" "}
              <>
                <span className="bg-orange-500 text-black px-2 py-1 rounded mx-1 shadow-inner">
                  ANTRIAN
                </span>
              </>
              <FaMotorcycle className="inline text-yellow-400 ml-2" />
            </h1>

            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
              <svg
                width="200"
                height="6"
                viewBox="0 0 200 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0,3 C20,0 40,6 60,3 C80,0 100,6 120,3 C140,0 160,6 180,3 C190,1 200,3 200,3"
                  stroke="black"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3 text-white">
              <span className="font-semibold">
                Pertanyaan {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6 border-l-4 border-orange-500">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FaCheckCircle className="text-yellow-500 mr-2" />
              {currentQuestion.text}
            </h2>
            {questions[currentQuestionIndex].options[0] &&
              questions[currentQuestionIndex].options[0].type ==
                "motorpart2" && (
                <p className="text-red-400 text-lg mb-4">
                  Klik panah di bawah jika tidak menambah bagian motor lainnya{" "}
                </p>
              )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {currentQuestion.options.map((option) => {
                const isSelected = answers.some(
                  (a) =>
                    a.questionId === currentQuestion.id &&
                    a.selectedOptionId === option.id
                );
                return (
                  <motion.div
                    key={option.id}
                    onClick={() => {
                      setIsModal(false);
                      handleSelectOption(
                        option.id,
                        option.text,
                        option.price,
                        option.type
                      );
                      setIsInput(false);
                    }}
                    className={`p-5 rounded-lg cursor-pointer shadow-md transition-all duration-300 ${
                      isSelected
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-800 text-white"
                    } hover:bg-yellow-600 hover:text-black`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {option.type !== "motorpart" &&
                      option.type !== "motorpart2" && (
                        <img
                          src={option.imageUrl}
                          alt={option.text}
                          className="w-full h-40 object-cover rounded-lg mb-3 shadow-sm"
                        />
                      )}
                    <p className="text-center font-bold flex items-center justify-center text-xl">
                      {isSelected ? (
                        <FaCheckCircle className="mr-2" />
                      ) : (
                        <FaTimesCircle className="mr-2" />
                      )}
                      {option.text}
                    </p>
                  </motion.div>
                );
              })}
              {questions[currentQuestionIndex].options[0] &&
                questions[currentQuestionIndex].options[0].type == "motor" && (
                  <motion.div
                    onClick={() => {
                      setIsInput(true);
                    }}
                    className={`p-5 rounded-lg cursor-pointer shadow-md transition-all duration-300 hover:bg-yellow-600 hover:text-black  ${
                      answers[currentQuestionIndex] &&
                      answers[currentQuestionIndex].selectedOptionId == "100"
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-800 text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* {option.type !== "motorpart" &&
                      option.type !== "motorpart2" && (
                      )} */}
                    <p className="text-center font-bold flex items-center justify-center text-xl">
                      <CircleDotDashed className="mr-2" /> Motor Lainnya
                      {/* {isSelected ? (
                        <FaCheckCircle className="mr-2" />
                      ) : (
                        <FaTimesCircle className="mr-2" />
                      )} */}
                      {/* {option.text} */}
                    </p>
                    {isInput && (
                      <form
                        onSubmit={handleMotorLainnya}
                        className="flex flex-col gap-2"
                      >
                        <input
                          type="text"
                          name="motor"
                          defaultValue={
                            answers[currentQuestionIndex]
                              ? answers[currentQuestionIndex].selectedOptionText
                              : ""
                          }
                          className="p-1 rounded-xl mt-2 pl-3"
                          placeholder="Tulis Motor Anda.."
                        />
                        <button className="bg-orange-600 text-white font-bold p-2 rounded-full shadow-lg hover:bg-gray-600 transition-all self-center">
                          KIRIM
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
            </div>
          </div>
          <div className="flex justify-between">
            {currentQuestionIndex > 0 && (
              <motion.button
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                }
                className="bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-600 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <IoIosArrowDropleftCircle className="text-3xl" />
              </motion.button>
            )}
            {questions[currentQuestionIndex].options[0] &&
              (answers[currentQuestionIndex] ||
                questions[currentQuestionIndex].options[0].type ==
                  "motorpart2") && (
                <motion.button
                  onClick={() =>
                    questions.length - 1 === currentQuestionIndex
                      ? setShowResults(true)
                      : setCurrentQuestionIndex(currentQuestionIndex + 1)
                  }
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black p-3 rounded-full shadow-lg hover:from-yellow-600 hover:to-orange-600 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IoIosArrowDroprightCircle className="text-3xl" />
                </motion.button>
              )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
