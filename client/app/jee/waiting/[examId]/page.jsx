"use client"
import React, { useEffect, useState } from 'react'
import SERVER_URL from '../../../../config/serverUrl'
import { useParams } from 'next/navigation'
import axios from 'axios'
import clientUrl from '../../../../config/clientUrl'
import { toast } from 'sonner'


function page() {
    const { examId } = useParams()
    const [examTime, setExamTime] = useState()
    const [fog, setFog] = useState(true)
    const [differenceTimeState, setDifferenceTimeState] = useState(1000000)
    const [startExam, setStartExam] = useState(false)
    const [isExamWindowOpen, setIsExamWindowOpen] = useState(false)


    const channel = new BroadcastChannel(examId)
    channel.onmessage = (e) => {
        if (e.data === "Yes, Iam Open :)") {
            setIsExamWindowOpen(true)
        }
    }

    useEffect(() => {
        axios.get(SERVER_URL + "/exam/" + examId, { withCredentials: true }).then(({ data }) => {
            if (data.success) {
                let examDate = new Date(data.exam?.date)
                window.localStorage.setItem("exam-"+examId,JSON.stringify(data.exam))
                setExamTime(examDate.getTime())
            }
        })
        // setIsExamWindowOpen(false)
        channel.postMessage("Are you open :)")

    }, [])

    useEffect(() => {
        let differenceTime = examTime - Date.now()
        if (differenceTime < 60_000) {
            setStartExam(true)
            openWindow()
        }
        //days
        let days = differenceTime / 86400_000
        days = parseInt(days)
        differenceTime -= days * 86400_000
        //hours
        let hours = differenceTime / 3600_000
        hours = parseInt(hours)
        differenceTime -= hours * 3600_000
        //minutes
        let minutes = differenceTime / 60_000
        minutes = parseInt(minutes)
        differenceTime -= minutes * 60_000
        //seconds
        let seconds = differenceTime / 1000
        seconds = parseInt(seconds)
        differenceTime -= seconds * 1000

        setTime({ days, hours, minutes, seconds })
        console.log(days, hours, minutes, seconds)
        setFog(false)
    }, [examTime])



    const [time, setTime] = useState({ seconds: 60, minutes: 60, hours: 20, days: 1000 })


    useEffect(() => {
        setDifferenceTimeState(examTime - Date.now())

        if (time.seconds === 0) {
            if (time.minutes === 0) {
                if (time.hours === 0) {
                    if (time.days === 0) {
                        setTime((prev) => ({ ...prev, days: prev.days - 1, hours: prev.hours - 1, minutes: 60, seconds: 60 }))
                        console.log("Exam starting!")
                        setStartExam(true)
                    }
                } else {
                    setTime((prev) => ({ ...prev, hours: prev.hours - 1, minutes: 60, seconds: 60 }))
                }
            } else {

                setTime((prev) => ({ ...prev, minutes: prev.minutes - 1, seconds: 60 }))
            }
        }
        let c = setInterval(() => {
            setTime((prev) => ({ ...prev, seconds: prev.seconds - 1 }))
        }, 1000)
        return () => clearInterval(c)

    }, [time])


    const handleClick = (e) => {
        e.preventDefault()
        openWindow()
    }

    const openWindow = () => {
        if (isExamWindowOpen) {
            toast.info("Exam Window Already Opened!")
            return
        }
        if (differenceTimeState < -3600_000) {
            toast.info("Your Time is end!")
            return
        }
        if (isExamWindowOpen) {
            toast.info("Exam Window Already Opened!")
            return
        }
        channel.postMessage("Are you open :)")

        setIsExamWindowOpen(true)
        console.log("opening")
        window.open(
            clientUrl + "/jee/exam/" + examId + "/login",
            '_blank',
            'noopener,noreferrer,fullscreen=yes,scrollbars=yes'
        )
    }

    return (
        <div className='w-full h-screen flex flex-col items-center gap-3 justify-center'>
            {fog && <div className='fixed top-0 left-0 w-full h-screen bg-black'></div>}
            {startExam ? <h1 className='font-medium text-6xl text-[#259ac4]'>Exam Started!</h1> : !isNaN(time.days) && <h1 className='font-medium text-6xl text-[#259ac4]'>{time.days} Days {time.hours} Hours {time.minutes} Minutes {time.seconds} Seconds</h1>}
            {startExam || <p className='text-3xl text-[#259ac4] '>left for your exam </p>}
            {differenceTimeState < 900000 && <button className='bg-[#259ac4] p-2 rounded-lg text-lg font-semibold hover:opacity-85 duration-300' onClick={handleClick}>Go To Exam Window</button>}
        </div>
    )
}

export default page
