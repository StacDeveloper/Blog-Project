"use client"
import React, { useEffect, useState } from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { Input } from './ui/input'
import { BoxSelect } from 'lucide-react'
import { BlogCategories } from '@/app/blog/new/page'
import { useAppData } from '@/context/appcontext'

const HomeLayoutSidebar: React.FC = () => {
    const [mounted, setMounted] = useState(false)

    const { searchQuery, setSearchQuery, setCategory } = useAppData()

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
                    <SidebarGroupLabel className='text-xl mb-2'>
                        Search
                    </SidebarGroupLabel>
                    <div className='px-2 mb-4'>
                        <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type='text' placeholder='Search Your Desired Blogs' />
                    </div>

                    <SidebarGroupLabel>Categories</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuButton onClick={() => setCategory("")}><BoxSelect /><span>All</span></SidebarMenuButton>
                        {BlogCategories?.map((blog, index) => (
                            <SidebarMenuItem key={index} onClick={() => setCategory(blog)}>
                                <SidebarMenuButton>
                                    <BoxSelect className='mr-2' />
                                    <span>{blog}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default HomeLayoutSidebar