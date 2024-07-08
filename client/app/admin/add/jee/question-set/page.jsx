'use client'

import { useEffect, useMemo, useState } from 'react'
import Header from '../../../../../components/Admin/Header'

function page() {
  //M:Mathematics | P:Physics | C:Chemistry
  const [subject, setSubject] = useState("M")
  //Q:Question  | A:Option A  |  B:Option B   |  C:Option C   |  D:Option D
  const [questionType,setQuestionType] = useState("Q")
  const [questionNumber, setQuestionNumber] = useState(1)
  const [lastIndexes, setLastIndexes] = useState({ M: 1, P: 1, C: 1 })
  const [lastType,setLastType] = useState({})
  const questionsIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]

  const changeSubject = (e) => {
    lastIndexes[subject] = questionNumber
    setSubject(e.target.id)
    setQuestionNumber(lastIndexes[e.target.id])
  }

  const changeQuestionType = (e) =>{
    setQuestionType(e.target.id)
  }

  const changeQuestionNumber = (e) => { 
    lastType[questionNumber+subject] = questionType
    setQuestionNumber(Number(e.target.id))
    if(lastType[e.target.id+subject]){
      setQuestionType(lastType[e.target.id+subject])
    }else{
      setQuestionType("Q")
    }
  }

  return (

    <div className='h-screen flex flex-col pb-7 gap-2 pt-[2.7rem] px-7 w-full'>
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
      
      <div className='border bg-white border-[#259ac4] h-full w-full'>
        <textarea className='text-xl font-semibold text-black focus:outline-none w-full h-full'  name="" id=""></textarea>
      </div>
    </div>

  )
}

export default page
