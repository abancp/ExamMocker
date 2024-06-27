import React from 'react'

function QuestionIcon({ type, number }) {
  /*
  type:
  1 = not visited
  2 = not answered
  3 = answered
  4 = marked for review
  5 = answered and marked for review
  */

  switch (type) {
    case 1:
      return (
        <div className="rounded-lg flex justify-center items-center text-sm w-10 h-8 bg-gray-200 border border-gray-800">
          {number}
        </div>
      )
    case 2:
      return (
        <div class="text-white bg-red-600 trapezoid flex text-sm justify-center items-center">
          {number}
        </div>
      )
    case 3:
      return (
        <div class="text-white bg-green-500 trapezoid flex text-sm justify-center items-center">
          {number}
        </div>
      )
    case 4:
      return (
        <div className='border text-white border-gray-800 rounded-full w-8 h-8 text-sm flex justify-center items-center bg-gradient-to-tl from-[#2b0549] to-[#6e4d7f]'>
          {number}
        </div>
      )
    case 5:
      return (
        <div className='relative border  text-white border-gray-800 rounded-full w-8 h-8 text-sm flex justify-center items-center bg-gradient-to-tl from-[#2b0549] to-[#6e4d7f]'>
          {number}
          <div className='absolute rounded-full bg-green-400 w-[10px] h-[10px] bottom-[2px] right-[2px]'></div>
        </div>
        // <div class="relative flex items-center justify-center h-screen">
        //   <div class="relative flex items-center justify-center w-32 h-32 bg-purple-700 rounded-full text-white">
        //     <span class="z-10">Text</span>
        //     <div class="absolute w-12 h-12 bg-green-500 rounded-full bottom-2 right-2"></div>
        //   </div>
        // </div>
      )
    default:
      throw new Error("un detected question type")
  }
}

export default QuestionIcon
