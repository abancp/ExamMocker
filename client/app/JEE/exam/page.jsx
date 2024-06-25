import NotAnswered from '../../../components/NotAnswered'

const JeeExam = () => {

  return (
    <div className='h-screen  w-full bg-white text-black'>
      <div className=" text-blue-700 font-bold justify-between px-3 pb-1 items-center flex  h-16">
        <h1 className="text-3xl">ExamMocker</h1>
        <div>
          <h1>Candidate Name : Aban Muhammed C P</h1>
          <h4 className="flex items-center">Remaining Time : <div className="text-white bg-blue-600 ml-1 font-[400] text-sm flex items-center h-[18px] px-2 rounded-full ">12:23:20</div></h4>
        </div>
      </div>
      <div className="bg-orange-500 text-white w-full h-20 flex px-4">
        <div className="flex gap-3 ml-4  items-center">
          <h1 className="font-bold text-2xl"> JEE MAIN </h1>
          <div className="bg-blue-700 p-1 px-2 h-fit">Physics</div>
          <div className="bg-blue-700 p-1 px-2 h-fit">Chemistry</div>
          <div className="bg-blue-700 p-1 px-2 h-fit">Mathematics</div>
        </div>
      </div>
      <div className="px-10 flex gap-3">
        <div className="w-[70%]">
          <div className="flex px-3 py-1 mt-2 justify-between border-b-[1px] border-black items-center">
            <h1 className="text-lg font-semibold">Question 1:</h1>
            <div className="p-2 py-1 text-white rounded-full bg-blue-700"><h1 className="text-2xl  font-bold">↓</h1></div>
          </div>
          <div className="h-[23rem] border-b border-black overflow-y-scroll">
            <h1 className="p-3 text-xl font-sans font-semibold">How many trinagles in the latest model of trigmoetryc ration of pythagorous in the mirror of like as a mirror in the hollowgram with my predictions that avoid How many trinagles in the latest model of trigmoetryc ration of pythagorous in the mirror of like as a mirror in the hollowgram with my predictions that avoid How many trinagles in the latest model of trigmoetryc ration of pythagorous in the mirror of like as a mirror in the hollowgram with my predictions that avoid </h1>
            <div className="flex flex-col gap-3 p-3 ">
              <label htmlFor="mcq_option_1" className="flex gap-3"><input className="cursor-pointer" type="radio" name="mcq_option" id="mcq_option_1" /><h1 className="text-xl font-semibold"> (1) <span className="ml-5">3</span></h1></label>
              <label htmlFor="mcq_option_2" className="flex gap-3"><input className="cursor-pointer" type="radio" name="mcq_option" id="mcq_option_2" /><h1 className="text-xl font-semibold"> (2) <span className="ml-5">1</span></h1></label>
              <label htmlFor="mcq_option_3" className="flex gap-3"><input className="cursor-pointer" type="radio" name="mcq_option" id="mcq_option_3" /><h1 className="text-xl font-semibold"> (3) <span className="ml-5">2</span></h1></label>
              <label htmlFor="mcq_option_4" className="flex gap-3"><input className="cursor-pointer" type="radio" name="mcq_option" id="mcq_option_4" /><h1 className="text-xl font-semibold"> (4) <span className="ml-5">6</span></h1></label>
            </div>
          </div>
          
          <div className="flex mt-5 gap-3">
            <button className="bg-green-600  px-2 py-1 text-lg font-semibold text-white">Save & Next</button>
            <button className="bg-orange-500  px-2 py-1 text-lg font-semibold text-white">Save & Mark For Review</button>
            <button className="border border-black  px-2 py-1 text-lg font-semibold text-black">Clear Response</button>
            <button className="bg-orange-500  px-2 py-1 text-lg font-semibold text-white">Mark For Review & Next</button>
          </div>
          <div className="flex mt-5 p-3 bg-gray-200 justify-between font-semibold">
            <div className="flex gap-2">
              <button className="px-2 py-1 border border-black text-black">BACK</button>
              <button className="px-2 py-1 border border-black text-black">NEXT</button>
            </div>
            <button className="px-2 py-1 bg-green-600 text-white font-semibold">SUBMIT</button>
          </div>
        </div>
        <div>
          {/* <NotAnswered/> */}
        </div>
      </div>
    </div>
  );
};

export default JeeExam;
