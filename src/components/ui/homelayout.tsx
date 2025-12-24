import React from 'react'
import HomeLayoutSidebar from "../sidebar"
import { SidebarProvider } from './sidebar'

interface BlogsProps {
    children: React.ReactNode
}

const HomeLayout: React.FC<BlogsProps> = ({ children }) => {
    return (
        <div>
                <HomeLayoutSidebar/>
                    <main className='w-full'>
                        <div className='w-full min-h-[calc(100vh-45px)] px-4'>
                            <SidebarProvider></SidebarProvider>
                            {children}
                        </div>
                    </main>
        </div>
    )
}

export default HomeLayout