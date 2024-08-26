import React from 'react'
import ExamList from '../../components/Exam/ExamList'
import Header from '../../components/Header'
import ResultList from '../../components/Exam/ResultList'

function Page() {
  
  return (
    <div className="px-4 md:px-10 pt-24">
      <Header/>
      <ResultList/>
    </div>
  )
}

export default Page
