'use client'

import React, { useState } from 'react'
import Header from "../../../../../components/Admin/Header"
import axios from 'axios'
import SERVER_URL from "../../../../../config/serverUrl"

function page() {
    const [optionPointing, setOptionPointing] = useState("Q")
    const [question] = useState({ type: "MCQ", question: "", options: ["", "", "", ""], answer: "" })
    const [currentTextAreaValue, setCurrentTextAreaValue] = useState(question.question)
    const [questionType, setQuestionType] = useState("MCQ")
    const changeQuestionType = (e) => {
        const textArea = window.document.getElementById("text-area")
        switch (optionPointing) {
            case "Q": {
                question.question = textArea.value
                setCurrentTextAreaValue("")
                break
            }
            case "A": {
                question.options[0] = textArea.value
                setCurrentTextAreaValue("")
                break
            }
            case "B": {
                question.options[1] = textArea.value
                setCurrentTextAreaValue("")
                break
            }
            case "C": {
                question.options[2] = textArea.value
                setCurrentTextAreaValue("")
                break
            }
            case "D": {
                question.options[3] = textArea.value
                setCurrentTextAreaValue("")
                break
            }
            case "AN": {
                question.answer = textArea.value
                setCurrentTextAreaValue("")
                break
            }
            default: {
                throw new Error("Invalid question type" + e.target.value)
            }
        }
        setOptionPointing(e.target.id)
        switch (e.target.id) {
            case "Q": {
                setCurrentTextAreaValue(question.question)
                break
            }
            case "A": {
                setCurrentTextAreaValue(question.options[0])
                break
            }
            case "B": {
                setCurrentTextAreaValue(question.options[1])
                break
            }
            case "C": {
                setCurrentTextAreaValue(question.options[2])
                break
            }
            case "D": {
                setCurrentTextAreaValue(question.options[3])
                break
            }
            case "AN": {
                setCurrentTextAreaValue(question.answer)
                break
            }
            default: {
                throw new Error("Invalid question type:" + e.target.id)
            }
        }
        textArea.focus()
    }

    const changeTextValue = (e) => {
        switch (optionPointing) {
            case "Q": {
                setCurrentTextAreaValue(e.target.value)
                question.question = e.target.value
                break
            }
            case "A": {
                setCurrentTextAreaValue(e.target.value)
                question.options[0] = e.target.value
                break
            }
            case "B": {
                setCurrentTextAreaValue(e.target.value)
                question.options[1] = e.target.value
                break
            }
            case "C": {
                setCurrentTextAreaValue(e.target.value)
                question.options[2] = e.target.value
                break
            }
            case "D": {
                setCurrentTextAreaValue(e.target.value)
                question.options[3] = e.target.value
                break
            }
            case "AN": {
                setCurrentTextAreaValue(e.target.value)
                question.answer = e.target.value
                break
            }
        }
    }

    const saveQuestion = async () => {
        console.log(question)
        if (questionType === "MCQ") {
            const result = await axios.post(SERVER_URL + "/admin/add-question", question)
            console.log(result)
        } else {
            const { options, ...filteredQuestion } = question
            const result = await axios.post(SERVER_URL + "/admin/add-question", filteredQuestion)
            console.log(result)
        }
    }


    return (
        <div className='w-full flex flex-col pt-14 p-4 gap-2 h-screen'>
            <Header />
            <div className="flex  justify-around w-full items-center">
                <div className=' px-2 py-[1px] rounded-md  bg-[#21213b]'>
                    <div className='flex gap-2 text-lg '>
                        <span>Question type : </span>
                        <input value="MCQ" type="radio" defaultChecked name='questionType' onClick={() => { setQuestionType("MCQ"); setOptionPointing("Q"); question.type == "MCQ" }} id='questionType' />
                        <label className='cursor-pointer' htmlFor="questionType">MCQ</label>
                        <input onClick={() => { setQuestionType("Numerical"); setOptionPointing("Q"); question.type = "Numerical" }} value="Numerical" type="radio" name='questionType' id='numeric' />
                        <label className='cursor-pointer' htmlFor="numeric">Numerical</label>
                    </div>
                    {/* <div className='flex gap-1 text-sm '><span>Answer : </span><input type="radio" name='answer' id='a' /><label htmlFor="a">A</label><input type="radio" name='answer' id='b' /><label htmlFor="b">B</label><input type="radio" name='answer' id='c' /><label htmlFor="c">C</label><input type="radio" name='answer' id='d' /><label htmlFor="d">D</label></div> */}
                </div>
                <div id="Q" onClick={changeQuestionType} className={`${optionPointing === "Q" && "border-b text-[#259ac4]"} px-2 py-1 border-[#259ac4] hover:bg-[#21213b] cursor-pointer`}>Question</div>
                {questionType === "MCQ" && <div id="A" onClick={changeQuestionType} className={`${optionPointing === "A" && "border-b text-[#259ac4]"} px-2 py-1 border-[#259ac4] hover:bg-[#21213b] cursor-pointer`}>Option A <input className='p-1 cursor-pointer' onClick={(e) => { e.stopPropagation();question.answer="A" }} type="radio" name='answer' /></div>}
                {questionType === "MCQ" && <div id="B" onClick={changeQuestionType} className={`${optionPointing === "B" && "border-b text-[#259ac4]"} px-2 py-1 border-[#259ac4] hover:bg-[#21213b] cursor-pointer`}>Option B <input className='p-1 cursor-pointer' onClick={(e) => { e.stopPropagation();question.answer="B" }} type="radio" name='answer' /></div>}
                {questionType === "MCQ" && <div id="C" onClick={changeQuestionType} className={`${optionPointing === "C" && "border-b text-[#259ac4]"} px-2 py-1 border-[#259ac4] hover:bg-[#21213b] cursor-pointer`}>Option C <input className='p-1 cursor-pointer' onClick={(e) => { e.stopPropagation();question.answer="C" }} type="radio" name='answer' /></div>}
                {questionType === "MCQ" && <div id="D" onClick={changeQuestionType} className={`${optionPointing === "D" && "border-b text-[#259ac4]"} px-2 py-1 border-[#259ac4] hover:bg-[#21213b] cursor-pointer`}>Option D <input className='p-1 cursor-pointer' onClick={(e) => { e.stopPropagation();question.answer="D" }} type="radio" name='answer' /></div>}
                {questionType === "Numerical" && <div id="AN" onClick={changeQuestionType} className={`${optionPointing === "AN" && "border-b text-[#259ac4]"} px-2 py-1 border-[#259ac4] hover:bg-[#21213b] cursor-pointer`}>Answer</div>}
                <div id="Save" onClick={saveQuestion} className="rounded-md px-2 py-1 bg-[#259ac4] duration-300 text-white font-semibold cursor-pointer">Save</div>
            </div>
            <textarea autoFocus id='text-area' onChange={changeTextValue} className='w-full h-full rounded-md p-2 focus:outline-none  bg-transparent border border-[#259ac4] text-white' value={currentTextAreaValue} ></textarea>
        </div>
    )
}

export default page
