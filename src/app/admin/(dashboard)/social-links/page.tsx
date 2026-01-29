"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Pencil, 
  Trash2, 
  Link2,
  Loader2,
  GripVertical,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  Globe,
} from "lucide-react"
import { useSocialLinks } from "@/hooks/use-social-links"
import { SocialLink, SocialLinkFormData } from "@/types/admin"
import { PageHeader } from "@/components/admin/page-header"
import { StatusBadge } from "@/components/admin/status-badge"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { EmptyState } from "@/components/admin/empty-state"
import { LoadingPage } from "@/components/admin/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean(),
})

type SocialLinkFormValues = z.infer<typeof socialLinkSchema>

const platformOptions = [
  { value: "GitHub", icon: Github },
  { value: "LinkedIn", icon: Linkedin },
  { value: "Twitter", icon: Twitter },
  { value: "Instagram", icon: Instagram },
  { value: "YouTube", icon: Youtube },
  { value: "Facebook", icon: Facebook },
  { value: "Website", icon: Globe },
  { value: "Other", icon: Link2 },
]

const getPlatformIcon = (platform: string) => {
  const option = platformOptions.find(
    (opt) => opt.value.toLowerCase() === platform.toLowerCase()
  )
  return option?.icon || Link2
}

export default function SocialLinksPage() {
  const { socialLinks, loading, error, fetchSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } = useSocialLinks()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingLink, setEditingLink] = React.useState<SocialLink | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: "",
      url: "",
      icon: "",
      order: 0,
      isPublished: true,
    },
  })

  React.useEffect(() => {
    fetchSocialLinks()
  }, [fetchSocialLinks])

  React.useEffect(() => {
    if (editingLink) {
      form.reset({
        platform: editingLink.platform,
        url: editingLink.url,
        icon: editingLink.icon || "",
        order: editingLink.order,
        isPublished: editingLink.isPublished,
      })
      setDialogOpen(true)
    }
  }, [editingLink, form])

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingLink(null)
    form.reset({
      platform: "",
      url: "",
      icon: "",
      order: 0,
      isPublished: true,
    })
  }

  const onSubmit = async (data: SocialLinkFormValues) => {
    const formData: SocialLinkFormData = {
      ...data,
      icon: data.icon || undefined,
    }

    let result
    if (editingLink) {
      result = await updateSocialLink(editingLink.id, formData)
      if (result) {
        toast.success("Social link updated successfully")
      } else {
        toast.error("Failed to update social link")
      }
    } else {
      result = await createSocialLink(formData)
      if (result) {
        toast.success("Social link created successfully")
      } else {
        toast.error("Failed to create social link")
      }
    }

    if (result) {
      handleCloseDialog()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const success = await deleteSocialLink(deleteId)
    if (success) {
      toast.success("Social link deleted successfully")
    } else {
      toast.error("Failed to delete social link")
    }
    setDeleting(false)
    setDeleteId(null)
  }

  if (loading && socialLinks.length === 0) {
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
        title="Social Links"
        description="Manage your social media and other links"
        actionLabel="Add Link"
        onAction={() => setDialogOpen(true)}
      />

      {socialLinks.length === 0 ? (
        <EmptyState
          icon={Link2}
          title="No social links yet"
          description="Add your social media profiles and other links."
          actionLabel="Add Link"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {socialLinks.map((link) => {
                const Icon = getPlatformIcon(link.platform)
                return (
                  <div
                    key={link.id}
                    className="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <GripVertical className="h-5 w-5 text-zinc-400 cursor-grab" />
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      <Icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {link.platform}
                      </p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-500 hover:text-violet-600 truncate block"
                      >
                        {link.url}
                      </a>
                    </div>
                    <StatusBadge status={link.isPublished ? "published" : "draft"} />
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingLink(link)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => setDeleteId(link.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLink ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
            <DialogDescription>
              {editingLink ? "Update the link details below." : "Add a new social media or website link."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {platformOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              {option.value}
                            </div>
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
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel>Published</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingLink ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Social Link"
        description="Are you sure you want to delete this link? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  )
}
