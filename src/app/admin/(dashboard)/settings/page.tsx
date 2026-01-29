"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Settings, 
  Pencil, 
  Trash2, 
  Loader2,
  Plus,
  Code,
  Type,
  Hash,
  ToggleLeft,
} from "lucide-react"
import { useSettings } from "@/hooks/use-settings"
import { Setting, SettingFormData, SettingType } from "@/types/admin"
import { PageHeader } from "@/components/admin/page-header"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { EmptyState } from "@/components/admin/empty-state"
import { LoadingPage } from "@/components/admin/loading-spinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

const settingSchema = z.object({
  key: z.string().min(1, "Key is required").regex(/^[a-z_]+$/, "Key must be lowercase with underscores"),
  value: z.string().min(1, "Value is required"),
  type: z.enum(["string", "number", "boolean", "json"]),
  description: z.string().optional(),
})

type SettingFormValues = z.infer<typeof settingSchema>

const typeOptions: { value: SettingType; label: string; icon: React.ElementType }[] = [
  { value: "string", label: "String", icon: Type },
  { value: "number", label: "Number", icon: Hash },
  { value: "boolean", label: "Boolean", icon: ToggleLeft },
  { value: "json", label: "JSON", icon: Code },
]

export default function SettingsPage() {
  const { settings, loading, error, fetchSettings, createSetting, updateSetting, deleteSetting } = useSettings()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingSetting, setEditingSetting] = React.useState<Setting | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const form = useForm<SettingFormValues>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      key: "",
      value: "",
      type: "string",
      description: "",
    },
  })

  React.useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  React.useEffect(() => {
    if (editingSetting) {
      form.reset({
        key: editingSetting.key,
        value: editingSetting.value,
        type: editingSetting.type,
        description: editingSetting.description || "",
      })
      setDialogOpen(true)
    }
  }, [editingSetting, form])

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingSetting(null)
    form.reset({
      key: "",
      value: "",
      type: "string",
      description: "",
    })
  }

  const onSubmit = async (data: SettingFormValues) => {
    const formData: SettingFormData = {
      ...data,
      description: data.description || undefined,
    }

    let result
    if (editingSetting) {
      result = await updateSetting(editingSetting.id, formData)
      if (result) {
        toast.success("Setting updated successfully")
      } else {
        toast.error("Failed to update setting")
      }
    } else {
      result = await createSetting(formData)
      if (result) {
        toast.success("Setting created successfully")
      } else {
        toast.error("Failed to create setting")
      }
    }

    if (result) {
      handleCloseDialog()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const success = await deleteSetting(deleteId)
    if (success) {
      toast.success("Setting deleted successfully")
    } else {
      toast.error("Failed to delete setting")
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const getTypeIcon = (type: SettingType) => {
    const option = typeOptions.find((opt) => opt.value === type)
    return option?.icon || Type
  }

  if (loading && settings.length === 0) {
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
        title="Settings"
        description="Manage application settings and configurations"
        actionLabel="Add Setting"
        onAction={() => setDialogOpen(true)}
      />

      {settings.length === 0 ? (
        <EmptyState
          icon={Settings}
          title="No settings yet"
          description="Create settings to configure your portfolio application."
          actionLabel="Add Setting"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Settings</CardTitle>
            <CardDescription>
              Configure various aspects of your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((setting) => {
                  const TypeIcon = getTypeIcon(setting.type)
                  return (
                    <TableRow key={setting.id}>
                      <TableCell className="font-mono text-sm">
                        {setting.key}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded max-w-[200px] truncate block">
                          {setting.value}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <TypeIcon className="h-3 w-3" />
                          {setting.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-zinc-500 max-w-[200px] truncate">
                        {setting.description || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setEditingSetting(setting)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700"
                            onClick={() => setDeleteId(setting.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSetting ? "Edit Setting" : "Add Setting"}</DialogTitle>
            <DialogDescription>
              {editingSetting ? "Update the setting details below." : "Create a new configuration setting."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="site_title"
                        {...field}
                        disabled={!!editingSetting}
                      />
                    </FormControl>
                    <FormDescription>
                      Unique identifier (lowercase, underscores only)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <option.icon className="h-4 w-4" />
                              {option.label}
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
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      {form.watch("type") === "json" ? (
                        <Textarea
                          placeholder='{"key": "value"}'
                          className="font-mono min-h-[100px]"
                          {...field}
                        />
                      ) : (
                        <Input
                          placeholder={
                            form.watch("type") === "boolean"
                              ? "true or false"
                              : form.watch("type") === "number"
                              ? "123"
                              : "My Portfolio"
                          }
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="What this setting controls..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingSetting ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Setting"
        description="Are you sure you want to delete this setting? This may affect your application's functionality."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  )
}
