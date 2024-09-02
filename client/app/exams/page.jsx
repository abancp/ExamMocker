import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import SERVER_URL from "../../config/serverUrl";
import axios from "axios";
function Exams() {
  const [exams, setExams] = useState({
    upcoming: [],
    registered: [],
    attended: [],
  });
  const [type,setType] = useState("upcoming")
  useEffect(() => {
    axios.get(SERVER_URL + "/exams", { withCredentials }).then(({ data }) => {
      if (data.success) {
        setExams(data.exams)
      }
    });
  });

  return (
    <div className="w-full h-fit min-h-screen">
      <Header />
      <div className="backdrop-blur w-full top-20 fixed flex justify-center items-center">
        <div className="w-fit flex justify-center rounded-full border border-primary items-center gap-2">
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
      <div className="mt-28 w-full p-3"></div>
      {
        exams[type]?.map(()=>(
          <div></div>
        ))
      }
    </div>
  );
}

export default Exams;
