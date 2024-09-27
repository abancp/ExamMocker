"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../../../../../../components/Admin/Header";
import axios from "axios";
import SERVER_URL from "../../../../../../config/serverUrl";
import Link from "next/link";
import useDebounce from "../../../../../../hooks/useDebounce";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { toast } from "sonner";
import { useParams } from "next/navigation";

function page() {
  //M:Mathematics | P:Physics | C:Chemistry
  const [subject, setSubject] = useState("mathematics");
  //Q:Question  | A:Option A  |  B:Option B   |  C:Option C   |  D:Option D
  const [canEdit, setCanEdit] = useState(false);
  const [questionType, setQuestionType] = useState("Q");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [lastIndexes, setLastIndexes] = useState({
    mathematics: 0,
    physics: 0,
    chemistry: 0,
  });
  const [lastType, setLastType] = useState({});
  const questionsIndex = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29,
  ];
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [exam, setExam] = useState({
    mathematics: [],
    physics: [],
    chemistry: [],
  });
  const [topics, setTopics] = useState({
    mathematics: [],
    physics: [],
    chemistry: [],
  });
  const [topic, setTopic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [questionIds] = useState({
    mathematics: [],
    physics: [],
    chemistry: [],
  });
  const [addedQuestionsMap, setAddedQuestionsMap] = useState({});
  const optionIndexToAlpha = useMemo(() => ({
    0: "A",
    1: "B",
    2: "C",
    3: "D",
  }));
  const optionAlphaToIndex = useMemo(() => ({ A: 0, B: 1, C: 2, D: 3 }));
  // const [isLoading,setIsLoading] = useState(false)
  const { examId } = useParams();

  const debounce = useDebounce();

  useEffect(() => {
    axios
      .get(SERVER_URL + "/admin/exam/" + examId, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          let fetchedExam = data.exam?.questions;
          console.log(data.exam);
          if (fetchedExam?.mathematics?.length == 1) {
            if (JSON.stringify(fetchedExam?.mathematics[0]) === "{}") {
              fetchedExam.mathematics = [];
            }
          }
          if (fetchedExam?.physics?.length == 1) {
            if (JSON.stringify(fetchedExam?.physics[0]) === "{}") {
              fetchedExam.physics = [];
            }
          }
          if (fetchedExam?.chemistry?.length == 1) {
            if (JSON.stringify(fetchedExam?.chemistry[0]) === "{}") {
              fetchedExam.chemistry = [];
            }
          }
          setExam(fetchedExam);
          const initialAddedQuestionsMap = {};
          const subjects = ["mathematics", "physics", "chemistry"];
          subjects.forEach((subject0) => {
            fetchedExam[subject0]?.forEach((question0) => {
              initialAddedQuestionsMap[question0?._id] = true;
            });
          });
          setAddedQuestionsMap(initialAddedQuestionsMap);
          setCurrentQuestion(fetchedExam.mathematics[0]);
          setCanEdit(true);
        } else {
          setCanEdit(true);
        }
      });
    axios
      .get(SERVER_URL + "/admin/topics", { withCredentials: true })
      .then(({ data }) => {
        setTopics(data.topics);
      });
  }, []);

  useEffect(() => {
    console.log(exam);
    axios
      .get(`${SERVER_URL}/admin/questions?subject=${subject}&topic=${topic}`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setQuestions(data.questions);
      });
  }, [topic, subject]);

  useEffect(() => {
    console.log(exam);
    console.log(questionIds);
    console.log(currentQuestion?._id in addedQuestionsMap);
  }, [subject, questionNumber]);

  const changeSubject = (e) => {
    if (!canEdit) {
      return;
    }
    setCanEdit(false);
    addCurrentQuestionToExam();
    setCurrentQuestion(null);
    lastIndexes[subject] = questionNumber;
    setSubject(e.target.id);
    setQuestionNumber(lastIndexes[e.target.id]);
    if (exam[e.target.id][lastIndexes[e.target.id]]) {
      setCurrentQuestion(exam[e.target.id][lastIndexes[e.target.id]]);
    }
    setCanEdit(true);
  };

  const changeQuestionNumber = (e) => {
    if (!canEdit) {
      return;
    }
    setCanEdit(false);
    addCurrentQuestionToExam();
    setCurrentQuestion(null);
    lastType[questionNumber + subject] = questionType;
    setQuestionNumber(Number(e.target.id));
    console.log(exam[subject]);
    if (exam[subject][e.target.id]) {
      setCurrentQuestion(exam[subject][e.target.id]);
    }
    if (lastType[e.target.id + subject]) {
      setQuestionType(lastType[e.target.id + subject]);
    } else {
      setQuestionType("Q");
    }
    setCanEdit(true);
  };

  const addCurrentQuestionToExam = () => {
    if (!canEdit) {
      return;
    }
    setCanEdit(false);
    if (currentQuestion) {
      exam[subject][questionNumber] = currentQuestion;
      questionIds[subject][questionNumber] = currentQuestion._id;
      setAddedQuestionsMap((prev) => ({
        ...prev,
        [currentQuestion._id]: true,
      }));
    } else {
      console.log("no question for save");
    }
    setCanEdit(true);
  };

  const save = () => {
    if (!canEdit) {
      return;
    }
    setCanEdit(false);
    console.log(questionIds);
    setSaving(true);
    addCurrentQuestionToExam();
    axios
      .post(
        SERVER_URL + "/admin/exam/save/" + examId,
        { questions: questionIds },
        { withCredentials: true },
      )
      .then(({ data }) => {
        setSaving(false);
        if (data.success) {
          toast.success("Saved Successfully");
          setCanEdit(true);
        } else {
          toast.error(data.message || "something went wrong");
          setCanEdit(true);
        }
      })
      .catch(() => {
        setSaving(false);
        setCanEdit(true);
        toast.error("something went wrong!");
      });
  };

  const searchQuestions = async (search, subjectForSearch, topicForSearch) => {
    if (!canEdit) {
      return;
    }
    console.log(
      `searching for subject : ${subjectForSearch} , topic : ${topicForSearch} , query : ${search}`,
    );
    axios
      .get(
        `${SERVER_URL}/admin/questions?subject=${subjectForSearch}&topic=${topicForSearch}&search=${search}`,
        { withCredentials: true },
      )
      .then(({ data }) => {
        setQuestions(data.questions);
      });
  };

  const debounceGetQuestions = useCallback(debounce(searchQuestions, 200));
  const handleQuestionSelect = (question) => {
    if (!canEdit) {
      return;
    }
    if (question.subject === subject) {
      exam[subject][questionNumber] = question;
      questionIds[subject][questionNumber] = question._id;
      setAddedQuestionsMap((current) => {
        const newObj = { ...current };
        delete newObj[currentQuestion._id];
        return newObj;
      });
      setCurrentQuestion(question);
      setAddedQuestionsMap((prev) => ({
        ...prev,
        [question._id]: true,
      }));
    }
  };
  const removeCurrentQuestionFromExam = () => {
    if (!canEdit) {
      return;
    }
    setAddedQuestionsMap((current) => {
      const newObj = { ...current };
      delete newObj[currentQuestion._id];
      return newObj;
    });
    exam[subject][questionNumber] = {};
    questionIds[subject][questionNumber] = undefined;
    setCurrentQuestion({});
  };
  return (
    <MathJaxContext>
      <div className="min-h-screen max-h-fit flex flex-col pb-3 gap-2 pt-[2.7rem] px-3 w-full">
        <Header />
        <div className="w-full  items-center flex justify-around ">
          <div
            onClick={changeSubject}
            id="mathematics"
            className={`${subject === "mathematics" && "border-b text-[#259ac4]"} cursor-pointer hover:bg-[#21213b] border-primary pt-2 duration-200 px-3 pb-2`}
          >
            Mathematics
          </div>
          <div
            onClick={changeSubject}
            id="physics"
            className={`${subject === "physics" && "border-b text-[#259ac4]"} cursor-pointer hover:bg-[#21213b] border-primary pt-2 duration-200 px-3 pb-2`}
          >
            Physics
          </div>
          <div
            onClick={changeSubject}
            id="chemistry"
            className={`${subject === "chemistry" && "border-b text-[#259ac4]"} cursor-pointer hover:bg-[#21213b] border-primary pt-2 duration-200 px-3 pb-2`}
          >
            Chemistry
          </div>
        </div>
        <div className="flex  gap-[.7rem]  w-full justify-center items-center ">
          {questionsIndex.map((questionIndex, i) => (
            <div
              onClick={changeQuestionNumber}
              key={questionIndex}
              id={i}
              className={` ${questionNumber === questionIndex && "bg-[#21213b] text-[#259ac4]"} cursor-pointer hover:bg-[#21213b] duration-300  flex justify-center items-center w-9 h-9 border border-primary`}
            >
              {questionIndex + 1}
            </div>
          ))}
        </div>

        <div className="w-full border border-primary p-2 flex justify-around items-center">
          <div className="flex items-center w-60 border border-primary">
            <input
              id="search"
              onChange={(e) => {
                setSearchQuery(e.target.value);
                debounceGetQuestions(e.target.value, subject, topic);
              }}
              className="px-1 w-full bg-transparent text-white font-light text-lg focus:outline-none"
              placeholder="search here"
              type="text"
            />
            <div
              onClick={() => {
                searchQuestions(searchQuery, subject, topic);
              }}
              className="border-l p-2 border-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                class="bi cursor-pointer duration-300 hover:text-[#259ac4] bi-search"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </div>
          </div>

          <div className="flex w-60 border border-primary">
            <select
              onChange={(e) => {
                setTopic(e.target.value);
              }}
              className="px-1  p-[.35rem] flex items-center justify-center w-60 text-lg  bg-transparent text-white font-light focus:outline-none"
            >
              <option value={""} className="text-[#2b2b2b91]">
                --select topic--
              </option>
              {topics[subject]?.map((topic) => (
                <option className="text-black" value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => save()}
            className={`${saving && "opacity-70"} py-[.279rem] rounded-md px-2 border border-primary font-bold text-lg bg-[#259ac4]`}
          >
            {saving ? "saving.." : "save"}
          </button>
        </div>

        <div className="border p-2 border-primary flex flex-col gap-2 h-full w-full">
          <div className="border border-[#40c425] flex justify-center items-center border-dashed min-h-20 max-h-fit py-2 px-3 w-full">
            {currentQuestion && JSON.stringify(currentQuestion) !== "{}" ? (
              <div className="w-full py-2 pb-0">
                <div className="flex w-full justify-center gap-4">
                  <h1 className=" text-center  text-xl font-semibold">
                    Question
                  </h1>
                  <button
                    onClick={removeCurrentQuestionFromExam}
                    className="rounded-md bg-primary px-2 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex gap-3 pl-2">
                  <div className="text-lg font-medium">Q:</div>
                  <div className="font-light">
                    <MathJax>{currentQuestion?.question}</MathJax>
                  </div>
                </div>
                {currentQuestion?.type == "MCQ" ? (
                  currentQuestion?.options?.map((option, i) => (
                    <MathJax>
                      <div
                        className={` flex gap-3  rounded-lg ${optionAlphaToIndex[currentQuestion.answer] == i && "bg-[rgba(10,200,10,0.2)]"} w-full px-2 text-[#ffffff]`}
                      >
                        <div className="h-full text-lg font-semibold">
                          {optionIndexToAlpha[i]}:
                        </div>
                        <h1 className="font-semibold">{option}</h1>
                      </div>
                    </MathJax>
                  ))
                ) : (
                  <MathJax>
                    <div className="ml-1 px-1 bg-[rgba(10,200,10,0.2)] pl-2 rounded-lg ">
                      <span className="font-semibold">Answer : </span>
                      {currentQuestion.answer}
                    </div>
                  </MathJax>
                )}
              </div>
            ) : (
              <h1 className="text-3xl font-semibold text-[#259ac481]">
                Question Is Here
              </h1>
            )}
          </div>
          {questions?.map(
            (question) =>
              question._id in addedQuestionsMap && question.type !== "MCQ" || (
                <div className="border-primary  w-full flex justify-between  p-2 border">
                  <div
                    onClick={() => {
                      handleQuestionSelect(question);
                    }}
                    className="whitespace-nowrap cursor-pointer overflow-hidden w-full text-ellipsis"
                  >
                    <MathJax>{question.question}</MathJax>
                  </div>
                  <div className=" flex items-center">
                    <Link
                      href={"/admin/question/" + question._id}
                      className="  px-1 py-[.10rem] bg-[#35353f58] "
                    >
                      Open
                    </Link>
                  </div>
                </div>
              ),
          )}
        </div>
      </div>
    </MathJaxContext>
  );
}

export default page;
