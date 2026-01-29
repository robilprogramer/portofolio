"use client"

import * as React from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye,
  FileText,
  Star,
  Clock,
} from "lucide-react"
import { usePosts } from "@/hooks/use-posts"
import { Post } from "@/types/admin"
import { formatDate } from "@/lib/utils"
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

export default function PostsPage() {
  const { posts, loading, error, fetchPosts, deletePost } = usePosts()
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const success = await deletePost(deleteId)
    if (success) {
      toast.success("Post deleted successfully")
    } else {
      toast.error("Failed to delete post")
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const columns: ColumnDef<Post>[] = [
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
              <FileText className="h-5 w-5 text-zinc-500" />
            </div>
          )}
          <div className="min-w-0">
            <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {row.original.title}
            </p>
            <p className="text-xs text-zinc-500">{row.original.category}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {row.original.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{row.original.tags.length - 2}
            </Badge>
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
      accessorKey: "readTime",
      header: "Read Time",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-zinc-500">
          <Clock className="h-3 w-3" />
          {row.original.readTime} min
        </div>
      ),
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => (
        <span className="text-sm text-zinc-500">
          {row.original.views.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "publishedAt",
      header: "Published",
      cell: ({ row }) => (
        <span className="text-sm text-zinc-500">
          {row.original.publishedAt ? formatDate(row.original.publishedAt) : "-"}
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
              <Link href={`/admin/posts/${row.original.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/posts/${row.original.id}/edit`}>
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

  if (loading && posts.length === 0) {
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
        title="Blog Posts"
        description="Manage your blog posts and articles"
        actionLabel="New Post"
        actionHref="/admin/posts/new"
      />

      {posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No posts yet"
          description="Start writing and sharing your thoughts with the world."
          actionLabel="Write Post"
          actionHref="/admin/posts/new"
        />
      ) : (
        <DataTable
          columns={columns}
          data={posts}
          searchKey="title"
          searchPlaceholder="Search posts..."
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  )
}
