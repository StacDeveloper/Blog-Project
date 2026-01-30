"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAppData, User, user_service } from '@/context/appcontext'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import React, { useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import axios from 'axios'
import Loading from '@/components/ui/loading'
import { Facebook, Instagram, Linkedin, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { redirect, useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'


interface FetchuserApi {
    user: User
}

const UserProfilePage = () => {

    const [loading, setloading] = useState<boolean>(false)
    const [user, setUser] = useState<User | null>(null)
    const { id } = useParams()

    async function FetchUser() {
        try {
            setloading(true)
            const { data } = await axios.get<FetchuserApi>(`${user_service}/api/user/users/${id}`)
            setUser(data.user)
        } catch (error: any) {
            console.log(error)
            toast.error(error)
        } finally {
            setloading(false)
        }
    }

    useEffect(() => {
        FetchUser()
    }, [id])

    return (
        <div className='flex justify-center items-center min-h-screen p-4'>
            {loading ? <Loading /> : (
                <Card className='w-full max-w-xl shadow-lg border rounded-2xl p-6'>
                    <CardHeader className='text-center'>
                        <CardTitle className='text-2xl font-semibold'>
                            Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='flex flex-col items-center space-y-4'>
                        <Avatar

                            className='w-32 h-32 border-4 border-gray-200 shadow-md cursor-pointer rounded-full overflow-hidden'
                        >
                            <AvatarImage
                                src={user?.image || '/default-avatar.png'}
                                alt="profile pic"
                                className='rounded-full w-full h-full object-cover'
                            />
                        </Avatar>
                        <div className='w-full space-y-2 text-center'>
                            <label htmlFor="" className='font-medium'>Name</label>
                            <p>{user?.name}</p>
                        </div>
                        {user?.bio && (<div className='w-full space-y-2 text-center'>
                            <label htmlFor="" className='font-medium'>Bio</label>
                            <p>{user.bio}</p>
                            <div className='flex justify-center space-x-4 mt-7'>
                                {
                                    user?.instagram && (<a href={user.instagram} target='_blank' rel='noopener noreferrer'>
                                        <Instagram className='text-pink-500 text-2xl' />
                                    </a>)
                                }
                                {
                                    user?.facebook && (<a href={user.facebook} target='_blank' rel='noopener noreferrer'>
                                        <Facebook className='text-pink-500 text-2xl' />
                                    </a>)
                                }
                                {
                                    user?.linkedin && (<a href={user.linkedin} target='_blank' rel='noopener noreferrer'>
                                        <Linkedin className='text-blue-500 text-2xl' />
                                    </a>)
                                }</div>
                        </div>)}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default UserProfilePage