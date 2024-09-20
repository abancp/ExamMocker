"use client"
import React from 'react'
import { useParams } from "next/navigation"
import NotFound from './notFound'
function layout({ children }) {
  const { exam } = useParams()
  const exams = ["jee"]
  const progress = ["neet"]
  if (exams.includes(exam)) {
    return (
      <>{children}</>
    )
  }
  if (progress.includes(exam)) {
    return (
      <NotFound progress={true} />
    )

  }
  return (
      <NotFound />
  )
}

export default layout
