"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { usePosts } from "@/hooks/use-posts"
import { PostFormData } from "@/types/admin"
import { PageHeader } from "@/components/admin/page-header"
import { TagInput } from "@/components/admin/tag-input"
import { LoadingPage } from "@/components/admin/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { toDateTimeLocal } from "@/lib/utils"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tags: z.array(z.string()),
  category: z.string().min(1, "Category is required"),
  featured: z.boolean(),
  isPublished: z.boolean(),
  publishedAt: z.string().optional(),
})

type PostFormValues = z.infer<typeof postSchema>

const categoryOptions = [
  "Tutorial",
  "Technology",
  "Web Development",
  "Mobile Development",
  "DevOps",
  "Career",
  "Personal",
  "Other",
]

export default function PostFormPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id && id !== "new"

  const { getPost, createPost, updatePost, loading } = usePosts()
  const [initialLoading, setInitialLoading] = React.useState(isEditing)

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      thumbnail: "",
      tags: [],
      category: "",
      featured: false,
      isPublished: false,
      publishedAt: "",
    },
  })

  React.useEffect(() => {
    if (isEditing) {
      getPost(id).then((post) => {
        if (post) {
          form.reset({
            title: post.title,
            excerpt: post.excerpt || "",
            content: post.content,
            thumbnail: post.thumbnail || "",
            tags: post.tags,
            category: post.category,
            featured: post.featured,
            isPublished: post.isPublished,
            publishedAt: toDateTimeLocal(post.publishedAt!) || "",
          })
        }
        setInitialLoading(false)
      })
    }
  }, [isEditing, id, getPost, form])

  const onSubmit = async (data: PostFormValues) => {
    const formData: PostFormData = {
      ...data,
      excerpt: data.excerpt || undefined,
      thumbnail: data.thumbnail || undefined,
      // publishedAt: data.publishedAt || undefined,
      publishedAt: data.publishedAt
        ? new Date(data.publishedAt).toISOString()
        : undefined,
    }

    let result
    if (isEditing) {
      result = await updatePost(id, formData)
      if (result) {
        toast.success("Post updated successfully")
        router.push("/admin/posts")
      } else {
        toast.error("Failed to update post")
      }
    } else {
      result = await createPost(formData)
      if (result) {
        toast.success("Post created successfully")
        router.push("/admin/posts")
      } else {
        toast.error("Failed to create post")
      }
    }
  }

  if (initialLoading) {
    return <LoadingPage />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Edit Post" : "New Post"}
        description={isEditing ? "Update your blog post" : "Create a new blog post"}
        backHref="/admin/posts"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="My Amazing Blog Post" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="A brief summary of your post..."
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Short description displayed in post cards
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your post content here... (Markdown supported)"
                            className="min-h-100 font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          You can use Markdown for formatting
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publish</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Published</FormLabel>
                          <FormDescription>
                            Make this post visible
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Featured</FormLabel>
                          <FormDescription>
                            Show in featured section
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="publishedAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publish Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormDescription>
                          Schedule the post for later
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryOptions.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                          <TagInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Add tag (press Enter)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Post" : "Create Post"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
