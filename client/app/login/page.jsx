"use client"
import { useState } from "react"
import axios from "axios"
import Header from "../../components/Header"
import Link from "next/link"
import SERVER_URL from "../../config/serverUrl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


function Login() {

    const [errMsg, setErrMsg] = useState(null)

    const router = useRouter()

    const handleSubmit = (e) => {
        e.preventDefault()
        setErrMsg(null)
        const credentials = {
            email: e.target[0].value,
            password: e.target[1].value
        }
        login(credentials)
    }

    const login = (credentials) => {
        axios.post(SERVER_URL + "/login", credentials, { withCredentials: true }).then(({ data }) => {
            if (data.success) {
                console.log("Login Successful")
                toast.success("Login successful!")
                router.push("/")
            } else {
                toast.error(data.error || "something went wrong!")
            }
        }).catch((data) => {
            if (data?.response?.status == 401) {
                setErrMsg(data.response.data.error)
            } else {
                toast.error(data.response.data.error || "something went wrong!")
            }
        })

    }

    return (
        <div className="w-full h-screen justify-center flex pt-40 md:pt-24 p-10 items-center ">
            <Header />
            <div className="w-[450px] md:w-[1000px]  md:flex-row flex-col flex gap-20 py-20 justify-between items-center md:h-[400px] h-[560px] border border-primary rounded-lg ">
                <div className="md:w-1/2 w-full h-1  flex flex-col items-center justify-center">
                    <h1 className=" text-3xl font-bold font-sans">ExamMocker Login</h1>
                </div>

                <form onSubmit={handleSubmit} className="md:w-1/2 w-full px-8 flex flex-col items-center justify-center gap-5" action="">
                    <p className="text-red-600 ">{errMsg}</p>
                    <input placeholder="Email" className=" p-1 rounded-lg text-lg border border-primary focus:outline-none bg-transparent w-full" type="text" />
                    <input placeholder="Password" className=" p-1 rounded-lg text-lg border border-primary focus:outline-none bg-transparent w-full" type="password" />
                    <input value="LOGIN" className="font-bold text-xl p-1 rounded-lg text-black bg-[#259ac4] hover:bg-[#65c3e5] focus:outline-none outline-none w-full  duration-300 cursor-pointer" type="submit" />
                <h5 >not have a account <Link className="text-blue-500" href={'/signup'}> signup here </Link></h5>
                </form>
            </div>
        </div>
    )
}
export default Login
