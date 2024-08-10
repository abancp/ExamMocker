'use client'
import { MathJax, MathJaxContext } from "better-react-mathjax";
import QuestionIcon from "../../../../components/Jee/QuestionIcon"
import { useState } from "react";
import { useParams } from "next/navigation";

const JeeExam = () => {

  const {examId} = useParams()
  const [subject,setSubject] = useState("mathematics")
  const [questionIndexesMap,setQuestionIndexesMap] = useState({notVisited:89,notAnswered:1,answered:0,MForReview:0,MForReviewAndA:0})
  const [questionIndexes] = useState([
    2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1
  ])
  const exam = JSON.parse(window.localStorage.getItem("exam-"+examId))
  console.log(exam);
  
  const [questions,setQuestions] = useState(exam?.questions)
  const [currentQuestion,setCurrentQuestion] = useState(questions[subject][0])


  const changeSubject = (e)=>{
    setSubject(e.target.id)
    console.log(e.target.id);
    setCurrentQuestion(questions[e.target.id][0])
  }

  const changeQuestionNumber = (questionIndex)=>{
    setCurrentQuestion(questions[subject][questionIndex])
  }

  return (
    <MathJaxContext>
      <div className='max-h-max min-h-screen w-full bg-white text-black'>
        <div className=" text-blue-700 font-bold justify-between px-3 pb-1 items-center flex  h-16">
          <h1 className="text-3xl">ExamMocker</h1>
          <div>
            <h1>Candidate Name : Aban Muhammed C P</h1>
            <h4 className="flex items-center">Remaining Time : <div className="text-white bg-blue-600 ml-1 font-[400] text-sm flex items-center h-[18px] px-2 rounded-full ">12:23:20</div></h4>
          </div>
        </div>
        <div className="bg-orange-500 text-white w-full h-20 flex px-4">
          <div className="flex gap-3 ml-4  items-center">
            <h1 className="font-bold text-2xl"> JEE MAIN </h1>
            <div id="mathematics" onClick={changeSubject} className={`${subject === "mathematics"?"bg-blue-900 ":"bg-blue-500"} cursor-pointer duration-300 bg-blue-700 p-1 px-2 h-fit`}>Mathematics</div>
            <div id="physics" onClick={changeSubject} className={`${subject === "physics"?"bg-blue-900 ":"bg-blue-500"} cursor-pointer bg-blue-700 duration-300 p-1 px-2 h-fit`}>Physics</div>
            <div id="chemistry" onClick={changeSubject} className={`${subject === "chemistry"?"bg-blue-900":"bg-blue-500"} cursor-pointer bg-blue-700 duration-300 p-1 px-2 h-fit`}>Chemistry</div>
          </div>
        </div>
        <div className="px-10 flex gap-3">
          <div className="w-[70%]">
            <div className="flex px-3 py-1 mt-2 justify-between border-b-[1px] border-black items-center">
              <h1 className="text-lg font-semibold">Question 1:</h1>
              <div className="p-2 py-1 text-white rounded-full bg-blue-700"><h1 className="text-2xl  font-bold">↓</h1></div>
            </div>
            <div className="h-[23rem] border-b border-black overflow-y-scroll">
              <h1 className="p-3 text-xl font-sans font-semibold"><MathJax>{currentQuestion.question}</MathJax></h1>
              <div className="flex flex-col gap-3 p-3 ">
                <label htmlFor="mcq_option_1" className="w-fit cursor-pointer flex gap-3"><input className="cursor-pointer" type="radio" name="mcq_option" id="mcq_option_1" /><MathJax><h1 className="text-xl font-medium"> (1) <span className="ml-5">{currentQuestion.options[0]}</span></h1></MathJax></label>
                <label htmlFor="mcq_option_2" className="w-fit cursor-pointer flex gap-3"><input className="cursor-pointer" type="radio" name="mcq_option" id="mcq_option_2" /><MathJax><h1 className="text-xl font-medium"> (2) <span className="ml-5">{currentQuestion.options[1]}</span></h1></MathJax></label>
                <label htmlFor="mcq_option_3" className="w-fit cursor-pointer flex gap-3"><input className="cursor-pointer" type="radio" name="mcq_option" id="mcq_option_3" /><MathJax><h1 className="text-xl font-medium"> (3) <span className="ml-5">{currentQuestion.options[2]}</span></h1></MathJax></label>
                <label htmlFor="mcq_option_4" className="w-fit cursor-pointer flex gap-3"><input className="cursor-pointer" type="radio" name="mcq_option" id="mcq_option_4" /><MathJax><h1 className="text-xl font-medium"> (4) <span className="ml-5">{currentQuestion.options[3]}</span></h1></MathJax></label>
              </div>
            </div>

            <div className="flex mt-5 gap-3">
              <button className="bg-green-600  px-2 py-1 text-lg font-semibold text-white">Save & Next</button>
              <button className="bg-orange-500  px-2 py-1 text-lg font-semibold text-white">Save & Mark For Review</button>
              <button className="border border-black  px-2 py-1 text-lg font-semibold text-black">Clear Response</button>
              <button className="bg-orange-500  px-2 py-1 text-lg font-semibold text-white">Mark For Review & Next</button>
            </div>
            <div className="flex mt-5 p-3 bg-gray-200 justify-between font-semibold">
              <div className="flex gap-2">
                <button className="px-2 py-1 border border-black text-black">BACK</button>
                <button className="px-2 py-1 border border-black text-black">NEXT</button>
              </div>
              <button className="px-2 py-1 bg-green-600 text-white font-semibold">SUBMIT</button>
            </div>
          </div>

          <div className='w-[30%] h-[8rem] pt-5 '>
            <div className='grid gap-2 grid-cols-2 w-'>
              <div className='flex gap-1  items-center'> <QuestionIcon type={1} number={questionIndexesMap.notVisited} /> Not Visited</div>
              <div className='flex gap-1  items-center'> <QuestionIcon type={2} number={questionIndexesMap.notAnswered} /> Not Answered</div>
              <div className='flex gap-1  items-center'> <QuestionIcon type={3} number={questionIndexesMap.answered} /> Answered</div>
              <div className='flex gap-1  items-center'> <QuestionIcon type={4} number={questionIndexesMap.MForReview} />  Marked For Review</div>
            </div>
            <div className='flex gap-1 mt-1 items-center'> <QuestionIcon type={5} number={questionIndexesMap.MForReviewAndA} /> Answered &  Marked for Review </div>
            <div className='overflow-y-scroll h-72 mt-10 p-2  w-full grid grid-cols-5'>
              {questionIndexes.map((type, i) => (<div className="cursor-pointer" onClick={()=>changeQuestionNumber(i)} id={String(i)} ><QuestionIcon type={type} number={i + 1} /></div>))}
            </div>
          </div>

        </div>
      </div>
    </MathJaxContext>
  );
};

export default JeeExam;
