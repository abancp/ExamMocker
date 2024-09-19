"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SERVER_URL from "../../config/serverUrl";
import axios from "axios";
import Loading from "../../components/loading"

function Exams() {
  const [loading,setLoading] = useState(true)
  const [exams, setExams] = useState({
    upcoming: [],
    registered: [],
    attended: [],
  });
  const [type, setType] = useState("upcoming");
  useEffect(() => {
    axios
      .get(SERVER_URL + "/ready-exams", { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setExams((prev) => ({ ...prev, upcoming: data.exams }));
        }
      });
    axios
      .get(SERVER_URL + "/time/exam-registered", { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setExams((prev) => ({ ...prev, registered: data.exams }));
        }
      });
    axios
      .get(SERVER_URL + "/time/exam-attended", { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setExams((prev) => ({ ...prev, attended: data.exams }));
          setLoading(false)
        }
      });
  }, []);

  return (
    <div className="w-full h-fit min-h-screen text-primary">
      <Header />
      <div className=" w-full top-20 fixed flex z-[-1] justify-center items-center">
        <div className="w-fit flex backdrop-blur justify-center rounded-full border border-primary items-center gap-2">
          <div
            onClick={() => {
              setType("upcoming");
            }}
            className={`border-r cursor-pointer rounded-full p-2 border-primary ${type == "upcoming" && "bg-[#335f805f]"} hover:bg-[#335f805f]`}
          >
            Upcoming
          </div>
          <div
            onClick={() => {
              setType("registered");
            }}
            className={`border-x cursor-pointer rounded-full p-2 border-primary   ${type == "registered" && "bg-[#335f805f]"}  hover:bg-[#335f805f]`}
          >
            Registered
          </div>
          <div
            onClick={() => {
              setType("attended");
            }}
            className={`border-l rounded-full cursor-pointer p-2 border-primary   ${type == "attended" && "bg-[#335f805f]"}  hover:bg-[#335f805f]`}
          >
            Attended
          </div>
        </div>
      </div>
      <div className="mt-48 flex flex-col justify-center items-center gap-4  w-full px-16">
        <div className="p-3 text-black text-xl font-bold border bg-primary  flex justify-around items-center border-primary  w-full rounded-lg  h-11 ">
          <h1> Exam Name </h1>
          <h1> Exam Date </h1>
        </div>{" "}
        {exams[type]?.map((exam) => (
          <div className="p-3 border flex text-white justify-around font-semibold items-center border-primary bg-secondary w-full rounded-lg  h-11 ">
            <h1>JEE Mains Mock Test</h1>
            <h1> {exam.date.split("T").join(" ")} </h1>
          </div>
        ))}
        <div className="w-full">
          {exams[type]?.length === 0 && (
            <div className="text-primary flex justify-center text-center mt-10 font-bold text-3xl">
              {loading ? <Loading /> : "No Exams Found!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Exams;
