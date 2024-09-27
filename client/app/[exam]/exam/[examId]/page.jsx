"use client";

import { useEffect, useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import QuestionIcon from "../../../../components/Jee/QuestionIcon";
import { useParams } from "next/navigation";
import SERVER_URL from "../../../../config/serverUrl";
import axios from "axios";
import useHashString from "../../../../hooks/useHashString";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const JeeExam = () => {
  const { examId } = useParams();
  const [subject, setSubject] = useState("mathematics");
  const [questionIndexesMap, setQuestionIndexesMap] = useState({
    notVisited: 89,
    notAnswered: 1,
    answered: 0,
    MForReview: 0,
    MForReviewAndA: 0,
  });
  const questionStateIndexToState = {
    1: "notVisited",
    2: "notAnswered",
    3: "answered",
    4: "MForReview",
    5: "MForReviewAndA",
  };
  const [questionIndexes, setQuestionIndexes] = useState({
    mathematics: [
      2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
    ],
    physics: [
      2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
    ],
    chemistry: [
      2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
    ],
  });
  const [answers, setAnswers] = useState({});
  const [exam, setExam] = useState({});
  const [questions, setQuestions] = useState({
    mathematics: [],
    physics: [],
    chemistry: [],
  });
  const [currentQuestion, setCurrentQuestion] = useState();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answersDB, setAnswersDB] = useState();
  const [lastIndexes, setLastIndexes] = useState({
    mathematics: 0,
    physics: 0,
    chemistry: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const hashData = useHashString();
  const router = useRouter();
  const optionAlphaToIndex = { A: 0, B: 1, C: 2, D: 3 };
  const [examDate, setExamDate] = useState(null)

  useEffect(() => {
    let exams;
    const dbRequest = window.indexedDB.open("examsDB", 1);
    const resultDbRequest = window.indexedDB.open("resultsDB", 1);
    dbRequest.onupgradeneeded = (e) => {
      const db = e.target.result;
      db.createObjectStore("exams", { keyPath: "_id" });
    };
    resultDbRequest.onupgradeneeded = (e) => {
      const db = e.target.result;
      db.createObjectStore("exams", { keyPath: "_id" });
    };
    dbRequest.onsuccess = (e) => {
      const db = e.target.result;
      const transaction = db.transaction("exams", "readonly");
      exams = transaction.objectStore("exams");
      let getReq = exams.get(examId);
      getReq.onsuccess = (e) => {
        setCurrentQuestion(e.target.result?.questions[subject][0]);
        setQuestions(e.target.result?.questions);
        setExamDate(e.target.result?.date)
      };
      setCurrentQuestion(questions[subject][0]);
    };
    resultDbRequest.onsuccess = (e) => {
      const db = e.target.result;
      setAnswersDB(db);
      let transaction = db.transaction("exams", "readwrite");
      const answersStore = transaction.objectStore("exams");
      let getAnswersReq = answersStore.get("response-" + examId);
      getAnswersReq.onsuccess = (e) => {
        if (e.target.result?.answers) {
          setAnswers(e.target.result?.answers);
          setOption(e.target.result?.answers[subject[0] + "-" + 0]);
        }
      };
      let getQuestionIndexesReq = answersStore.get("state-" + examId);
      getQuestionIndexesReq.onsuccess = (e) => {
        console.log(e.target.result);
        if (e.target.result?.questionIndexes) {
          setQuestionIndexes(e.target.result?.questionIndexes);
          let tempQuestionIndexesMap = {
            notVisited: 0,
            notAnswered: 0,
            answered: 0,
            MForReview: 0,
            MForReviewAndA: 0,
          }          
          for(const [subject,subjectsQIndexes] of Object.entries(e.target.result?.questionIndexes)){
            for( const qIndex of subjectsQIndexes){
              switch (qIndex) {
                case 1:
                  tempQuestionIndexesMap.notVisited++ 
                  break;
                case 2:
                  tempQuestionIndexesMap.notAnswered++ 
                  break;
                case 3:
                  tempQuestionIndexesMap.answered++ 
                  break;
                case 4:
                  tempQuestionIndexesMap.MForReview++ 
                  break;
                case 5:
                  tempQuestionIndexesMap.MForReviewAndA++ 
                  break;
                default:
                  console.log("questionIndexMap from indexed db system crashed ,qIndex : "+qIndex)
                  break;
              }
            } 
          }
          setQuestionIndexesMap(tempQuestionIndexesMap)
        }
      };
    };
  }, []);

  useEffect(() => {
    if (answersDB) {
      let transaction = answersDB.transaction("exams", "readwrite");
      let answersStore = transaction.objectStore("exams");
      answersStore?.put({ _id: "response-" + examId, answers, examDate });
      answersStore?.put({ _id: "state-" + examId, questionIndexes });
    }
  }, [answers]);

  const changeSubject = (e) => {
    lastIndexes[subject] = currentQuestionIndex;
    setSubject(e.target.id);
    if (questionIndexes[e.target.id][lastIndexes[e.target.id]] === 1) {
      questionIndexes[e.target.id][lastIndexes[e.target.id]] = 2;
    }
    setCurrentQuestionIndex(lastIndexes[e.target.id]);
    setCurrentQuestion(questions[e.target.id][lastIndexes[e.target.id]]);
    let option = answers[e.target.id[0] + "-" + lastIndexes[e.target.id]];
    console.log(optionAlphaToIndex[option]);
    if (option) {
      setOption(option);
    } else {
      clearOption();
    }
    console.log(subject);
  };

  const changeQuestionNumber = (questionIndex) => {
    console.log(questions);
    if (questionIndexes[subject][questionIndex] === 1) {
      questionIndexes[subject][questionIndex] = 2;
      setQuestionIndexesMap((prev) => ({
        ...prev,
        notVisited: prev.notVisited - 1,
        notAnswered: prev.notAnswered + 1,
      }));
    }
    setCurrentQuestionIndex(questionIndex);
    setCurrentQuestion(questions[subject][questionIndex]);
    let option = answers[subject[0] + "-" + questionIndex];
    console.log(option);
    if (option) {
      setOption(option);
    } else {
      clearOption();
    }
  };

  const saveAndNext = () => {
    if (selectedOption) {
      setQuestionIndexes((prevIndexes) => ({
        ...prevIndexes,
        [subject]: prevIndexes[subject].map((item, i) =>
          i === currentQuestionIndex ? 3 : item,
        ),
      }));
      setAnswers((prev) => ({
        ...prev,
        [subject[0] + "-" + currentQuestionIndex]: selectedOption,
      }));
    } else {
      setQuestionIndexes((prevIndexes) => ({
        ...prevIndexes,
        [subject]: prevIndexes[subject].map((item, i) =>
          i === currentQuestionIndex ? 2 : item,
        ),
      }));
      setAnswers((prev) => ({
        ...prev,
        [subject[0] + "-" + currentQuestionIndex]: selectedOption,
      }));
    }
    console.log(questionIndexes[currentQuestionIndex]);
    if (
      questionStateIndexToState[
      questionIndexes[subject][currentQuestionIndex]
      ] !== "answered"
    ) {
      setQuestionIndexesMap((prev) => ({
        ...prev,
        answered: prev.answered + 1,
        [questionStateIndexToState[
          questionIndexes[subject][currentQuestionIndex]
        ]]:
          prev[
          questionStateIndexToState[
          questionIndexes[subject][currentQuestionIndex]
          ]
          ] - 1,
      }));
    }
    let transaction = answersDB.transaction("exams", "readwrite");
    let answersStore = transaction.objectStore("exams");
    answersStore?.put({ _id: "response-" + examId, answers });
    answersStore?.put({ _id: "state-" + examId, questionIndexes });
    if (currentQuestionIndex < 29) {
      changeQuestionNumber(currentQuestionIndex + 1);
    }
  };
  const markForReview = () => {
    if (selectedOption) {
      setQuestionIndexes((prevIndexes) => ({
        ...prevIndexes,
        [subject]: prevIndexes[subject].map((item, i) =>
          i === currentQuestionIndex ? 5 : item,
        ),
      }));

      setAnswers((prev) => ({
        ...prev,
        [subject[0] + "-" + currentQuestionIndex]: selectedOption,
      }));

      if (
        questionStateIndexToState[
        questionIndexes[subject][currentQuestionIndex]
        ] !== "MForReviewAndA"
      ) {
        setQuestionIndexesMap((prev) => ({
          ...prev,
          MForReviewAndA: prev.MForReviewAndA + 1,
          [questionStateIndexToState[
            questionIndexes[subject][currentQuestionIndex]
          ]]:
            prev[
            questionStateIndexToState[
            questionIndexes[subject][currentQuestionIndex]
            ]
            ] - 1,
        }));
      }
    } else {
      setQuestionIndexes((prevIndexes) => ({
        ...prevIndexes,
        [subject]: prevIndexes[subject].map((item, i) =>
          i === currentQuestionIndex ? 4 : item,
        ),
      }));
      setAnswers((prev) => ({
        ...prev,
        [subject[0] + "-" + currentQuestionIndex]: selectedOption,
      }));
      if (
        questionStateIndexToState[
        questionIndexes[subject][currentQuestionIndex]
        ] !== "MForReview"
      ) {
        setQuestionIndexesMap((prev) => ({
          ...prev,
          MForReview: prev.MForReview + 1,
          [questionStateIndexToState[
            questionIndexes[subject][currentQuestionIndex]
          ]]:
            prev[
            questionStateIndexToState[
            questionIndexes[subject][currentQuestionIndex]
            ]
            ] - 1,
        }));
      }
    }
    if (currentQuestionIndex < 29) {
      changeQuestionNumber(currentQuestionIndex + 1);
    }
  };

  const saveAndJump = (jumpTo) => {
    if (jumpTo > 29 || jumpTo < 0) {
      return;
    }
    if (selectedOption) {
      setQuestionIndexes((prevIndexes) => ({
        ...prevIndexes,
        [subject]: prevIndexes[subject].map((item, i) =>
          i === currentQuestionIndex ? 3 : item,
        ),
      }));
    }

    changeQuestionNumber(jumpTo);
  };
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const clearOption = () => {
    setSelectedOption(null);

    const inputs = window.document.getElementsByName("mcq_option");
    inputs.forEach((option) => {
      option.checked = false;
    });
    const numericalInput = window.document.getElementById("numerical_input");
    if (numericalInput) {
      numericalInput.value = null;
    }
  };

  const setOption = (optionAlpha) => {
    setSelectedOption(optionAlpha);

    const inputs = window.document.getElementsByName("mcq_option");
    inputs.forEach((option, i) => {
      option.checked = i === optionAlphaToIndex[optionAlpha] ? true : false;
    });
  };

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const submit = async () => {
    const hash = await hashData(answers);
    window.localStorage.setItem("k-" + examId, hash);
    axios
      .post(
        SERVER_URL + "/exam/jee/" + examId,
        { response: answers, state: questionIndexes, key: hash },
        { withCredentials: true },
      )
      .then(({ data }) => {
        if (data.success) {
          toast.success(data.message);
          window.localStorage.removeItem("k-" + examId);
          if (answersDB) {
            let transaction = answersDB.transaction("exams", "readwrite");
            let answersStore = transaction.objectStore("exams");
            const deleteResponseReq = answersStore?.delete(
              "response-" + examId,
            );
            const deleteStateReq = answersStore?.delete("state-" + examId);
            deleteResponseReq.onsuccess = () => {
              console.log("response deleted");
            };
            deleteStateReq.onsuccess = () => {
              console.log("state deleted");
            };
          }
        }
      })
      .catch((data) => {
        let errMsg = data.response.data.error || "something went wrong!";
        toast.error(
          //TODO:errMsg + " Don't worry . you can try in home page within 23 hrs",
          errMsg + " Try again",
        );
      });
    router.push("/jee/review/" + examId);
  };

  const [time, setTime] = useState({ seconds: 0, minutes: 0, hours: 3 });

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setTime((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(countdownInterval); // Stop the countdown
          submit();
          console.log("Stop"); // Print stop when time reaches 0:0:0
          return prev;
        } else if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [time]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const goToBottum = () => {
    const questionElement = window.document.getElementById("exam-element")
    questionElement.scrollTop = questionElement.scrollHeight
  }

  return (
    <MathJaxContext>
      {loading && (
        <div className="fixed top-0 left-0 h-screen w-full bg-white z-[100] flex flex-col  items-center justify-center ">
          {" "}
          <h1 className="text-blue-700 text-4xl font-bold">ExamMocker</h1>
          <br />
          <h1 className="text-2xl font-semibold text-orange-500">
            Loading...
          </h1>{" "}
        </div>
      )}
      <div className="max-h-max min-h-screen w-full bg-white text-black">
        <div className=" text-blue-700 font-bold justify-between px-3 pb-1 items-center flex  h-16">
          <h1 className="text-xl md:text-3xl">ExamMocker</h1>
          <div>
            <h1 className="hidden sm:block text-sm md:text-lg">
              Candidate Name : Aban Muhammed C P
            </h1>
            <h4 className="flex text-sm md:text-lg  items-center">
              <span className="hidden sm:block">Remaining Time :</span>
              <div className="text-white justify-center  bg-blue-600 ml-1 w-24  font-[400] text-lg flex items-center h-[18px] px-2 rounded-full ">
                {String(time.hours).length == 1 ? "0" + time.hours : time.hours}
                :
                {String(time.minutes).length == 1
                  ? "0" + time.minutes
                  : time.minutes}
                :
                {String(time.seconds).length == 1
                  ? "0" + time.seconds
                  : time.seconds}
              </div>
            </h4>
          </div>
          <svg
            onClick={toggleMenu}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-list block md:hidden cursor-pointer text-xl font-bold w-7 h-7"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
            />
          </svg>
        </div>
        <div className="bg-orange-500 text-white w-full h-12 md:h-20 flex px-4">
          <div className="flex gap-3 ml-4  items-center ">
            <h1 className=" font-semibold text-lg md:font-bold md:text-2xl">
              {" "}
              JEE MAIN{" "}
            </h1>
            <div
              id="mathematics"
              onClick={changeSubject}
              className={`${subject === "mathematics" ? "bg-blue-900 " : "bg-blue-500"} cursor-pointer duration-300 bg-blue-700 p-1 text-sm md:text-lg px-2 h-fit`}
            >
              Mathematics
            </div>
            <div
              id="physics"
              onClick={changeSubject}
              className={`${subject === "physics" ? "bg-blue-900 " : "bg-blue-500"} cursor-pointer bg-blue-700 duration-300 p-1 text-sm md:text-lg px-2 h-fit`}
            >
              Physics
            </div>
            <div
              id="chemistry"
              onClick={changeSubject}
              className={`${subject === "chemistry" ? "bg-blue-900" : "bg-blue-500"} cursor-pointer bg-blue-700 duration-300 p-1 text-sm md:text-lg px-2 h-fit`}
            >
              Chemistry
            </div>
          </div>
        </div>
        <div className="px-10 flex gap-3">
          <div className=" w-full md:w-[70%]">
            <div className="flex px-3 py-1 mt-2 justify-between border-b-[1px] border-black items-center">
              <h1 className="text-lg font-semibold">
                Question {currentQuestionIndex + 1}:
              </h1>
              <div onClick={() => { goToBottum() }} className="cursor-pointer p-2 py-1 text-white rounded-full bg-blue-700">
                <h1 className="text-2xl font-serif font-bold">↓</h1>
              </div>
            </div>
            <div id="exam-element" className="h-[23rem] border-b border-black overflow-y-scroll">
              <h1 className="p-3 text-xl font-sans font-semibold">
                <MathJax>{currentQuestion?.question}</MathJax>
              </h1>
              {currentQuestion?.type == "MCQ" ? (
                <div className="flex flex-col gap-3 p-3 ">
                  <label
                    htmlFor="mcq_option_1"
                    className="w-fit cursor-pointer flex gap-3"
                  >
                    <input
                      onChange={handleOptionChange}
                      className="cursor-pointer option-input "
                      type="radio"
                      name="mcq_option"
                      id="mcq_option_1"
                      value="A"
                    />
                    <MathJax>
                      <h1 className="text-xl font-medium">
                        {" "}
                        (1){" "}
                        <span className="ml-5">
                          {currentQuestion?.options[0]}
                        </span>
                      </h1>
                    </MathJax>
                  </label>
                  <label
                    htmlFor="mcq_option_2"
                    className="w-fit cursor-pointer flex gap-3"
                  >
                    <input
                      onChange={handleOptionChange}
                      className="cursor-pointer option-input "
                      type="radio"
                      name="mcq_option"
                      id="mcq_option_2"
                      value="B"
                    />
                    <MathJax>
                      <h1 className="text-xl font-medium">
                        {" "}
                        (2){" "}
                        <span className="ml-5">
                          {currentQuestion?.options[1]}
                        </span>
                      </h1>
                    </MathJax>
                  </label>
                  <label
                    htmlFor="mcq_option_3"
                    className="w-fit cursor-pointer flex gap-3"
                  >
                    <input
                      onChange={handleOptionChange}
                      className="cursor-pointer option-input"
                      type="radio"
                      name="mcq_option"
                      id="mcq_option_3"
                      value="C"
                    />
                    <MathJax>
                      <h1 className="text-xl font-medium">
                        {" "}
                        (3){" "}
                        <span className="ml-5">
                          {currentQuestion?.options[2]}
                        </span>
                      </h1>
                    </MathJax>
                  </label>
                  <label
                    htmlFor="mcq_option_4"
                    className="w-fit cursor-pointer flex gap-3"
                  >
                    <input
                      onChange={handleOptionChange}
                      className="cursor-pointer option-input "
                      type="radio"
                      name="mcq_option"
                      id="mcq_option_4"
                      value="D"
                    />
                    <MathJax>
                      <h1 className="text-xl font-medium">
                        {" "}
                        (4){" "}
                        <span className="ml-5">
                          {currentQuestion?.options[3]}
                        </span>
                      </h1>
                    </MathJax>
                  </label>
                </div>
              ) : (
                <input
                  id="numerical_input"
                  type="number"
                  value={selectedOption}
                  onChange={handleOptionChange}
                  className="border-2 rounded-md focus:outline-4 ml-3 px-1 focus:outline-[rgba(12,12,230,0.7)] border-blue-500"
                />
              )}
            </div>

            <div className="flex mt-5 gap-3 md:text-lg text-md">
              <button
                onClick={saveAndNext}
                className="bg-green-600  px-2 py-1 font-semibold text-white"
              >
                Save & Next
              </button>

              <button
                onClick={clearOption}
                className="border border-black  px-2 py-1  font-semibold text-black"
              >
                Clear Response
              </button>
              <button
                onClick={markForReview}
                className="bg-orange-500  px-2 py-1  font-semibold text-white"
              >
                Mark For Review & Next
              </button>
            </div>
            <div className="flex mt-5 p-3 bg-gray-200 justify-between font-semibold">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    saveAndJump(currentQuestionIndex - 1);
                  }}
                  className="px-2 py-1 border border-black text-black"
                >
                  BACK
                </button>
                <button
                  onClick={() => {
                    saveAndJump(currentQuestionIndex + 1);
                  }}
                  className="px-2 py-1 border border-black text-black"
                >
                  NEXT
                </button>
              </div>
              <button
                onClick={() => {
                  confirm("Are you sure to submit exam") && submit();
                }}
                className="px-2 py-1 bg-green-600 text-white font-semibold"
              >
                SUBMIT
              </button>
            </div>
          </div>

          <div
            className={`md:w-[30%] right-0 top-0 overflow-y-scroll  h-full fixed md:static bg-white p-5 md:block  pt-5 ${showMenu ? "block" : "hidden"} `}
          >
            <div className="w-full justify-betwean items-center flex md:hidden ">
              <div className="w-full">
                <div className="text-blue-600">
                  <h1 className="font-semibold text-lg sm:hidden">
                    Candidate Name : Aban Muhammed C P
                  </h1>
                </div>
              </div>
              <svg
                onClick={toggleMenu}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-x-lg w-7 text-red-700 h-7 font-bolg text-lg"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
            </div>
            <div className="grid gap-2 mt-2 grid-cols-2 w-">
              <div className="flex gap-1  items-center">
                {" "}
                <QuestionIcon
                  type={1}
                  number={questionIndexesMap.notVisited}
                />{" "}
                Not Visited
              </div>
              <div className="flex gap-1  items-center">
                <QuestionIcon
                  type={2}
                  number={questionIndexesMap.notAnswered}
                />{" "}
                Not Answered
              </div>
              <div className="flex gap-1  items-center">
                <QuestionIcon type={3} number={questionIndexesMap.answered} />{" "}
                Answered
              </div>
              <div className="flex gap-1  items-center">
                {" "}
                <QuestionIcon
                  type={4}
                  number={questionIndexesMap.MForReview}
                />{" "}
                Marked For Review
              </div>
            </div>
            <div className="flex gap-1 mt-1 items-center">
              {" "}
              <QuestionIcon
                type={5}
                number={questionIndexesMap.MForReviewAndA}
              />{" "}
              Answered & Marked for Review{" "}
            </div>
            <div className="overflow-y-scroll h-72 mt-10 p-2   w-full grid grid-cols-5">
              {questionIndexes[subject]?.map((type, i) => (
                <div
                  className="cursor-pointer"
                  onClick={() => saveAndJump(i)}
                  id={String(i)}
                >
                  <QuestionIcon type={type} number={i + 1} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MathJaxContext>
  );
};

export default JeeExam;
