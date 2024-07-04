import React from 'react'
import Link from "next/link"
import Header from "../../components/Admin/Header"

function Admin(){
    return(
        <div className="w-full">
            <Header/>
            <main className="w-full h-screen pt-16 p-4 flex">
                <div className="h-20 rounded-md">
                    <div className="bg-[#21213b] font-semibold px-2 flex items-center justify-center h-1/2 w-full rounded-t-md ">Add Exam</div>
                    <Link href={"/admin/add/jee/exam"}><div className="bg-[#0e0e1f] px-2 flex items-center justify-center h-1/2 w-full cursor-pointer hover:opacity-60">JEE</div></Link>
                    <Link href={"/admin/add/jee/exam"}><div className="bg-[#0e0e1f] px-2 flex items-center justify-center h-1/2 w-full cursor-pointer rounded-b-md hover:opacity-60 ">NEAT</div></Link>
                </div>
            </main>
        </div>
    )
}

export default Admin