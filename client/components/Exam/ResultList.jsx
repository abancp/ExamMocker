"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SERVER_URL from "../../config/serverUrl";
import Link from "next/link";

function ExamList() {

  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState(null);

  useEffect(() => {
    axios
      .get(SERVER_URL + "/exams-attented/jee", { withCredentials: true })
      .then(({ data }) => {
        console.log(data)
        if (data.success) {
          setExams(data.exams);
        }
      });
  }, []);
  return (
    <div className="w-full flex flex-col gap-3 h-fit ">
      <div className="w-full  text-black flex justify-around font-extrabold items-center rounded-lg  bg-[#259ac4] h-12">
        <div className="w-14 flex justify-center items-center">
          <h1 className="text-lg">No</h1>
        </div>
        <div className="w-1/3 flex justify-center items-center">
          <h1 className="text-lg">Submitted time</h1>
        </div>
        <div className="w-1/3 flex justify-center items-center"> 
          <h1 className="text-lg">Exam</h1>
        </div>
        <div className="w-1/3 flex justify-center items-center">
          <h1 className="text-lg">Status</h1>
        </div>
      </div>
      {exams?.map((exam, i) => (
        <Link
          href={"jee/result/"+exam.exam}
          className={`w-full flex cursor-pointer border-[#259ac4] group  hover:border-[#5cbc20] duration-300 justify-between  items-center rounded-lg border  h-12`}
        >
          <div
            className={`w-14  duration-300  group-hover:bg-[#5cbc20] bg-[#259ac4] text-black text-lg font-bold flex items-center justify-center h-full text-center rounded-l-lg`}
          >
            {i + 1}
          </div>
          <div className="w-1/3 flex justify-center font-semibold text-center items-center">
            <h1 className="text-lg">{String(Date(exam.submittedTime))?.split("(")[0]}</h1>
          </div>
          <div className="w-1/3 flex justify-center font-semibold items-center">
            <h1 className="text-lg">JEE Mock Test</h1>
          </div>
          <div className="w-1/3 flex justify-center font-semibold items-center">
            <h1 className="text-lg">attented</h1>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ExamList;
