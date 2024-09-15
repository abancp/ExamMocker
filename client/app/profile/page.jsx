"use client"
import React from 'react'
import  useStore  from '../../store/store'
import Header from '../../components/Header'

function page() {
  const [username,admin] = useStore((state)=>[state.username,state.admin])
  return (
    <div className='pt-40'>
      <Header/>
      {username}
      {admin}
    </div>
  )
}

export default page
