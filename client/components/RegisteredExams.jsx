"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import SERVER_URL from "../config/serverUrl";

function RegisteredExams() {
  const [registeredExams, setRegisteredExams] = useState([]);
  useEffect(()=>{
    axios.get(SERVER_URL+"/time/exam-registered",{withCredentials:true}).then(({data})=>{
      if(data.success){
        console.log(data)
        setRegisteredExams(data.exams)
      }
    })
  },[])
  return (
    <div className="w-full overflow-x-scroll pl-3 py-3 border-y-2 border-primary-bright flex gap-3 justify-center items-center">
      {registeredExams?.map((exam) => (
        <div className="flex justify-center">
          <Link href={"/jee/waiting/"+exam._id}>
            <div
              className={`cursor-pointer py-3 bg-gradient-to-t from-[#090A0D] duration-700  flex gap-5 flex-col justify-center items-center px-4 to-[#131C23] text-center rounded-lg border-[#0e2731] w-[140px] h-[150px]`}
            >
              <h1 className="font-semibold">JEE Mains</h1>
              <h3 className="font-thin">{exam.date.split('T').join(' ')}</h3>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default RegisteredExams;
