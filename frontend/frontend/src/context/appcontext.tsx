"use client"

import { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { GoogleOAuthProvider } from "@react-oauth/google"


export const user_service = "http://localhost:5000"
export const blog_service = "http://localhost:5002"
export const author = "http://localhost:5001"


export interface User {
    _id: string,
    name: string,
    email: string,
    image: string,
    instagram: string,
    facebook: string,
    linkedin: string,
    bio: string
}

export interface Blog {
    id: string,
    title: string,
    description: string,
    blogcontent: string,
    image: string,
    category: string,
    author: string,
    created_at: string
}

interface AppProviderProps {
    children: React.ReactNode
}

interface BlogApiResponse{ 
    blogs?:Blog | null
    success?:string,
    message?:string,
    token?:string
}

interface AppContextType {
    user: User | null
    loading: boolean,
    isAuth: boolean,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
    setloading: React.Dispatch<React.SetStateAction<boolean>>
    setisAuth: React.Dispatch<React.SetStateAction<boolean>>,
    logoutUser: () => void
    blog:Blog[] | null
    blogLoading:boolean
}
const AppContext = createContext<AppContextType | undefined>(undefined)


export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuth, setisAuth] = useState<boolean>(false)
    const [loading, setloading] = useState<boolean>(true)
    const [blogLoading, setBlogLoading] = useState<boolean>(true)
    const [blog, setBlog] = useState<Blog[] | null>(null)

    async function fetchUser() {
        try {
            const token = Cookies.get("token")
            const { data } = await axios.get(`${user_service}/api/user/me`, { headers: { Authorization: `Bearer ${token}` } }) as { data: User }
            setUser(data)
            setisAuth(true)
            setloading(false)
        } catch (error) {
            console.log(error)
            setloading(false)
        }
    }

    async function logoutUser() {
        try {
            Cookies.remove("token")
            setUser(null)
            setisAuth(false)
            toast.success("You have logged out successfully")
        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchUser();
        fetchBlogs()
    }, [])

    async function fetchBlogs() {
        setBlogLoading(true)
        try {
            const { data } = await axios.get<BlogApiResponse>(`${blog_service}/api/blog/blogs/allblogs`)
            setBlog(data)
            console.log(data)
        } catch (error) {
            console.log(error)
        } finally {
            setBlogLoading(false)
        }
    }

    return (
        <AppContext.Provider value={{ user, loading, isAuth, setloading, setisAuth, setUser, logoutUser, blog, blogLoading }}>
            <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}`}>
                <Toaster />
                {children}
            </GoogleOAuthProvider>
        </AppContext.Provider>
    )
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error("user-app-data must be within App Provider")
    }
    return context
}  