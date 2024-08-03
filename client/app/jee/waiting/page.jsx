"use client"
import React, { useEffect, useState } from 'react'

function page() {
    const [time, setTime] = useState({ seconds: 59, minutes: 59, hours: 1, days: 1 })
    useEffect(() => {
        if (time.seconds === 0) {
            if (time.minutes === 0) {
                if (time.hours === 0) {
                    if (time.days === 0) {
                        console.log("Exam starting!")
                    }
                }else{
                setTime((prev) => ({ ...prev, hours: prev.hours - 1,minutes:60,seconds:60 }))
                }
            }else{
                setTime((prev) => ({ ...prev, minutes: prev.minutes - 1,seconds:60 }))
            }
        }
        let c = setInterval(() => {
            setTime((prev) => ({ ...prev, seconds: prev.seconds - 1 }))
        }, 1000)
        return () => clearInterval(c)
    }, [time])
    return (
        <div className='w-full h-screen flex flex-col items-center gap-3 justify-center'>
            <h1 className='font-medium text-6xl text-[#259ac4]'>{time.days} Days {time.hours} Hours {time.minutes === 60 ? "00" : time.minutes} Mints {time.seconds === 60 ?"00":time.seconds} Seconds</h1>
            <p className='text-2xl text-[#259ac4]'>left for your exam </p>
        </div>
    )
}

export default page
