'use client'
import React,{useState} from 'react'
import Header from '../../../../../components/Admin/Header'
import Input from '../../../../../components/Admin/Input';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import SERVER_URL from "../../../../../config/serverUrl"
import { toast } from 'sonner';


function page() {

  const router = useRouter()

  const submitHandler = async (e) => {
    e.preventDefault()
    console.log({ exam: e.target[0].value, date: e.target[1].value});
    const { data } = await axios.post(SERVER_URL + '/admin/exam', { exam: e.target[0].value, date: e.target[1].value},{withCredentials:true})
    if(data.success){
      router.push("/admin/add/jee/question-set/"+data.id)
    }else{
      toast.error(data.message || "something went wrong!")
    }
  }


  return (
    <div className='w-full flex flex-col pt-16 items-center justify-center h-screen '>
      <Header />
      <h1 className="text-2xl font-light">Add Jee Mock Test Here</h1>
      <form className='flex mt-7 flex-col gap-2 justify-center' onSubmit={submitHandler}>
        <label> <span className='inline-block text-left w-28'>Exam</span><Input type="text" value="JEE" disabled /> </label>
        <label> <span className='inline-block text-left w-28'>Date & Time</span><Input type="datetime-local" /></label>
        
        <input type="submit" value="Add Questions" className='border p-1 border-primary rounded-md bg-[#21213b] duration-300 cursor-pointer hover:bg-[#323262]' />
      </form>
    </div>
  )
}

export default page