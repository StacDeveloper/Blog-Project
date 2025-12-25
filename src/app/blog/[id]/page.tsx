"use client"
import Loading from '@/components/ui/loading'
import { Blog, blog_service, useAppData, User } from '@/context/appcontext'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from "axios"
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck, Edit, Trash2Icon, User2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Cookies from 'js-cookie'

interface BlogIdResponse {
    blog: Blog
    author: {
        user: User
    }
    success: boolean
}

type CommentResponse = {
    success: boolean
    token: string,
    message: string,
    comments: postedComment[]
}

type deleBlogResponse = {
    message: string
}

interface postedComment {
    author: string
    blogid: string
    comment: string
    created_at: Date
    id: number
    userid: string
    username: string
}

type saveblogresponse = {
    message: string
}


var token = Cookies.get("token")

const BlogAuthorPage = () => {
    const { isAuth, user, fetchBlogs, savedBlogs, fetchSavedBlogs } = useAppData()
    const { id } = useParams()
    const [blog, setBlog] = useState<Blog | null>(null)
    const [author, SetAuthor] = useState<User | null>(null)
    const [authorloading, SetAuthorLoading] = useState(false)
    const [commentLoading, SetCommentLoading] = useState<boolean>(false)
    const router = useRouter()
    const [comment, SetComment] = useState<string>("")
    const [blogLoading, setblogLoading] = useState<boolean>(false)
    const author_service = "http://localhost:5001"
    const [postedComments, SetPostedComments] = useState<postedComment[]>([])
    const [saved, Setsaved] = useState<boolean>(false)
    const [savedLoading, SetsavedLoading] = useState<boolean>(false)

    async function fetchComments() {
        SetCommentLoading(true)
        try {
            const { data } = await axios.get<CommentResponse>(`${blog_service}/api/blog/blogs/comments/getallcomments/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            console.log(data)
            SetPostedComments(data.comments)
        } catch (error: any) {
            console.log(error)
            toast.error(error.response?.data?.message ||
                error.message ||
                "Failed to load comments")
        } finally {
            SetCommentLoading(false)
        }
    }

    useEffect(() => {
        if (savedBlogs && savedBlogs.some((blog) => blog.blogid === id)) {
            Setsaved(true)
        } else {
            Setsaved(false)
        }
    }, [savedBlogs, id])

    useEffect(() => {
        fetchComments()
    }, [id])

    async function postsavedBlogs() {
        SetsavedLoading(true)
        try {
            const { data } = await axios.post<saveblogresponse>(`${blog_service}/api/blog/blogs/saved/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } })
            toast.success(data.message)
            Setsaved((prev) => !prev)
            fetchSavedBlogs()
        } catch (error: any) {
            console.log(error)
            toast.error("Problem While Saving Blog")
        } finally {
            SetsavedLoading(false)
        }
    }

    async function deleteBlog() {
        if (confirm("Are you sure you want to delete this blog")) {
            setblogLoading(true)
            try {
                const { data } = await axios.delete<deleBlogResponse>(`${author_service}/api/auth/blog/delete/${id}`, { headers: { Authorization: `Bearer ${token}` } })

                toast.success(data.message)
                setTimeout(() => {
                    fetchBlogs()
                }, 4000);
            } catch (error: any) {
                console.log(error)
                toast.error(error)
            } finally {
                setblogLoading(false)
                router.push("/blogs")
            }
        }
    }

    async function fetchAuthorBlog() {

        try {
            SetAuthorLoading(true)
            const { data } = await axios.get<BlogIdResponse>(`${blog_service}/api/blog/blogs/${id}`)
            setBlog(data.blog)
            SetAuthor(data.author.user)
        } catch (error: any) {
            console.log(error)
            toast.error(error)
        } finally {
            SetAuthorLoading(false)
        }
    }


    useEffect(() => {
        if (id) {
            fetchAuthorBlog()
        }
    }, [id])


    async function addComment() {
        SetAuthorLoading(true)
        try {
            const { data } = await axios.post<CommentResponse>(`${blog_service}/api/blog/blogs/comments/${id}`, { comment }, { headers: { Authorization: `Bearer ${token}` } })
            toast.success(data.message)
            SetComment("")
            fetchComments()
        } catch (error: any) {
            console.log(error)
            toast.error(error)
        } finally {
            SetAuthorLoading(false)
        }
    }

    async function deleteComment(commentId: number) {
        if (confirm("Are you sure you want to delete the comment")) {
            SetCommentLoading(true)
            try {
                const { data } = await axios.delete<CommentResponse>(`${blog_service}/api/blog/blogs/comments/delete/${commentId}`, { headers: { Authorization: `Bearer ${token}` } })
                toast.success(data.message)
                fetchComments()
            } catch (error: any) {
                console.log(error)
                toast.error(error)
            } finally {
                SetCommentLoading(false)
            }
        }
    }

    console.log(author)


    if (!blog || !author) {
        return <Loading />
    }
    else {
        return (
            <div className='max-w-4xl mx-auto p-6 space-y-6'>
                <Card>
                    <CardHeader>
                        <h1 className='text-3xl font-bold text-gray-900'>{blog.title}</h1>
                        <p className='text-gray-600 mt-2 flex items-center'>
                            <Link href={`/profile/${author?._id}`} className='flex items-center gap-2'>
                                <img src={author?.image} className='w-8 h-8 rounded-full'
                                    alt={author?.name}
                                />

                            </Link>
                            {
                                isAuth && <Button onClick={postsavedBlogs} disabled={savedLoading} variant={"ghost"} className='mx-3' size={"lg"}>{saved ? <BookmarkCheck /> : <Bookmark />}</Button>
                            }
                            {
                                blog.author === user?._id && <>
                                    <Button size={"sm"} onClick={() => router.push(`/blog/edit/${id}`)}>
                                        <Edit />
                                    </Button>
                                    <Button variant={"destructive"} className='mx-2' size={"sm"} disabled={blogLoading} onClick={deleteBlog}>
                                        <Trash2Icon />
                                    </Button>
                                </>
                            }
                        </p>
                    </CardHeader>
                    <CardContent>
                        <img src={blog.image} alt="blog image" className='w-auto h-auto object-cover rounded-lg mb-4' />
                        <p className='text-lg text-gray-700 mb-4'>{blog.description}</p>
                        <div className='max-w-prose' dangerouslySetInnerHTML={{ __html: blog.blogcontent }} />
                    </CardContent>
                </Card>

                {isAuth && <Card>
                    <CardHeader>
                        <h3 className='text-xl font-semibold'>Leave a comment</h3>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor='comment'>Your Comment</Label>
                        <Input id='comment' placeholder='Type your comment here' className='my-2' value={comment} onChange={e => SetComment(e.target.value)} />
                        <Button onClick={addComment} disabled={authorloading}>{authorloading ? "Adding Comment..." : "Post Comment"}</Button>
                    </CardContent>
                </Card>}
                <Card>
                    <CardHeader>
                        <h3 className='text-lg font-medium'>All Comments</h3>
                    </CardHeader>
                    <CardContent>
                        {postedComments && postedComments.length > 0 ? postedComments.map((postedComment, index) => {
                            return (
                                <div className='border-b py-2 flex items-center gap-3' key={index}>
                                    <div>
                                        <p className='font-semibold flex items-center gap-1'><span className='user border border-gray-400 rounded-full p-1'><User2 /></span>
                                            {postedComment.username}</p>
                                        <p>{postedComment.comment}</p>
                                        <p className='text-xs text-gray-500'>{new Date(postedComment.created_at).toLocaleDateString()}</p>
                                    </div>
                                    {postedComment.userid === user?._id && (<Button variant={"destructive"} disabled={commentLoading} onClick={() => { deleteComment(postedComment.id) }}><Trash2Icon /></Button>)}
                                </div>
                            )
                        }) : <p>No Comments Yet</p>}
                    </CardContent>
                </Card>
            </div>
        )
    }


}

export default BlogAuthorPage