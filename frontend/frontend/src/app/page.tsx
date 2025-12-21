"use client"
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useAppData } from '@/context/appcontext'
import Loading from '@/components/ui/loading'
import { redirect, useRouter } from 'next/navigation'
import HomeLayout from '@/components/ui/homelayout'
const Home = () => {
  const { loading, isAuth, blog, blogLoading } = useAppData()
  const router = useRouter()
  useEffect(() => {
    if (!isAuth) {
      router.push("/login")
    }
  }, [isAuth])
  return (
      <HomeLayout>
        <div className=''>
          {loading ? <Loading /> : <div className='container mx-auto px-4'></div>}
        </div>
      </HomeLayout>
  )
}

export default Home