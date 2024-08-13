"use client"
import React, { useState,useEffect } from 'react'
import axios from 'axios'
import {useParams} from 'next/navigation'
import SERVER_URL from '../../../../config/serverUrl'

function page(){

    const [exam,setExam] = useState({})

    const {id} = useParams()

    useEffect(()=>{
        axios.get(SERVER_URL+"/exam/"+id,{withCredentials:true}).then(({data})=>{
            if(data.success){
                setExam(data.exam)
                console.log(data.exam)
            }
        })
    },[])
    return(
        <div>

        </div>
    )
}

export default page
