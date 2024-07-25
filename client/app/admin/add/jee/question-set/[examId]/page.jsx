'use client'

import { useCallback, useEffect, useState } from 'react'
import Header from '../../../../../../components/Admin/Header'
import axios from 'axios'
import SERVER_URL from '../../../../../../config/serverUrl'
import Link from 'next/link'
import useDebounce from "../../../../../../hooks/useDebounce"
import { MathJax, MathJaxContext } from 'better-react-mathjax'
import { toast } from 'sonner'

function page() {
  //M:Mathematics | P:Physics | C:Chemistry
  const [subject, setSubject] = useState("mathematics")
  //Q:Question  | A:Option A  |  B:Option B   |  C:Option C   |  D:Option D
  const [questionType, setQuestionType] = useState("Q")
  const [questionNumber, setQuestionNumber] = useState(1)
  const [lastIndexes, setLastIndexes] = useState({ mathematics: 1, physics: 1, chemistry: 1 })
  const [lastType, setLastType] = useState({})
  const questionsIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [exam,setExam] = useState({ mathematics: {}, physics: {}, chemistry: {} })
  const [topics, setTopics] = useState({ mathematics: [], physics: [], chemistry: [] })
  const [topic, setTopic] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [saving,setSaving] = useState(false)

  const debounce = useDebounce()

  useEffect(() => {
    axios.get(SERVER_URL + "/admin/topics").then(({ data }) => {
      setTopics(data.topics)
    })
  }, [])

  useEffect(() => {
    axios.get(`${SERVER_URL}/admin/questions?subject=${subject}&topic=${topic}`).then(({ data }) => {
      setQuestions(data.questions)
    })
  }, [topic, subject])

  const changeSubject = (e) => {
    addCurrentQuestionToExam()
    setCurrentQuestion(null)
    lastIndexes[subject] = questionNumber
    setSubject(e.target.id)
    setQuestionNumber(lastIndexes[e.target.id])
    if (exam[e.target.id[lastIndexes[e.target.id]]]) {
      setCurrentQuestion(exam[e.target.id][lastIndexes[e.target.id]])
    }
  }

  const changeQuestionNumber = (e) => {
    addCurrentQuestionToExam()
    setCurrentQuestion(null)
    lastType[questionNumber + subject] = questionType
    setQuestionNumber(Number(e.target.id))
    console.log(exam);
    if (exam[subject][e.target.id]) {
      setCurrentQuestion(exam[subject][e.target.id])
    }
    if (lastType[e.target.id + subject]) {
      setQuestionType(lastType[e.target.id + subject])
    } else {
      setQuestionType("Q")
    }
  }

  const addCurrentQuestionToExam = () => {
    if (currentQuestion) {
      console.log(subject)
      exam[subject][questionNumber] = currentQuestion
      console.log(exam)
    } else {
      console.log("no question for save")
    }
  }

  const save = () => {
    setSaving(true)
     setTimeout(()=>{ axios.post(SERVER_URL+"/admin/exam/save",exam,{withCredentials:true}).then(({data})=>{
      setSaving(false)
      if(data.success){
        console.log("Saved Successfully")
      }else{
        toast.error(data.message || "something went wrong")
      }
    })},1000)
   
  }

  const searchQuestions = async (search, subjectForSearch, topicForSearch) => {
    console.log(`searching for subject : ${subjectForSearch} , topic : ${topicForSearch} , query : ${search}`)
    axios.get(`${SERVER_URL}/admin/questions?subject=${subjectForSearch}&topic=${topicForSearch}&search=${search}`).then(({ data }) => {
      setQuestions(data.questions)
    })
  }

  const debounceGetQuestions = useCallback(debounce(searchQuestions, 200), [])

  return (
    <MathJaxContext>
      <div className='min-h-screen max-h-fit flex flex-col pb-3 gap-2 pt-[2.7rem] px-3 w-full'>
        <Header />
        <div className='w-full  items-center flex justify-around '>
          <div onClick={changeSubject} id='mathematics' className={`${subject === "mathematics" && "border-b text-[#259ac4]"} cursor-pointer hover:bg-[#21213b] border-[#259ac4] pt-2 duration-200 px-3 pb-2`} >Mathematics</div>
          <div onClick={changeSubject} id='physics' className={`${subject === "physics" && "border-b text-[#259ac4]"} cursor-pointer hover:bg-[#21213b] border-[#259ac4] pt-2 duration-200 px-3 pb-2`}>Physics</div>
          <div onClick={changeSubject} id='chemistry' className={`${subject === "chemistry" && "border-b text-[#259ac4]"} cursor-pointer hover:bg-[#21213b] border-[#259ac4] pt-2 duration-200 px-3 pb-2`}>Chemistry</div>
        </div>
        <div className='flex  gap-[.7rem]  w-full justify-center items-center '>
          {
            questionsIndex.map((questionIndex) => (
              <div onClick={changeQuestionNumber} key={questionIndex} id={questionIndex} className={` ${questionNumber === questionIndex && "bg-[#21213b] text-[#259ac4]"} cursor-pointer hover:bg-[#21213b] duration-300  flex justify-center items-center w-9 h-9 border border-[#259ac4]`}>{questionIndex}</div>
            ))
          }
        </div>

        <div className='w-full border border-[#259ac4] p-2 flex justify-around items-center'>

          <div className='flex items-center w-60 border border-[#259ac4]'>
            <input id='search' onChange={(e) => { setSearchQuery(e.target.value); debounceGetQuestions(e.target.value, subject, topic) }} className='px-1 w-full bg-transparent text-white font-light text-lg focus:outline-none' placeholder='search here' type="text" />
            <div onClick={() => { searchQuestions(searchQuery, subject, topic) }} className='border-l p-2 border-[#259ac4]'>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi cursor-pointer duration-300 hover:text-[#259ac4] bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
            </div>
          </div>

          <div className='flex w-60 border border-[#259ac4]'>
            <select onChange={(e) => { setTopic(e.target.value) }} className='px-1  p-[.35rem] flex items-center justify-center w-60 text-lg  bg-transparent text-white font-light focus:outline-none'>
              <option value={""} className='text-[#2b2b2b91]'>--select topic--</option>
              {
                topics[subject].map((topic) => (
                  <option className='text-black' value={topic}>{topic}</option>
                ))
              }
            </select>
          </div>

          <button onClick={()=>(save())} className={`${saving && 'opacity-70'} py-[.279rem] px-2 border border-[#259ac4] font-bold text-lg bg-[#259ac4]`}>Save</button>

        </div>

        <div className='border p-2 border-[#259ac4] flex flex-col gap-2 h-full w-full'>
          <div className='border border-[#40c425] flex justify-center items-center border-dashed min-h-20 max-h-fit px-3 w-full'>
            {currentQuestion ?
              <div className='w-full py-2 pb-0'>
                <h1 className=' text-center w-full text-xl font-semibold'>Question</h1>
                <div className='flex gap-3'><div className='text-lg font-medium'>Q:</div><div className='font-light'><MathJax>{currentQuestion?.question}</MathJax></div></div>
                {currentQuestion?.options?.map((option, i) => (
                  <div className=' flex gap-3 w-full text-[#ffffff]'><div className='h-full text-lg font-semibold'>{i == 0 ? "A" : i == 1 ? "B" : i == 2 ? "C" : i == 3 && "D"}:</div><h1 className='font-light'><MathJax>{option}</MathJax></h1></div>
                ))}
              </div> :
              <h1 className="text-3xl font-semibold text-[#259ac481]">Question Is Here</h1>}
          </div>
          { 
            questions?.map((question) => (
              <div href={'/admin/question/' + question._id} className='border-[#259ac4] w-full flex justify-between  p-2 border'>
                <div onClick={() => { setCurrentQuestion(question) }} className="whitespace-nowrap overflow-hidden w-full text-ellipsis"><MathJax>{question.question}</MathJax></div>
                <div className=' flex items-center'><Link href={'/admin/question/' + question._id} className='  px-1 py-[.10rem] bg-[#35353f58] '>Open</Link></div>
              </div>
            ))
          }
        </div>
      </div>
    </MathJaxContext>

  )
}

export default page
