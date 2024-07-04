'use client'

import axios from "axios"
import Link from "next/link"
import SERVER_URL from "../../config/serverUrl"

function Signup() {
    const handleSubmit = (e) => {
        e.preventDefault()
            const form = e.target
            const user = {
                name : form[0].value,
                email : form[1].value,
                password : form[2].value,
                confirmPassword : form[3].value,
                DOB  : form[4].value,
                state : form[5].value
            }
            axios.post(SERVER_URL+"/login",user).then(({data})=>{
                console.log(data)
            })
            
    }
    return (
        <div className="w-full h-screen flex pl-40 p-10 items-center ">
            <div className="w-[450px] py-3 flex flex-col justify-around items-center h-[560px] border border-[#163744] rounded-lg ">
                <h1 className=" text-3xl font-thin font-sans">ExamMocker Signup</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5" action="">
                    <input placeholder="Name" className="bg-transparent  p-1 rounded-lg text-lg border border-[#0e2731] focus:outline-none" type="text" />
                    <input placeholder="Email" className="bg-transparent p-1 rounded-lg text-lg border border-[#163744] focus:outline-none" type="text" />
                    <input placeholder="Password" className="bg-transparent p-1 rounded-lg text-lg border border-[#163744] focus:outline-none" type="text" />
                    <input placeholder="Confirm Password" className="bg-transparent p-1 rounded-lg text-lg border border-[#163744] focus:outline-none" type="text" />
                    <input placeholder="Date Of Birth" className="bg-transparent p-1 rounded-lg text-lg border border-[#163744] focus:outline-none" type="date" />
                    <input placeholder="State" className="bg-transparent p-1 rounded-lg text-lg border border-[#163744] focus:outline-none" type="text" />
                    <input placeholder="Submit" className=" p-1 rounded-lg text-lg border border-[#163744] focus:outline-none outline-none  hover:bg-[#335f805f] duration-300 cursor-pointer bg-[#234a685f]" type="submit" />
                </form>
                <h5>already have a account <Link className="text-blue-500" href={'/login'}> login here </Link></h5>
            </div>
        </div>
    )
}
export default Signup