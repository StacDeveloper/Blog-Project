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
import { redirect, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

interface UploadPicResponse {
    token: string,
    message: string,
    file: string,
    user: User | null
}

const Profile: React.FC = () => {
    const { user, setUser, logoutUser } = useAppData()
    const [open, setOpen] = useState<boolean>(false)
    const InputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        name: "",
        instagram: "",
        facebook: "",
        linkedin: "",
        bio: ""
    })

    const router = useRouter()

    if (!user) {
        redirect("/login")
    }



    useEffect(() => {
        if (user) {
            setFormData({
                name: user?.name || "",
                instagram: user?.instagram || "",
                facebook: user?.facebook || "",
                linkedin: user?.linkedin || "",
                bio: user?.bio || ""
            })
        }
    }, [user, open])

    const handleFormSubmit = async () => {
        try {
            setLoading(true)
            const token = Cookies.get("token")
            const { data } = await axios.post<UploadPicResponse>(`${user_service}/api/user/users/update`, formData, { headers: { Authorization: `Bearer ${token}` } })
            toast.success(data.message)
            setLoading(false)
            Cookies.set("token", data.token, {
                expires: 5, secure: true, path: "/"
            })
            setUser(data.user)
            setOpen(false)
        } catch (error: any) {
            toast.error(error.message)
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const changeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0]

        if (file) {
            const formData = new FormData()
            formData.append("file", file)

            try {
                setLoading(true)
                const token = Cookies.get("token")

                const { data } = await axios.post<UploadPicResponse>(
                    `${user_service}/api/user/users/update/uploadpic`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                )

                toast.success(data.message)
                Cookies.set("token", data.token, {
                    expires: 5,
                    secure: true,
                    path: "/"
                })
                setUser(data.user)

            } catch (error: any) {
                console.error("Upload error:", error)
                console.error("Error response:", error.response?.data)

                const errorMessage = error.response?.data?.message || "Image update failed"
                toast.error(errorMessage)
            } finally {
                setLoading(false)
            }
        }
    }

    const clickHandler = () => {
        InputRef.current?.click()
    }

    const logoutHandler = () => {
        logoutUser()
    }

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
                            onClick={clickHandler}
                            className='w-32 h-32 border-4 border-gray-200 shadow-md cursor-pointer rounded-full overflow-hidden'
                        >
                            <AvatarImage
                                src={user?.image || '/default-avatar.png'}
                                alt="profile pic"
                                className='rounded-full w-full h-full object-cover'
                            />
                        </Avatar>
                        <input
                            type="file"
                            className='hidden'
                            accept='image/*'
                            ref={InputRef}
                            onChange={changeHandler}
                        />
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
                        <div className='flex flex-col sm:flex-row gap-2 mt-6 w-full justify-center'>
                            <Button onClick={logoutHandler}><LogOut />Logout</Button>
                            <Button onClick={() => router.push("/blog/new")}>Add Blog</Button>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant={"outline"}>Edit</Button>
                                </DialogTrigger>
                                <DialogContent className='sm:max-w-[500px]'>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Edit Profile
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className='space-y-3'>
                                        <div className='flex flex-col gap-3'>
                                            <Label>Name</Label>
                                            <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <Label>Bio</Label>
                                            <Input value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <Label>Instagram</Label>
                                            <Input value={formData.instagram} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <Label>Facebook</Label>
                                            <Input value={formData.facebook} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>
                                        <div className='flex flex-col gap-3'>
                                            <Label>Linkedin</Label>
                                            <Input value={formData.linkedin} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                        </div>

                                        <Button onClick={handleFormSubmit} className='w-full mt-4'>Save Changes</Button>
                                    </div>
                                </DialogContent>

                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default Profile