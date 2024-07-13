import Link from "next/link"
import Header from "../../components/Header"

function Jee() {
    
    return (
        <div>
            <Header />
            <div className="mt-32 flex flex-col items-center">
                <h1 className="text-5xl font-thin">JEE Mains</h1>
                <Link href={'/jee/register'}><button className="group hover:text-white text-black flex gap-3  items-center mt-7 text-lg font-semibold bg-[rgb(37,154,196)] p-3 px-4 duration-300 rounded-[2rem]">Register Now For Free
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="group-hover:ml-3 group-hover:text-white  duration-300  bi relative  bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                    </svg>
                </button>
                </Link>
            </div>
        </div>
    )
}
export default Jee