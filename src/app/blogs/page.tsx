"use client"
import { Filter } from 'lucide-react'
import Loading from '@/components/ui/loading'
import { useSidebar } from '@/components/ui/sidebar'
import { useAppData } from '@/context/appcontext'
import { Button } from '@/components/ui/button'
import BlogCard from '@/components/blogcard'

const Blogs = () => {
    const { loading, isAuth, blog, blogLoading } = useAppData()
    const { toggleSidebar } = useSidebar()
    return (
        <div>
            <div>
                {loading ? <Loading /> : <div className='container mx-auto px-4'>
                    <div className='flex justify-between items-center my-5'>
                        <h1 className='text-3xl font-bold'>Latest Blogs</h1>
                        <Button onClick={toggleSidebar} className='flex items-center gap-2 px-4 bg-primary text-white'>
                            <Filter size={18} />
                            <span>Filter Blogs</span>
                        </Button>
                    </div>
                    {blogLoading ? <Loading /> : <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                        {blog?.length === 0 && <p>No Blogs Yet</p>}
                        {Array.isArray(blog) &&  blog && blog.map((blog, index) => {
                            return <BlogCard key={index} image={blog.image} title={blog.title} description={blog.description} id={blog.id} time={blog.created_at}/>
                        })}
                    </div>}
                </div>
                }
            </div>
        </div>
    )
}

export default Blogs