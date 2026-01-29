"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Code2,
  Loader2,
  GripVertical,
} from "lucide-react"
import { useSkills } from "@/hooks/use-skills"
import { Skill, SkillCategory, SkillFormData } from "@/types/admin"
import { PageHeader } from "@/components/admin/page-header"
import { StatusBadge } from "@/components/admin/status-badge"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { EmptyState } from "@/components/admin/empty-state"
import { LoadingPage } from "@/components/admin/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["FRONTEND", "BACKEND", "DATABASE", "DEVOPS", "MOBILE", "TOOLS", "OTHER"]),
  level: z.number().min(0).max(100),
  icon: z.string().optional(),
  color: z.string().optional(),
  order: z.number().optional(),
  isPublished: z.boolean(),
})

type SkillFormValues = z.infer<typeof skillSchema>

const categoryOptions: { value: SkillCategory; label: string }[] = [
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "DATABASE", label: "Database" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "MOBILE", label: "Mobile" },
  { value: "TOOLS", label: "Tools" },
  { value: "OTHER", label: "Other" },
]

const categoryColors: Record<SkillCategory, string> = {
  FRONTEND: "bg-blue-500",
  BACKEND: "bg-green-500",
  DATABASE: "bg-purple-500",
  DEVOPS: "bg-orange-500",
  MOBILE: "bg-pink-500",
  TOOLS: "bg-cyan-500",
  OTHER: "bg-zinc-500",
}

export default function SkillsPage() {
  const { skills, loading, error, fetchSkills, createSkill, updateSkill, deleteSkill } = useSkills()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingSkill, setEditingSkill] = React.useState<Skill | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "FRONTEND",
      level: 50,
      icon: "",
      color: "",
      order: 0,
      isPublished: true,
    },
  })

  React.useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  React.useEffect(() => {
    if (editingSkill) {
      form.reset({
        name: editingSkill.name,
        category: editingSkill.category,
        level: editingSkill.level,
        icon: editingSkill.icon || "",
        color: editingSkill.color || "",
        order: editingSkill.order,
        isPublished: editingSkill.isPublished,
      })
      setDialogOpen(true)
    }
  }, [editingSkill, form])

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingSkill(null)
    form.reset({
      name: "",
      category: "FRONTEND",
      level: 50,
      icon: "",
      color: "",
      order: 0,
      isPublished: true,
    })
  }

  const onSubmit = async (data: SkillFormValues) => {
    const formData: SkillFormData = {
      ...data,
      icon: data.icon || undefined,
      color: data.color || undefined,
    }

    let result
    if (editingSkill) {
      result = await updateSkill(editingSkill.id, formData)
      if (result) {
        toast.success("Skill updated successfully")
      } else {
        toast.error("Failed to update skill")
      }
    } else {
      result = await createSkill(formData)
      if (result) {
        toast.success("Skill created successfully")
      } else {
        toast.error("Failed to create skill")
      }
    }

    if (result) {
      handleCloseDialog()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const success = await deleteSkill(deleteId)
    if (success) {
      toast.success("Skill deleted successfully")
    } else {
      toast.error("Failed to delete skill")
    }
    setDeleting(false)
    setDeleteId(null)
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<SkillCategory, Skill[]>)

  if (loading && skills.length === 0) {
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
        title="Skills"
        description="Manage your technical skills and expertise"
        actionLabel="Add Skill"
        onAction={() => setDialogOpen(true)}
      />

      {skills.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No skills yet"
          description="Add your technical skills to showcase your expertise."
          actionLabel="Add Skill"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {categoryOptions.map((category) => {
            const categorySkills = skillsByCategory[category.value] || []
            if (categorySkills.length === 0) return null

            return (
              <Card key={category.value}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className={`h-3 w-3 rounded-full ${categoryColors[category.value]}`} />
                    {category.label}
                    <Badge variant="secondary" className="ml-auto">
                      {categorySkills.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-3 rounded-lg border p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <GripVertical className="h-4 w-4 text-zinc-400 cursor-grab" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{skill.name}</span>
                          <span className="text-xs text-zinc-500">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-1.5" />
                      </div>
                      {!skill.isPublished && (
                        <Badge variant="outline" className="text-xs">
                          Draft
                        </Badge>
                      )}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingSkill(skill)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => setDeleteId(skill.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSkill ? "Edit Skill" : "Add Skill"}</DialogTitle>
            <DialogDescription>
              {editingSkill ? "Update the skill details below." : "Add a new skill to your portfolio."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="React, TypeScript, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proficiency Level ({field.value}%)</FormLabel>
                    <FormControl>
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="react-icon" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color (optional)</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                  {editingSkill ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Skill"
        description="Are you sure you want to delete this skill? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  )
}
