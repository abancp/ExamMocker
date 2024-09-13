"use client";

import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SERVER_URL from "../../config/serverUrl";
import axios from "axios";
function Exams() {
  const [exams, setExams] = useState({
    upcoming: [
      { exam: "jee", date: "swrT" },
      { exam: "jee", date: "swrT" },
      { exam: "jee", date: "swrT" },
    ],
    registered: [],
    attended: [],
  });
  const [type, setType] = useState("upcoming");
  useEffect(() => {
    axios
      .get(SERVER_URL + "/exams", { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          setExams(data.exams);
        }
      });
  });

  return (
    <div className="w-full h-fit min-h-screen text-primary">
      <Header />
      <div className=" w-full top-20 fixed flex z-[-1] justify-center items-center">
        <div className="w-fit flex backdrop-blur justify-center rounded-full border border-primary items-center gap-2">
          <div className="border-r cursor-pointer rounded-full p-2 border-primary hover:bg-[#335f805f]">
            Upcoming
          </div>
          <div className="border-x cursor-pointer rounded-full p-2 border-primary hover:bg-[#335f805f]">
            Registered
          </div>
          <div className="border-l rounded-full cursor-pointer p-2 border-primary hover:bg-[#335f805f]">
            Attended
          </div>
        </div>
      </div>
      <div className="mt-48 flex flex-col justify-center items-center gap-4  w-full px-16">
        {exams[type]?.map(() => (
          <div className="p-3 border border-primary bg-secondary w-full rounded-lg  h-11 "></div>
        ))}
      </div>
    </div>
  );
}

export default Exams;
