"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import SERVER_URL from "../../config/serverUrl";
import Link from "next/link";
import Loading from "../loading";

function ExamList() {
  const [exams, setExams] = useState([]);
  const [registeredExams, setRegisteredExams] = useState([]);
  const [loading, setLoading] = useState(true);
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
          setLoading(false);
        }
      });
  }, []);

  return (
    <div className="w-full flex flex-col gap-3 h-fit ">
      <div className="w-full hidden md:flex  text-black justify-around font-extrabold items-center rounded-lg  bg-[#259ac4] h-12">
        <div className="w-14 flex justify-center items-center">
          <h1 className="text-lg">No</h1>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <h1 className="text-lg">Exam Date</h1>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <h1 className="text-lg">Status</h1>
        </div>
      </div>
      {exams?.map((exam, i) => (
        <Link
          href={`${registeredExams?.includes(exam._id) ? "/jee/waiting/" + exam._id : "/jee/register/" + exam._id}`}
          className={`w-full md:flex cursor-pointer group bg-secondary  border-primary hover:border-[#5cbc20] duration-300 justify-around  items-center rounded-lg border md:h-12 `}
        >
          <div
            className={`md:w-14 w-full duration-300  group-hover:bg-[#5cbc20] bg-[#259ac4]  text-black text-lg font-bold flex items-center justify-center h-full text-center rounded-t-lg md:rounded-tr-none md:rounded-l-lg`}
          >
            {i + 1}
          </div>
          <div className="w-full flex py-3">
            <div className="md:w-1/2 w-full flex justify-center font-semibold items-center">
              <h1 className="md:text-lg text-center">
                {exam.date?.replace("T", "  ")}
              </h1>
            </div>
            <div className="md:w-1/2 w-full flex justify-center font-semibold items-center">
              <h1 className="md:text-lg text-center">
                upcoming{registeredExams?.includes(exam._id) && " (registered)"}
              </h1>
            </div>
          </div>
        </Link>
      ))}
      <div className="w-full">
        {exams?.length === 0 && (
          <div className="text-primary flex justify-center text-center mt-10 font-bold text-3xl">
            {loading ? <Loading /> : "No Exams Found!"}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamList;
