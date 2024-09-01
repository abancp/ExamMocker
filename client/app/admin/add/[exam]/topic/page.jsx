'use client'
import axios from 'axios'
import React from 'react'
import SERVER_URL from '../../../../../config/serverUrl'
import { toast } from 'sonner'

function page() {

    const handleSubmit = (e)=>{
        e.preventDefault()
        addTopic(e.target[0].value,e.target[1].value)
    }

    const addTopic = (subject,topic)=>{
        axios.post(SERVER_URL+"/admin/topic",{subject,topic},{withCredentials:true}).then(({data})=>{
            if (data.success){
                toast.success("Topic added successfully")
            }else{
                toast.error(data.error || "something went wrong")
            }
        })
    }

    return (
        <div className='text-black min-h-screen max-h-fit w-full'>
            <form onSubmit={handleSubmit} action="">
                <select name="subject" id="subject">
                    <option value="mathematics">mathematics</option>
                    <option value="physics">physics</option>
                    <option value="chemistry">chemistry</option>
                </select>
                <input type="text" />
                <input type="submit" />
            </form>
        </div>
    )
}

export default page
