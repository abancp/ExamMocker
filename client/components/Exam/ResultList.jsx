"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SERVER_URL from "../../config/serverUrl";
import Link from "next/link";

function ExamList() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    axios
      .get(SERVER_URL + "/exams-attented/jee", { withCredentials: true })
      .then(({ data }) => {
        console.log(data);
        if (data.success) {
          setExams(data.exams);
        }
      });
  }, []);
  return (
    <div className="w-full flex flex-col gap-3 h-fit ">
      <div className="w-full  text-black hidden md:flex justify-around font-extrabold items-center rounded-lg  bg-[#259ac4] h-12">
        <div className="w-14 flex justify-center items-center">
          <h1 className="text-lg">No</h1>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <h1 className="text-lg text-center">Submitted time</h1>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <h1 className="text-lg">Exam</h1>
        </div>
      </div>
      {exams?.map((exam, i) => (
        <Link
          href={"jee/result/" + exam.exam}
          className={`w-full md:flex cursor-pointer border-primary group  hover:border-[#5cbc20] duration-300 justify-between  items-center rounded-lg border  md:h-12`}
        >
          <div
            className={`md:w-14 w-full duration-300  group-hover:bg-[#5cbc20] bg-[#259ac4] text-black text-lg font-bold flex items-center justify-center h-full text-center md:rounded-l-lg md:rounded-tr-none rounded-t-lg `}
          >
            {i + 1}
          </div>
          <div className="flex w-full py-2">
            <div className="w-1/2 flex justify-center font-semibold text-center items-center">
              <h1 className="text-md font-normal md:text-lg">
                <span className="font-semibold md:hidden">
                  {" "}
                  Submitted Time{" "}
                </span>
                <br className="md:hidden" />
                {String(new Date(exam.submittedTime))?.split("GMT")[0]}
              </h1>
            </div>
            <div className="w-1/2 flex justify-center font-semibold items-center">
              <h1 className="text-lg font-semibold text-center md:text-">
                JEE Mock Test
              </h1>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ExamList;
