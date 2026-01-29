"use client"

import * as React from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  GraduationCap,
  MapPin,
  Calendar,
} from "lucide-react"
import { useEducations } from "@/hooks/use-educations"
import { Education } from "@/types/admin"
import { formatDateShort } from "@/lib/utils"
import { PageHeader } from "@/components/admin/page-header"
import { DataTable } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { EmptyState } from "@/components/admin/empty-state"
import { LoadingPage } from "@/components/admin/loading-spinner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function EducationPage() {
  const { educations, loading, error, fetchEducations, deleteEducation } = useEducations()
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    fetchEducations()
  }, [fetchEducations])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const success = await deleteEducation(deleteId)
    if (success) {
      toast.success("Education deleted successfully")
    } else {
      toast.error("Failed to delete education")
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const columns: ColumnDef<Education>[] = [
    {
      accessorKey: "institution",
      header: "Institution",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.logo ? (
            <img
              src={row.original.logo}
              alt={row.original.institution}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <GraduationCap className="h-5 w-5 text-zinc-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {row.original.institution}
            </p>
            <p className="text-sm text-zinc-500">
              {row.original.degree} in {row.original.field}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "gpa",
      header: "GPA",
      cell: ({ row }) =>
        row.original.gpa ? (
          <Badge variant="outline">{row.original.gpa.toFixed(2)}</Badge>
        ) : (
          <span className="text-zinc-400">-</span>
        ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) =>
        row.original.location ? (
          <div className="flex items-center gap-1 text-sm text-zinc-500">
            <MapPin className="h-3 w-3" />
            {row.original.location}
          </div>
        ) : (
          <span className="text-zinc-400">-</span>
        ),
    },
    {
      accessorKey: "startDate",
      header: "Period",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-zinc-500">
          <Calendar className="h-3 w-3" />
          {formatDateShort(row.original.startDate)} - {" "}
          {row.original.isCurrent ? (
            <Badge variant="secondary" className="ml-1">Present</Badge>
          ) : row.original.endDate ? (
            formatDateShort(row.original.endDate)
          ) : (
            "-"
          )}
        </div>
      ),
    },
    {
      accessorKey: "isPublished",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.isPublished ? "published" : "draft"} />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/education/${row.original.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => setDeleteId(row.original.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  if (loading && educations.length === 0) {
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
        title="Education"
        description="Manage your educational background"
        actionLabel="Add Education"
        actionHref="/admin/education/new"
      />

      {educations.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No education yet"
          description="Add your educational background to showcase your academic journey."
          actionLabel="Add Education"
          actionHref="/admin/education/new"
        />
      ) : (
        <DataTable
          columns={columns}
          data={educations}
          searchKey="institution"
          searchPlaceholder="Search education..."
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Education"
        description="Are you sure you want to delete this education? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  )
}
