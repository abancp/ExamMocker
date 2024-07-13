'use client'

import { useEffect, useMemo, useState } from 'react'
import Header from '../../../../../components/Admin/Header'
import axios from 'axios'
import SERVER_URL from '../../../../../config/serverUrl'
import Link from 'next/link'


function page() {
  //M:Mathematics | P:Physics | C:Chemistry
  const [subject, setSubject] = useState("M")
  //Q:Question  | A:Option A  |  B:Option B   |  C:Option C   |  D:Option D
  const [questionType, setQuestionType] = useState("Q")
  const [questionNumber, setQuestionNumber] = useState(1)
  const [lastIndexes, setLastIndexes] = useState({ M: 1, P: 1, C: 1 })
  const [lastType, setLastType] = useState({})
  const questionsIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    axios.get(SERVER_URL + "/admin/questions").then(({ data }) => {
      setQuestions(data.questions)
    })
  }, [])

  const changeSubject = (e) => {
    lastIndexes[subject] = questionNumber
    setSubject(e.target.id)
    setQuestionNumber(lastIndexes[e.target.id])
  }

  const changeQuestionType = (e) => {
    setQuestionType(e.target.id)
  }

  const changeQuestionNumber = (e) => {
    lastType[questionNumber + subject] = questionType
    setQuestionNumber(Number(e.target.id))
    if (lastType[e.target.id + subject]) {
      setQuestionType(lastType[e.target.id + subject])
    } else {
      setQuestionType("Q")
    }
  }

  const setQuestion = () =>{

  }

  return (

    <div className='min-h-screen max-h-fit flex flex-col pb-3 gap-2 pt-[2.7rem] px-3 w-full'>
      <Header />
      <div className='w-full  items-center flex justify-around '>
        <div onClick={changeSubject} id='M' className={`${subject === "M" && "border-b text-[#259ac4]"} cursor-pointer hover:bg-[#21213b] border-[#259ac4] pt-2 duration-300 px-3 pb-2`} >Mathematics</div>
        <div onClick={changeSubject} id='P' className={`${subject === "P" && "border-b text-[#259ac4]"} cursor-pointer hover:bg-[#21213b] border-[#259ac4] pt-2 duration-300 px-3 pb-2`}>Physics</div>
        <div onClick={changeSubject} id='C' className={`${subject === "C" && "border-b text-[#259ac4]"} cursor-pointer hover:bg-[#21213b] border-[#259ac4] pt-2 duration-300 px-3 pb-2`}>Chemistry</div>
      </div>
      <div className='flex  gap-2  w-full justify-center items-center '>
        {
          questionsIndex.map((questionIndex) => (
            <div onClick={changeQuestionNumber} key={questionIndex} id={questionIndex} className={` ${questionNumber === questionIndex && "bg-[#21213b] text-[#259ac4]"} cursor-pointer hover:bg-[#21213b] duration-300  flex justify-center items-center w-9 h-9 border border-[#259ac4]`}>{questionIndex}</div>
          ))
        }
      </div>

      <div className='border p-2 border-[#259ac4] flex flex-col gap-2 h-full w-full'>
        <div className='border border-[#40c425] flex justify-center items-center border-dashed h-20 w-full mb-3'>
          <h1 className="text-3xl font-semibold text-[#259ac481]">Question Is Here</h1>
        </div>
        {
          questions.map((question) => (
            <div href={'/admin/question/' + question._id} className='border-[#259ac4] w-full flex justify-between  p-2 border'>
              <div className="whitespace-nowrap overflow-hidden w-full text-ellipsis">{question.question}</div>
              <div onClick={()=>{setQuestion(question)}} className=' flex items-center '><Link href={'/admin/question/' + question._id} className='  px-1 py-[.10rem] bg-[#35353f58] '>Open</Link></div>
            </div>
          ))
        }
      </div>
    </div>

  )
}

export default page
