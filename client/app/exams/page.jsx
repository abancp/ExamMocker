import React from "react";
import Header from "../../components/Header";
function Exams() {
  return (
    <div className="w-full h-fit min-h-screen">
      <Header />
      <div className="w-full backdrop-blur top-20 fixed border-primary border  flex justify-center items-center">
        <div className="w-fit flex justify-center rounded-full items-center gap-2">
          <div className="border-x rounded-full p-2 border-primary hover:bg-[#335f805f]">
            Upcoming
          </div>
          <div className="border-x rounded-full p-2 border-primary hover:bg-[#335f805f]">
            Registered
          </div>
          <div className="border-x rounded-full p-2 border-primary hover:bg-[#335f805f]">
            Attended
          </div>
        </div>
      </div>
    </div>
  );
}

export default Exams;
