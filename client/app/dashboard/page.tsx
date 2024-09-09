"use client"
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

function Page() {
  const {push} =useRouter()
  useEffect(()=>{
    push("/dashboard")

  })

  return (
    <div>Dashboard</div>
  )
}

export default Page