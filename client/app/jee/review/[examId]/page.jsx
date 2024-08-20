"use client"
import { useRouter } from "next/navigation";
import React from "react";

function page() {
  const router = useRouter()
  const handleClick = ()=>{
    router.push("/")
  }

  return (
    <div className="w-full h-screen bg-[#ffffff] flex justify-center items-center">
      <div className="rounded-md bg-gray-300 w-[50rem] p-10 h-[15rem] gap-2 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-semibold text-blue-700">ExamMocker Mock Test</h1>
        <table className="text-lg w-full text-black">
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
