import React from 'react'

function Header() {
    return (
        <header className="w-full top-0 left-0 fixed flex items-center justify-between px-3 h-11 bg-[#21213b] ">
            <div className="text-2xl font-light">ExamMocker Admin</div>
            <div className="flex gap-2 items-center "><h1 className="font-semibold">Aban Muhammed C P</h1><img className="h-8 w-8 rounded-full" src="/profile.jpg" /></div>
        </header>
    )
}

export default Header