"use client";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Admin/Header";
import { useRouter } from "next/navigation";
import axios from "axios";
import SERVER_URL from "../../../config/serverUrl";
import { toast } from "sonner";
import AddExam from "../../../components/popup/AddExam";

function Admin() {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [showAddExamPopup, setShowAddExamPopup] = useState(false);

  const handleClose = () => {
    setShowAddExamPopup(false);
  };

  useEffect(() => {
    axios
      .get(SERVER_URL + "/admin/exams", { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          console.log(data.exams);
          setExams(data.exams);
        }
      });
  }, []);

  const deleteExam = (examId) => {
    axios
      .delete(SERVER_URL + "/admin/exam/" + examId, { withCredentials: true })
      .then(({ data }) => {
        if (data.success) {
          toast.success(data.message);
          setExams((prev) => prev.filter((exam0) => exam0._id !== examId));
        }
      });
  };

  return (
    <div className="w-full">
      {showAddExamPopup && (
        <div
          onClick={() => {
            setShowAddExamPopup(false);
          }}
          className="w-full h-screen fixed flex justify-center items-center"
        >
          <AddExam handleClose={handleClose} />
        </div>
      )}
      <Header />
      <main className="w-full h-screen pt-16 p-4 flex">
        <div className="w-full  bg-[rgba(37,154,196,0.1)] h-fit border rounded-lg border-primary">
          <table className="w-full ">
            <tbody>
              <tr className="border-b h-10 rounded-lg text-[#259ac4] border-primary">
                <th>No</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Exam</th>
                <th>Question Status</th>
                <th>Creator</th>
                <th>Options</th>
              </tr>
              {exams?.map((exam, i) => (
                <tr
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/admin/exam/" + exam._id);
                  }}
                  className="text-center cursor-pointer rounded-xl text-lg px-2 py-4 border-b border-primary "
                >
                  <td className="text-[#259ac4]">{i + 1}</td>
                  <td>{exam.date.replace("T", " ")}</td>
                  <td>
                    {new Date(exam.date).getMilliseconds > Date.now()
                      ? "upcoming"
                      : "ended"}
                  </td>
                  <td>{exam.exam}</td>
                  <td>{((exam.totalQuestions * 100) / 90).toFixed(2)}%</td>
                  <td>Aban Muhammed C P</td>
                  <td className="flex justify-center gap-2 pt-[.35rem]">
                    <svg
                      onClick={(e) => {
                        e.stopPropagation();
                        confirm(
                          "are you sure to delet exam at " +
                          exam.date.replace("T", " "),
                        ) && deleteExam(exam._id);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="text-red-500 hover:opacity-60 duration-300 hover:cursor-pointer bi bi-trash"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                    </svg>
                    <svg
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push("/admin/add/jee/question-set/" + exam._id);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      class="text-yellow-400 hover:opacity-60 duration-300 hover:hover:cursor-pointer bi bi-pencil"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                    </svg>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center">
            <div
              onClick={() => {
                setShowAddExamPopup(true);
              }}
              className="flex items-center cursor-pointer duration-300 hover:text-[#259ac4] gap-2 bg-[#21213b] px-20  m-1 text-center rounded-full "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-plus-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>
              Add Exam
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Admin;
