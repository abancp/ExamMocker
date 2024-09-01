"use client";
import Link from "next/link";
import React from "react";
import { useState } from "react";

function AddExam({handleClose}) {
  const [selectedExam, setSelectedExam] = useState();
  const exams = ["jee", "neat"];
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-96 flex flex-col gap-3 p-3 justify-center items-center backdrop-blur-md bg-secondary rounded-lg border border-primary"
    >
      <h1 className="text-lg ">Select Exam</h1>
      {exams.map((exam) => (
        <div
          onClick={()=>setSelectedExam((prev)=>prev!=exam?exam:null)}
          className={`rounded-lg ${selectedExam == exam && "bg-primary"} font-medium uppercase border border-primary text-center w-[70%] cursor-pointer`}
        >
          {exam}
        </div>
      ))}
      <div className="w-[70%] rounded-lg flex justify-between">
        <button onClick={handleClose} className="w-[40%] hover:bg-red-500 duration-300 border border-primary text-center rounded-lg font-semibold">
          CANCEL
        </button>
        <Link href={"/admin/add/"+selectedExam+"/exam"} className={`w-[40%] border border-primary text-center rounded-lg  font-semibold ${ selectedExam ? "bg-primary cursor-pointer": "cursor-not-allowed"}`}>
          PROCEED
        </Link>
      </div>
    </div>
  );
}

export default AddExam;
