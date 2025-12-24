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
import { author, useAppData } from '@/context/appcontext'
import toast from 'react-hot-toast'


const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })


export const BlogCategories = ["Technology", "Health", "Category Finance", "Travel", "Education", "Entertainment", "Animals", "United-Kingdom"]

export interface formData {
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

interface Aititleresponse {
  success: string,
  result: string
  token: string,
  message: string,
  title?: string

}

interface AIdescriptionResponse extends Aititleresponse {
  description?: string
}

interface AIBlogResponse extends AIdescriptionResponse {
  html?: string
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
  const { fetchBlogs } = useAppData()
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
      setTimeout(() => {
        fetchBlogs()
      }, 4000);
      setloading(false)
    } catch (error: any) {
      console.log("error while adding blog", error?.data?.message)
      toast.error(error?.data?.message)
    } finally {
      setloading(false)
    }

  }


  const AititleResponse = async () => {
    try {
      setAi(true)
      const token = Cookies.get("token")
      const { data } = await axios.post<Aititleresponse>(`${author}/api/auth/blog/ai/title`, { text: formData.title }, { headers: { Authorization: `Bearer ${token}`, "Content-type": "application/json" } })

      if (data.success && data.result) {
        SetformData({ ...formData, title: data.result })
        toast.success("Title Improved Successfully")
      } else {
        toast.error(data.message || "Failed to Improve")
      }


    } catch (error: any) {
      console.log(error)
      toast.error(error?.message)
    } finally {
      setAi(false)
    }
  }

  const AIdescriptionResponse = async () => {
    try {
      setAidescription(true)
      const token = Cookies.get("token")
      const { data } = await axios.post<AIdescriptionResponse>(`${author}/api/auth/blog/ai/description`, { title: formData.title, description: formData.description || "" }, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success && data.result) {
        toast.success("Successfully changed the description")
        SetformData({ ...formData, description: data.result! })
      } else {
        console.error(data.message)
        toast.error("Failed to post data")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setAidescription(false)
    }
  }

  const AiblogResponse = async () => {
    SetAiBlog(true)
    try {
      const token = Cookies.get("token")
      const { data } = await axios.post<AIBlogResponse>(`${author}/api/auth/blog/ai/aiblogresponse`, { blog: formData.blogcontent }, { headers: { Authorization: `Bearer ${token}` } })

      if (!data.success && data.html) {
        setContent(data.html)
        SetformData({ ...formData, blogcontent: data.html })
        toast.success("Fixed Grammer Successfully")
      }
    } catch (error: any) {
      console.log(error)
      toast.error(error.message)
    } finally {
      SetAiBlog(false)
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
              <Input name='title' required value={formData.title || ""} onChange={handleInputChange} placeholder='Enter Blog Title' className={`${Ai ? "animate-pulse placeholder:opacity-60" : ""}`} /> {formData.title === "" ? "" : <Button onClick={AititleResponse} disabled={Ai} type='button'><RefreshCw className={`${Ai ? "animate-spin" : ""}`} /></Button>}

            </div>
            <Label>Description</Label>
            <div className='flex justify-center items-center gap-2'>
              <Input name='description' required placeholder='Enter Blog Description' value={formData.description || ""} onChange={handleInputChange} />
              {formData.title === "" ? "" : <Button onClick={AIdescriptionResponse} disabled={Aidescription}><RefreshCw className={`${Aidescription ? "animate-spin" : ""}`} /></Button>}
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
                  <Button onClick={AiblogResponse} disabled={AiBlog} type='button' size={"sm"}>
                    <RefreshCw size={16} className={`${AiBlog ? "animate-spin" : ""}`} />
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