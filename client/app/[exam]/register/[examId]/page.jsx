"use client"
import { useEffect, useState } from "react"
import Header from "../../../../components/Header"
import clientUrl from "../../../../config/clientUrl"
import axios from "axios"
import SERVER_URL from "../../../../config/serverUrl"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

function JeeRegister() {

    const { examId } = useParams()

    const [username, setUserName] = useState(null)
    const [email, setEmail] = useState(null)
    const [exam, setExam] = useState(null)
    const [localDateTime, setLocalDateTime] = useState("")

    const router = useRouter()

    useEffect(() => {
        axios.get(SERVER_URL + "/validate-token", { withCredentials: true }).then(({ data }) => {
            setUserName(data.claims.username)
            setEmail(data.claims.email)
        })

    }, [])

    useEffect(() => {
        axios.get(SERVER_URL + "/exam-minimal/" + examId, { withCredentials: true }).then(({ data }) => {
            if (data.success) {
                setExam(data.exam)
                const dateObj = new Date(data.exam?.date)
                const date = dateObj.toLocaleDateString()
                const time = dateObj.toLocaleTimeString()
                setLocalDateTime(date + " " + time)
            }
        })
    }, [])


    const registerExam = (examId, userEmail) => {
        axios.post(SERVER_URL + "/register-exam/jee/" + examId, { email: userEmail }, { withCredentials: true }).then(({ data }) => {
            if (data.success) {
                toast.success("Registered , Don't forgot to attend exam on " + localDateTime + " !")
                router.push("/jee/waiting/" + examId)
            } else {
                toast.success(data.error || "something went wrong!")
            }
        }).catch((data) => {
            toast.error(data.response.data.error || "something went wrong!")
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        registerExam(examId, email)
    }

    // const register =  (e) => {
    //     e.preventDefault()
    //     window.open(
    //         clientUrl+"/jee/exam/login",
    //         '_blank',
    //         'noopener,noreferrer,fullscreen=yes,scrollbars=yes'
    //     );
    // }

    return (
        <div>
            <Header />
            <div className="mt-32 flex flex-col justify-center items-center">
                <h1 className="font-extralight text-4xl">Jee Main Mock Test - {localDateTime}  </h1>
                <div>
                    <form onSubmit={handleSubmit} action="" className="flex flex-col gap-2">
                        <div className="mt-24 flex  items-center justify-end">
                            <h4 className="text-lg">Name : </h4>
                            <input disabled value={username} className="bg-transparent  p-1 rounded-lg text-lg border border-[#0e2731] focus:outline-none" type="text" />
                        </div>
                        <div className="mt-2 flex  items-center justify-end">
                            <h4 className="text-lg">Email : </h4>
                            <input disabled value={email} className="bg-transparent  p-1 rounded-lg text-lg border border-[#0e2731] focus:outline-none" type="text" />
                        </div>
                        <div className="mt-2 flex  items-center  justify-end">
                            <h4 className="text-lg">Password : </h4>
                            <input autoFocus className="bg-transparent  p-1 rounded-lg text-lg border border-[#0e2731] focus:outline-none" type="password" />
                        </div>
                        <input value="Continue With Payment 0$" className=" p-1 rounded-lg text-black text-lg border border-[#1c6886]  focus:outline-none outline-none   bg-[#259ac4] hover:bg-[#65c3e5] duration-300 cursor-pointer" type="submit" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default JeeRegister
