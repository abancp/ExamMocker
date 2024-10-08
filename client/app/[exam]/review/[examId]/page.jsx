"use client"
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

function page() {
  const {examId} = useParams()
  const router = useRouter()
  const handleClick = ()=>{
    toast.info("You get notified via email when result declared!")
    router.push("/")
  }

  return (
    <div className="w-full h-screen bg-[#ffffff] p-5 flex justify-center items-center">
      <div className="rounded-md bg-gray-300 w-[50rem] p-10 h-fit gap-8 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold text-blue-700">ExamMocker Mock Test</h1>
        <table className="text-lg border-separate space-y-3 w-full text-black">
          <tr><td>No of questions attended </td> <td>76</td> </tr>
          <tr><td>No fo questions attended and Mark For Review </td><td>3</td></tr>
          <tr><td>No of Questions not attended </td> <td>10</td> </tr>
          <tr><td>No of Questions not attended but Marked for Review </td> <td>1</td></tr>
        </table>
        <div className="w-full  flex justify-end"><button className="bg-orange-600 p-2 py-1 rounded-md" onClick={handleClick}>Submit</button></div>
      </div> 
    </div>
  );
}

export default page;
