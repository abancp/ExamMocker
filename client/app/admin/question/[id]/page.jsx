'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import SERVER_URL from '../../../../config/serverUrl'
import { useParams } from 'next/navigation'

function page() {
  const { id } = useParams()
  const [question, setQuestion] = useState({})
  useEffect(() => {
    axios.get(`${SERVER_URL}/admin/question/${id}`,{withCredentials:true}).then(({ data }) => {
      setQuestion(data.question)
      console.log(data.question)
    })
  }, [])
  return (
    <div className='w-full gap-2 flex px-2 flex-col  min-h-screen max-h-fit'>
      <div className='w-full py-2 pb-0'>
        <div className='border border-primary bg-[#0e0e1f] text-[#ffffff] flex flex-col gap-4  font-light w-full p-2 py-3 '>
          <h1 className=' text-center w-full text-xl font-semibold'>Question</h1>
          <div className='flex gap-3'><div className='text-lg font-medium'>Q:</div><div className='font-light'>{question?.question}</div></div>
          {question?.options?.map((option, i) => (
          <div className=' flex gap-3 w-full text-[#ffffff]'><div className='h-full text-lg font-semibold'>{i == 0 ? "A" : i == 1 ? "B" : i == 2 ? "C" : i == 3 && "D"}:</div><h1 className='font-light'>{option}</h1></div>
        ))}
        </div>
      </div>
      {/* <div className='w-full   py-3 flex flex-col gap-3 font-light'> */}
        
      {/* </div> */}
    </div>
  )
}

export default page
