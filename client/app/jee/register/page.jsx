"use client"
import Header from "../../../components/Header"
import clientUrl from "../../../config/clientUrl"

function JeeRegister() {

    const register =  (e) => {
        e.preventDefault()
        window.open(
            clientUrl+"/jee/exam/login",
            '_blank',
            'noopener,noreferrer,fullscreen=yes,scrollbars=yes'
        );
    }

    return (
        <div>
            <Header />
            <div className="mt-32 flex flex-col justify-center items-center">
                <h1 className="font-extralight text-3xl">Jee Main Mock Test Registration</h1>
                <div>
                    <form onSubmit={register} action="" className="flex flex-col gap-2">
                        <div className="mt-24 flex  items-center justify-end">
                            <h4 className="text-lg">Name : </h4>
                            <input disabled placeholder={'Aban Muhammed C P'} className="bg-transparent  p-1 rounded-lg text-lg border border-[#0e2731] focus:outline-none" type="text" />
                        </div>
                        <div className="mt-2 flex  items-center  justify-end">
                            <h4 className="text-lg">Date Of Birth : </h4>
                            <input disabled placeholder={'1/01/2001'} className="bg-transparent  p-1 rounded-lg text-lg border border-[#0e2731] focus:outline-none" type="text" />
                        </div>
                        <div className="mt-2 flex  items-center justify-end">
                            <h4 className="text-lg">Email : </h4>
                            <input disabled placeholder={'kop@kop.kop'} className="bg-transparent  p-1 rounded-lg text-lg border border-[#0e2731] focus:outline-none" type="text" />
                        </div>
                        <div className="mt-2 flex  items-center  justify-end">
                            <h4 className="text-lg">Password : </h4>
                            <input className="bg-transparent  p-1 rounded-lg text-lg border border-[#0e2731] focus:outline-none" type="password" />
                        </div>
                        <div></div>
                        <input value="Continue With Payment 0$" className=" p-1 rounded-lg text-black text-lg border border-[#1c6886]  focus:outline-none outline-none  hover:bg-[#427ca9c0] duration-300 cursor-pointer bg-[rgb(37,154,196)]" type="submit" />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default JeeRegister