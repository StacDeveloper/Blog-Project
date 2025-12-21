"use client"
import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader } from './ui/sidebar'
import { Input } from './ui/input'

const HomeLayoutSidebar: React.FC = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <Sidebar>
            <SidebarHeader className='bg-white text-2xl font-bold mt-5'>
                ThoughtSpace
            </SidebarHeader>
            <SidebarContent className='bg-white'>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Search
                        <Input type='text' placeholder='Search Your Desired Blogs' />
                    </SidebarGroupLabel>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default HomeLayoutSidebar