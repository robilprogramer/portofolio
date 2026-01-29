"use client"

import * as React from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  ExternalLink,
  FolderKanban,
  Star,
} from "lucide-react"
import { useProjects } from "@/hooks/use-projects"
import { Project } from "@/types/admin"
import { formatDate } from "@/lib/utils"
import { PageHeader } from "@/components/admin/page-header"
import { DataTable } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { ConfirmDialog } from "@/components/admin/confirm-dialog"
import { EmptyState } from "@/components/admin/empty-state"
import { LoadingPage } from "@/components/admin/loading-spinner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export default function ProjectsPage() {
  const { projects, loading, error, fetchProjects, deleteProject } = useProjects()
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const success = await deleteProject(deleteId)
    if (success) {
      toast.success("Project deleted successfully")
    } else {
      toast.error("Failed to delete project")
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const columns: ColumnDef<Project>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.thumbnail ? (
            <img
              src={row.original.thumbnail}
              alt={row.original.title}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <FolderKanban className="h-5 w-5 text-zinc-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {row.original.title}
            </p>
            <p className="text-xs text-zinc-500">{row.original.category}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "isPublished",
      header: "Published",
      cell: ({ row }) => (
        <StatusBadge status={row.original.isPublished ? "published" : "draft"} />
      ),
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) =>
        row.original.featured ? (
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        ) : (
          <Star className="h-4 w-4 text-zinc-300" />
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-zinc-500">
          {formatDate(row.original.createdAt)}
        </span>
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
              <Link href={`/admin/projects/${row.original.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/projects/${row.original.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            {row.original.liveUrl && (
              <DropdownMenuItem asChild>
                <a href={row.original.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </DropdownMenuItem>
            )}
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

  if (loading && projects.length === 0) {
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
        title="Projects"
        description="Manage your portfolio projects"
        actionLabel="Add Project"
        actionHref="/admin/projects/new"
      />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Get started by creating your first project to showcase in your portfolio."
          actionLabel="Add Project"
          actionHref="/admin/projects/new"
        />
      ) : (
        <DataTable
          columns={columns}
          data={projects}
          searchKey="title"
          searchPlaceholder="Search projects..."
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  )
}
