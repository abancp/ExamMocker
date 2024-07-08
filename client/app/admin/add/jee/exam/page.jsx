'use client'
import React from 'react'
import Header from '../../../../../components/Admin/Header'
import Input from '../../../../../components/Admin/Input';
import { useRouter } from 'next/navigation';

function page() {

  const router = useRouter()
  const submitHandler = (e) => {
    e.preventDefault()
    router.push("/admin/add/jee/question-set")
  }

  return (
    <div className='w-full flex flex-col pt-16 items-center justify-center h-screen '>
      <Header/>
      <h1 className="text-2xl font-light">Add Jee Mock Test Here</h1>
      <form  className='flex mt-7 flex-col gap-2 justify-center' onSubmit={submitHandler}>
        <label> <span className='inline-block text-left w-28'>Exam</span><Input type="text" value="JEE" disabled/> </label>        
        <label> <span className='inline-block text-left w-28'>Date & Time</span><Input type="text"/> </label>        
        <label> <span className='inline-block text-left w-28'>Exam ID</span><Input type="text" disabled value="JEE2024MorningSection"/> </label>  
        <input  type="submit" value="Add Questions" className='border p-1 border-[#259ac4] rounded-md bg-[#21213b] duration-300 cursor-pointer hover:bg-[#323262]' />
      </form>
    </div>
  )
}

export default page