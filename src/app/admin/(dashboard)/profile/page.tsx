"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { User, Loader2, MapPin, Mail, Phone, FileText, Check } from "lucide-react"
import { useProfile } from "@/hooks/use-profile"
import { ProfileFormData } from "@/types/admin"
import { PageHeader } from "@/components/admin/page-header"
import { LoadingPage } from "@/components/admin/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { getInitials } from "@/lib/utils"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().min(1, "Bio is required"),
  shortBio: z.string().min(1, "Short bio is required"),
  avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  resumeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  location: z.string().optional(),
  email: z.string().email("Must be a valid email"),
  phone: z.string().optional(),
  isAvailable: z.boolean(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { profile, loading, error, fetchProfile, createProfile, updateProfile } = useProfile()
  const [initialLoading, setInitialLoading] = React.useState(true)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      title: "",
      bio: "",
      shortBio: "",
      avatar: "",
      resumeUrl: "",
      location: "",
      email: "",
      phone: "",
      isAvailable: true,
    },
  })

  React.useEffect(() => {
    fetchProfile().finally(() => setInitialLoading(false))
  }, [fetchProfile])

  React.useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        shortBio: profile.shortBio,
        avatar: profile.avatar || "",
        resumeUrl: profile.resumeUrl || "",
        location: profile.location || "",
        email: profile.email,
        phone: profile.phone || "",
        isAvailable: profile.isAvailable,
      })
    }
  }, [profile, form])

  const onSubmit = async (data: ProfileFormValues) => {
    const formData: ProfileFormData = {
      ...data,
      avatar: data.avatar || undefined,
      resumeUrl: data.resumeUrl || undefined,
      location: data.location || undefined,
      phone: data.phone || undefined,
    }

    let result
    if (profile) {
      result = await updateProfile(profile.id, formData)
      if (result) {
        toast.success("Profile updated successfully")
      } else {
        toast.error("Failed to update profile")
      }
    } else {
      result = await createProfile(formData)
      if (result) {
        toast.success("Profile created successfully")
      } else {
        toast.error("Failed to create profile")
      }
    }
  }

  const watchedAvatar = form.watch("avatar")
  const watchedName = form.watch("name")

  if (initialLoading) {
    return <LoadingPage />
  }

  if (error && !profile) {
    return (
      <div className="p-4 text-center text-red-600">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information displayed on the portfolio"
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Basic information about you that appears on your portfolio
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Full Stack Developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="shortBio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Bio</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="A brief tagline about yourself"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A short tagline displayed in headers and cards
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell your story..."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Your detailed biography for the About section
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    How people can reach you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="+62 812 3456 7890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Jakarta, Indonesia" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                  <CardDescription>
                    Profile picture and resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/avatar.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="resumeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Resume URL
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/resume.pdf" {...field} />
                        </FormControl>
                        <FormDescription>
                          Link to your downloadable resume/CV
                        </FormDescription>
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
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={watchedAvatar} />
                      <AvatarFallback className="text-2xl">
                        {watchedName ? getInitials(watchedName) : <User className="h-12 w-12" />}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 text-lg font-semibold">
                      {watchedName || "Your Name"}
                    </h3>
                    <p className="text-sm text-zinc-500">
                      {form.watch("title") || "Your Title"}
                    </p>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {form.watch("shortBio") || "Your short bio"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="isAvailable"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center gap-2">
                            {field.value && (
                              <Check className="h-4 w-4 text-green-600" />
                            )}
                            Available for Work
                          </FormLabel>
                          <FormDescription>
                            Show &quot;Open to opportunities&quot; badge
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
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {profile ? "Update Profile" : "Create Profile"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
