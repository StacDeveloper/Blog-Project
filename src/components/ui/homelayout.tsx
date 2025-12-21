import { Sidebar } from "../ui/sidebar"
import React from 'react'
import { SidebarProvider } from './sidebar'

interface BlogsProps {
    children: React.ReactNode
}

const HomeLayout: React.FC<BlogsProps> = ({ children }) => {
    return (
        <div>
            <SidebarProvider>
                <Sidebar>
                    <main className='w-full'>
                        <div className='w-full min-h-[calc(100vh-45)] px-4'>
                            {children}
                        </div>
                    </main>
                </Sidebar>
            </SidebarProvider>
        </div>
    )
}

export default HomeLayout