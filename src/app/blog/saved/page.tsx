"use client"

import BlogCard from "@/components/blogcard"
import Loading from "@/components/ui/loading"
import { useAppData } from "@/context/appcontext"


const SavedPage = () => {
    const { blog, savedBlogs } = useAppData()

    if (!blog || !savedBlogs) {
        return <Loading />
    }

    
    
    const filteredBlogs = blog.filter((e) => savedBlogs.some((savedb) => savedb.blogid === e.id.toString())
    )
    console.log(filteredBlogs)
    return (
        <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mt-2">Saved Blogs</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                {filteredBlogs.length > 0 ? filteredBlogs.map((blog, index) => {
                    return (
                        <BlogCard key={index} image={blog.image} title={blog.title} description={blog.description} id={blog.id} time={blog.created_at} />
                    )
                }) : <p>No Saved Blogs Yet</p>}
            </div>
        </div>
    )
}

export default SavedPage