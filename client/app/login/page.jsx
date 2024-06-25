import Header from "../../components/Header"
import Link from "next/link"

function Login() {
    return (
        <div className="w-full h-screen flex pl-40 p-10 items-center ">
            <Header/>
            <div className="w-[450px] py-3 flex flex-col justify-around items-center h-[560px] border border-[#2c230f] rounded-lg ">
                <h1 className=" text-3xl font-thin font-sans">ExamMocker Login</h1>
                <form className="flex flex-col gap-5" action="">
                    <input placeholder="Email" className=" p-1 rounded-lg text-lg border border-[#2c230f] focus:outline-none bg-transparent " type="text" />
                    <input placeholder="Password" className=" p-1 rounded-lg text-lg border border-[#2c230f] focus:outline-none bg-transparent" type="password" />
                    <input placeholder="Submit" className=" p-1 rounded-lg text-lg border border-[#2c230f] focus:outline-none outline-none  hover:bg-[#8067335f] duration-300 cursor-pointer bg-[#2c230f5f]" type="submit" />
                </form>
                <h5>not have a account <Link className="text-blue-500" href={'/signup'}> signup here </Link></h5>
            </div>
        </div>
    )
}
export default Login