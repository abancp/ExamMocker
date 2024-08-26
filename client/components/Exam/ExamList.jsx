"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SERVER_URL from "../../config/serverUrl";
import Link from "next/link";

function ExamList() {
  const [exams, setExams] = useState([]);
  const [registeredExams, setRegisteredExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);
  useEffect(() => {
    axios
      .get(SERVER_URL + "/ready-exams", { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setExams(data.exams);
        }
      });
    axios
      .get(SERVER_URL + "/exam-registered/jee", { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setRegisteredExams(data.exams?.exams);
          console.log(data.exams?.exams);
        }
      });
  }, []);
  const toggleSelectExam = (examId) => {
    if (examId == selectedExamId) {
      setSelectedExamId(null);
    } else {
      setSelectedExamId(examId);
    }
  };
  return (
    <div className="w-full flex flex-col gap-3 h-fit ">
      <div className="w-full  text-black flex justify-around font-extrabold items-center rounded-lg  bg-[#259ac4] h-12">
        <div className="w-14 flex justify-center items-center">
          <h1 className="text-lg">No</h1>
        </div>
        <div className="w-1/4 flex justify-center items-center">
          <h1 className="text-lg">Exam Date</h1>
        </div>
        <div className="w-1/4 flex justify-center items-center">
          <h1 className="text-lg">Questions</h1>
        </div>
        <div className="w-1/4 flex justify-center items-center">
          <h1 className="text-lg">Exam</h1>
        </div>
        <div className="w-1/4 flex justify-center items-center">
          <h1 className="text-lg">Status</h1>
        </div>
      </div>
      {exams?.map((exam, i) => (
        <div
          onClick={() => {
            toggleSelectExam(exam._id);
          }}
          className={`w-full flex cursor-pointer group  ${selectedExamId === exam._id ? "border-[#5cbc20]" : "border-[#259ac4]"} hover:border-[#5cbc20] duration-300 justify-around  items-center rounded-lg border  h-12`}
        >
          <div
            className={`w-14  duration-300  group-hover:bg-[#5cbc20] bg-[#259ac4] ${selectedExamId === exam._id ? "bg-[#5cbc20]" : "bg-[#259ac4]"} text-black text-lg font-bold flex items-center justify-center h-full text-center rounded-l-lg`}
          >
            {i + 1}
          </div>
          <div className="w-1/4 flex justify-center md:font-semibold items-center">
            <h1 className="md:text-lg text-center">{exam.date?.replace("T", "  ")}</h1>
          </div>
          <div className="w-1/4 flex justify-center md:font-semibold items-center">
            <h1 className="md:text-lg">{exam.totalQuestions}</h1>
          </div>
          <div className="w-1/4 flex justify-center md:font-semibold items-center">
            <h1 className="md:text-lg">{exam.exam}</h1>
          </div>
          <div className="w-1/4 flex justify-center md:font-semibold items-center">
            <h1 className="md:text-lg text-center">
              upcoming{registeredExams?.includes(exam._id) && " (registered)"}
            </h1>
          </div>
        </div>
      ))}
      <div className="w-full pt-2 flex justify-center items-center">
        <Link
          href={`${selectedExamId ? (registeredExams?.includes(selectedExamId) ? "/jee/waiting/" + selectedExamId : "/jee/register/" + selectedExamId) : ""}`}
        >
          <button
            className={`group ${selectedExamId || "opacity-80 cursor-not-allowed"} hover:text-white text-black flex gap-3  items-center text-lg font-semibold bg-[rgb(37,154,196)] p-3 px-4 duration-300 rounded-[2rem]`}
          >
            {selectedExamId
              ? registeredExams?.includes(selectedExamId)
                ? "Open Registered Exam"
                : "Register Now For Free"
              : "Select Exam"}
            {selectedExamId && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                class="group-hover:ml-3 group-hover:text-white  duration-300  bi relative  bi-arrow-right"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                />
              </svg>
            )}
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ExamList;
