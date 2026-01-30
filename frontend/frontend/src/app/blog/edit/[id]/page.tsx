"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEffect, useMemo, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { author, blog_service, useAppData } from '@/context/appcontext'
import toast from 'react-hot-toast'
import { RefreshCw } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import dynamicImport from 'next/dynamic'

interface Blogresponse {
    blog: formData | any
    token: string,
    success: boolean
    existingImage?: string
}

var token = Cookies.get("token")
const BlogCategories = ["Technology", "Health", "Category Finance", "Travel", "Education", "Entertainment", "Animals", "United-Kingdom"]

interface formData {
  title: string,
  description: string,
  category: string,
  image: File | null,
  blogcontent: string
}

const JoditEditor = dynamicImport(() => import("jodit-react"), { ssr: false })
const EditParamsPage = () => {
    const { id } = useParams()
    const router = useRouter()
    const { fetchBlogs } = useAppData()
    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [loading, setloading] = useState<boolean>(false)
    const [existingImage, SetExistingImage] = useState(null)
    const [formData, SetformData] = useState<formData>({
        title: "",
        description: "",
        category: "",
        image: null,
        blogcontent: ""
    })
    const [Ai, setAi] = useState<boolean>(false)
    const [Aidescription, setAidescription] = useState<boolean>(false)
    const [AiBlog, SetAiBlog] = useState<boolean>(false)


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        SetformData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0]
        SetformData({ ...formData, image: file || null })
    }
    const config = useMemo(() => ({
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        placeholder: 'Start typings...'
    }), [])

    const fetchBlog = async () => {
        setloading(true)
        try {
            const token = Cookies.get("token")
            const { data } = await axios.get<Blogresponse>(`${blog_service}/api/blog/blogs/${id}`)
            const blog = data.blog
            SetformData({
                title: blog.title,
                description: blog.description,
                category: blog.category,
                image: null,
                blogcontent: blog.blogcontent
            })
            console.log(blog)
            setContent(blog.blogcontent)
            SetExistingImage(blog.image ? blog.image : null)
            setTimeout(() => {
                fetchBlogs()
            }, 4000);
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
    }


    useEffect(() => {

        if (id) {
            fetchBlog()
        }
    }, [id])

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setloading(true)
        try {
            const formDatatoSend = new FormData()
            formDatatoSend.append("title", formData.title)
            formDatatoSend.append("description", formData.description)
            formDatatoSend.append("blogcontent", formData.blogcontent)
            formDatatoSend.append("category", formData.category)
            if (formData.image) {
                formDatatoSend.append("file", formData.image)
            }

            const { data } = await axios.post(`${author}/api/auth/blog/${id}`, formDatatoSend, { headers: { Authorization: `Bearer ${token}` } })
            toast.success("Successfully Updated Blog")
            SetformData({
                title: "",
                description: "",
                category: "",
                image: null,
                blogcontent: ""
            })
            setContent("")
        } catch (error: any) {
            console.log(error)
            toast.error(error.message)
        } finally {
            router.push(`/blog/${id}`)
            fetchBlog()
        }
    }


    return (
        <div className='max-w-4xl mx-auto p-6'>
            <Card>
                <CardHeader>
                    <h2 className='text-2xl font-bold'>
                        Add New Blog
                    </h2>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleFormSubmit}
                        className='space-y-4'
                    >
                        <Label>Title</Label>
                        <div className='flex justify-center items-center gap-2'>
                            <Input name='title' required value={formData.title || ""} onChange={handleInputChange} placeholder='Enter Blog Title' />

                        </div>
                        <Label>Description</Label>
                        <div className='flex justify-center items-center gap-2'>
                            <Input name='description' required placeholder='Enter Blog Description' value={formData.description || ""} onChange={handleInputChange} />

                        </div>
                        <Label>Category</Label>
                        <Select onValueChange={(e: any) => SetformData({ ...formData, category: e })}>
                            <SelectTrigger>
                                <SelectValue placeholder={formData.category || "Select Category"}></SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                {BlogCategories && BlogCategories.map((blog, index) => (
                                    <SelectItem key={index} value={blog}>{blog}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div>
                            <Label>Image Upload</Label>
                            {existingImage && !formData.image && (
                                <img src={existingImage} className='w-40 h-40 object-cover rounded mb-2' alt="" />
                            )}
                            <Input type='file' accept='image/*' onChange={handleFileChange}></Input>
                        </div>
                        <div>
                            <Label>Blog Content</Label>
                            <div className='flex justify-between items-center mb-2'>
                                <p className='text-sm text-muted-foreground'>
                                    Paste Your blog or type here. You can use rich text and formatting. Please add image after improving your grammer.

                                </p>
                            </div>
                            <JoditEditor ref={editor} value={content} config={config} tabIndex={1} onBlur={(newcontent) => { setContent(newcontent), SetformData({ ...formData, blogcontent: newcontent }) }}></JoditEditor>
                        </div>
                        <Button type='submit' className='w-full' disabled={loading} >
                            {loading ? "...Submitting" : "Submit"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditParamsPage