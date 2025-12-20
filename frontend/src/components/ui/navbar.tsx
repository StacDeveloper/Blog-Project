"use client"

import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './button'
import { CircleUser, LogIn, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppData } from '@/context/appcontext'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { loading, isAuth } = useAppData()

    return (
        <nav className='bg-white shadow-md p-4 z-50'>
            <div className='container mx-auto flex justify-between items-center'>
                <Link href={"/"} className='text-xl font-bold text-gray-900'>ThoughtSpace</Link>
                <div className='md:hidden'>
                    <Button variant={"ghost"} onClick={() => setIsOpen(prev => !prev)} />
                    {isOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
                </div>
                <ul className='hidden md:flex justify-center items-center space-x-6 text-gray-700'>
                    <li>
                        <Link href={"/"} className='hover:text-blue-500 font-semibold'>Home</Link></li>
                    <li><Link href={"/blog/saved"} className='hover:text-blue-500 font-semibold'>Saved Blogs</Link></li>
                    {loading ? "" : <li>{isAuth ?
                        (<Link href={"/profile"} className='hover:text-blue-500 font-semibold'><CircleUser/> </Link>) : (<Link href={"/"} className='hover:text-blue-500 font-semibold'><LogIn /></Link>)}
                    </li>}
                </ul>
            </div>
            <div className={cn("md:hidden overflow-hidden transition-all duration-300 easy-in-out", isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0")}>
                <ul className='flex flex-col justify-center items-center space-y-4 p-4 text-gray-700 bg-white shadow-md'>
                    <li>
                        <Link href={"/"} className='hover:text-blue-500 font-semibold'>Home</Link></li>
                    <li><Link href={"/blog/saved"} className='hover:text-blue-500 font-semibold'>Saved Blogs</Link></li>
                    <li><Link href={"/"} className='hover:text-blue-500 font-semibold'><LogIn /></Link></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar