'use client'
import React from 'react'
import LogInForm from '@/src/components/logInForm'
import PageLoader from '@/src/components/global/PageLoader'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const LoginPage = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleLoad = () => setLoading(false)
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])

  if (loading) return <PageLoader />
  return (
    <div className="flex flex-col items-center h-screen">
      {/* 🔹 "events" stays at the very top */}
      <h1 className="boldonse text-[30px] mt-6  mr-7">
        <Link href="/">events</Link>
      </h1>

      {/* 🔹 Move the form slightly below but not centered */}
      <div className="flex  flex-col items-center mt-16 w-[450px]">
        <h1 className="font-poppins  font-bold text-4xl mr-6">Get Started</h1>
        <h3 className="text-[#454444]  text-[15px] font-semibold mt-2 mb-4 text-center">
          Access your account and start enrolling in events now!
        </h3>
        <LogInForm />
      </div>
    </div>
  )
}

export default LoginPage
