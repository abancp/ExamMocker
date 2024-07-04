"use client"

import { useRouter } from "next/router"

function JeeExamLogin() {

    const router = useRouter()

    const Login = (e) => {
        e.preventDefault()
        document.documentElement.requestFullscreen().catch((err) => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
        router.push("/jee/exam")
    }
    return (
        <div className="h-screen bg-white gap-3 flex flex-col justify-start items-center pt-[10rem] w-full">
            <div className="w-[30rem] h-80 border border-gray-900 rounded-lg">
                <div className="bg-gray-400 flex items-center text-xl justify-center rounded-t-lg w-full h-10 ">
                    LOGIN
                </div>
                <form onSubmit={Login} className="h-full w-full" action="">
                    <div className="w-full h-full gap-3 flex flex-col justify-center items-center">
                        <div className="flex  justify-end">
                            <h4 className="text-lg">Application Email : </h4>
                            <input disabled className="px-1 bg-gray-400 opacity-90 focus:outline-none rounded-md" value={"abancpchengani@gmail.com"} type="text" />
                        </div>
                        <div className="flex  justify-end">
                            <h4 className="text-lg"> Password (DOB) : </h4>
                            <input placeholder="dd/mm/yyyy" className="px-1 bg-gray-400 focus:outline-none rounded-md" type="text" />
                        </div>
                        <input className="bg-blue-500 rounded-md p-2 px-3 cursor-pointer" value={'LOGIN'} type="submit" />
                    </div>
                </form>
            </div>
            <h4>you can login after <span className="text-red-600">15:00</span></h4>
        </div>
    )
}
export default JeeExamLogin;