"use client"
import React from 'react'
import axios from 'axios'
import SERVER_URL from '../../config/serverUrl'

function ExamList() {
    const [exams, setExams] = useSate([])
    useEffect(()=>{
        axios.get(SERVER_URL+"/ready-exams").then(({data})=>{
            // setExams(data.)
        })
    },[])
    return (
        <div className='w-full h-fit '>
            <div></div>
        </div>
    )
}

export default ExamList
