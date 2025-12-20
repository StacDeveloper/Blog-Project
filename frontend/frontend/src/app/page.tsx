"use client"
import React, { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useAppData } from '@/context/appcontext'
import Loading from '@/components/ui/loading'
import { redirect, useRouter } from 'next/navigation'
const Home = () => {
  const { loading, isAuth } = useAppData()
  const router=useRouter()
  useEffect(() => {
    if (!isAuth) {
      router.push("/login")
    }
  }, [isAuth])
  return (
    <div>
      {loading ? <Loading /> : <Button>Click Me</Button>}
    </div>
  )
}

export default Home