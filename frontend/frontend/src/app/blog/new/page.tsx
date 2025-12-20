"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RefreshCw } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useMemo, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { author } from '@/context/appcontext'
import toast from 'react-hot-toast'

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })


const BlogCategories = ["Technology", "Health", "Category Finance", "Travel", "Education", "Entertainment", "Animals", "United-Kingdom"]

interface formData {
  title: string,
  description: string,
  category: string,
  image: File | null,
  blogcontent: string
}

interface axiosResponse {
  message: string,
  token: string,
}

const AddBlog = () => {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [loading, setloading] = useState<boolean>(false)
  const [formData, SetformData] = useState<formData>({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    SetformData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0]
    SetformData({ ...formData, image: file || null })
  }
  const handleFormSubmit = async (blog: React.FormEvent<HTMLFormElement>) => {
    blog.preventDefault()
    setloading(true)
    const formDatatoSend = new FormData()
    formDatatoSend.append("title", formData.title)
    formDatatoSend.append("description", formData.description)
    formDatatoSend.append("category", formData.category)
    formDatatoSend.append("blogcontent", formData.blogcontent)
    if (formData.image) {
      formDatatoSend.append("file", formData.image)
    }

    try {
      const token = Cookies.get("token")
      const { data } = await axios.post<axiosResponse>(`${author}/api/auth/blog/new`, formDatatoSend, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } })
      toast.success(data.message || "Blog Added Successfully")
      SetformData({
        title: "",
        description: "",
        category: "",
        image: null,
        blogcontent: ""
      })
      setContent("")
      setloading(false)
    } catch (error: any) {
      console.log("error while adding blog", error?.data?.message)
      toast.error(error?.data?.message)
    } finally {
      setloading(false)
    }

  }




  const config = useMemo(() => ({
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder: 'Start typings...'
  }), [])



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
              <Input name='title' required value={formData.title} onChange={handleInputChange} placeholder='Enter Blog Title' />
              <Button type='button'><RefreshCw /></Button>
            </div>
            <Label>Description</Label>
            <div className='flex justify-center items-center gap-2'>
              <Input name='description' required placeholder='Enter Blog Description' value={formData.description} onChange={handleInputChange} />
              <Button type='button'><RefreshCw /></Button>
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
              <Input type='file' accept='image/*' onChange={handleFileChange}></Input>
            </div>
            <div>
              <Label>Blog Content</Label>
              <div className='flex justify-between items-center mb-2'>
                <p className='text-sm text-muted-foreground'>
                  Paste Your blog or type here. You can use rich text and formatting. Please add image after improving your grammer.
                  <Button type='button' size={"sm"}>
                    <RefreshCw size={16} />
                    <span className='ml-2'>Fix Grammer</span>
                  </Button>
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

export default AddBlog