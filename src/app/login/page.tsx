"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import { useAppData, User, user_service } from '@/context/appcontext'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { useGoogleLogin } from "@react-oauth/google"
import axios from 'axios'
import { redirect, useRouter } from 'next/navigation'
import Loading from '@/components/ui/loading'
import { useEffect } from "react"


interface LoginResponse {
  token: string,
  message: string,
  user: User | null
}

const LoginPage = () => {
  const router = useRouter()
  const { isAuth, setisAuth, setloading, loading, setUser } = useAppData()

  useEffect(() => {
    if (isAuth) {
      router.push("/profile")
    }
  }, [isAuth])


  const responseGoogle = async (authResult: any) => {
    setloading(true)
    try {
      const result = await axios.post<LoginResponse>(`${user_service}/api/user/login`, {
        code: authResult.code
      })

      Cookies.set("token", result?.data?.token, {
        expires: 5,
        secure: true,
        path: "/",
      })
      toast.success(result?.data?.message)
      setisAuth(true)
      setloading(false)
      setUser(result.data.user)
    } catch (error: any) {
      console.error(error)
      toast.error(error)
      setloading(false)
    }
  }


  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code"
  })


  return (
    <>
      {loading ? <Loading /> : (
        <div className='w-[350px] m-auto mt-[200px]'>
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Login to ThoughtSpace</CardTitle>
              <CardDescription>
                Your daily news, comedy and family community app
              </CardDescription>
              <CardAction>
                <Button variant="link">Sign Up</Button>
              </CardAction>
            </CardHeader>
            <CardContent>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button onClick={googleLogin} variant="outline" className="w-full">
                <img height={24} width={24} src={"google.avif"} alt='google.png' /> Login with Google
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}

export default LoginPage