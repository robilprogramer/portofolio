"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Quote,
  Loader2,
  Star,
} from "lucide-react"
import { useTestimonials } from "@/hooks/use-testimonials"
import { Testimonial, TestimonialFormData } from "@/types/admin"
import { PageHeader } from "@/components/admin/page-header"
import { StatusBadge } from "@/components/admin/status-badge"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { EmptyState } from "@/components/admin/empty-state"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { getInitials } from "@/lib/utils"

const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  company: z.string().min(1, "Company is required"),
  content: z.string().min(1, "Content is required"),
  avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  rating: z.number().min(1).max(5),
  featured: z.boolean(),
  order: z.number().optional(),
  isPublished: z.boolean(),
})

type TestimonialFormValues = z.infer<typeof testimonialSchema>

export default function TestimonialsPage() {
  const { testimonials, loading, error, fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingTestimonial, setEditingTestimonial] = React.useState<Testimonial | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      position: "",
      company: "",
      content: "",
      avatar: "",
      rating: 5,
      featured: false,
      order: 0,
      isPublished: true,
    },
  })

  React.useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  React.useEffect(() => {
    if (editingTestimonial) {
      form.reset({
        name: editingTestimonial.name,
        position: editingTestimonial.position,
        company: editingTestimonial.company,
        content: editingTestimonial.content,
        avatar: editingTestimonial.avatar || "",
        rating: editingTestimonial.rating,
        featured: editingTestimonial.featured,
        order: editingTestimonial.order,
        isPublished: editingTestimonial.isPublished,
      })
      setDialogOpen(true)
    }
  }, [editingTestimonial, form])

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingTestimonial(null)
    form.reset({
      name: "",
      position: "",
      company: "",
      content: "",
      avatar: "",
      rating: 5,
      featured: false,
      order: 0,
      isPublished: true,
    })
  }

  const onSubmit = async (data: TestimonialFormValues) => {
    const formData: TestimonialFormData = {
      ...data,
      avatar: data.avatar || undefined,
    }

    let result
    if (editingTestimonial) {
      result = await updateTestimonial(editingTestimonial.id, formData)
      if (result) {
        toast.success("Testimonial updated successfully")
      } else {
        toast.error("Failed to update testimonial")
      }
    } else {
      result = await createTestimonial(formData)
      if (result) {
        toast.success("Testimonial created successfully")
      } else {
        toast.error("Failed to create testimonial")
      }
    }

    if (result) {
      handleCloseDialog()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const success = await deleteTestimonial(deleteId)
    if (success) {
      toast.success("Testimonial deleted successfully")
    } else {
      toast.error("Failed to delete testimonial")
    }
    setDeleting(false)
    setDeleteId(null)
  }

  if (loading && testimonials.length === 0) {
    return <LoadingPage />
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage client testimonials and reviews"
        actionLabel="Add Testimonial"
        onAction={() => setDialogOpen(true)}
      />

      {testimonials.length === 0 ? (
        <EmptyState
          icon={Quote}
          title="No testimonials yet"
          description="Add testimonials from clients and colleagues to build credibility."
          actionLabel="Add Testimonial"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="absolute top-4 right-4 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingTestimonial(testimonial)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                    onClick={() => setDeleteId(testimonial.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <Quote className="h-8 w-8 text-violet-200 dark:text-violet-800 mb-4" />
                
                <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-4">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-300"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || undefined} />
                    <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {testimonial.position} at {testimonial.company}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <StatusBadge status={testimonial.isPublished ? "published" : "draft"} />
                  {testimonial.featured && <StatusBadge status="featured" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
            <DialogDescription>
              {editingTestimonial ? "Update the testimonial details below." : "Add a new testimonial from a client or colleague."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Testimonial</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What they said about you..."
                        className="min-h-25"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Avatar URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="CTO" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Tech Corp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => field.onChange(i + 1)}
                            className="p-1"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                i < field.value
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-zinc-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="mt-0!">Featured</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="mt-0!">Published</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingTestimonial ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  )
}
