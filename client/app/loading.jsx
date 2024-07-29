function Loading(){
    return(
        <div className="bg-black h-screen w-full flex flex-col justify-center items-center">
            {/* <h2 className="text-2xl loading-heading ">ExamMocker</h2> */}
            <div className="bg-[rgb(40,40,40)] w-44 h-[7px] rounded-md">
                <div className="bg-[#1477c2] duration-300 h-[7px] rounded-md animate-loading"></div>
            </div>
        </div>
    )
}
export default Loading