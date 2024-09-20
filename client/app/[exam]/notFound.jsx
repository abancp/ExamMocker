"use client"
import React from "react";
import Header from "../../components/Header";
import Link from "next/link"

function NotFound({progress}) {
  return (
    <div className="w-full ">
      <Header />
      <div className="w-full flex-col h-screen flex gap-4 justify-center items-center ">
        <h1 className="font-extrabold text-center text-4xl text-primary">
          {progress?"Exam Work in Progress!":"Exam Not Found!"}
        </h1>
        <Link href={"/"} className="text-black flex bg-primary rounded-md gap-3 justify-center items-center py-2 px-3 duration-300 text-lg font-semibold">
          Go to Home Page{" "}
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className=" flex justify-center items-center h-9 w-9 bi bi-arrow-bar-right"
              viewBox="0 0 17 17"
            >
              <path
                fill-rule="evenodd"
                d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5"
              />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
