"use client"

import * as React from "react"
import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  ExternalLink,
  Award,
  Calendar,
} from "lucide-react"
import { useCertificates } from "@/hooks/use-certificates"
import { Certificate } from "@/types/admin"
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

export default function CertificatesPage() {
  const { certificates, loading, error, fetchCertificates, deleteCertificate } = useCertificates()
  const [deleteId, setDeleteId] = React.useState<string | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  React.useEffect(() => {
    fetchCertificates()
  }, [fetchCertificates])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const success = await deleteCertificate(deleteId)
    if (success) {
      toast.success("Certificate deleted successfully")
    } else {
      toast.error("Failed to delete certificate")
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const isExpired = (expiryDate?: string | null) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  const columns: ColumnDef<Certificate>[] = [
    {
      accessorKey: "name",
      header: "Certificate",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.image ? (
            <img
              src={row.original.image}
              alt={row.original.name}
              className="h-10 w-10 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Award className="h-5 w-5 text-zinc-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              {row.original.name}
            </p>
            <p className="text-sm text-zinc-500">{row.original.issuer}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "credentialId",
      header: "Credential ID",
      cell: ({ row }) =>
        row.original.credentialId ? (
          <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
            {row.original.credentialId}
          </code>
        ) : (
          <span className="text-zinc-400">-</span>
        ),
    },
    {
      accessorKey: "issueDate",
      header: "Issue Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-zinc-500">
          <Calendar className="h-3 w-3" />
          {formatDate(row.original.issueDate)}
        </div>
      ),
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry",
      cell: ({ row }) => {
        if (!row.original.expiryDate) {
          return <Badge variant="outline">No Expiry</Badge>
        }
        if (isExpired(row.original.expiryDate)) {
          return (
            <Badge variant="destructive">
              Expired {formatDate(row.original.expiryDate)}
            </Badge>
          )
        }
        return (
          <span className="text-sm text-zinc-500">
            {formatDate(row.original.expiryDate)}
          </span>
        )
      },
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
              <Link href={`/admin/certificates/${row.original.id}`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </DropdownMenuItem>
            {row.original.credentialUrl && (
              <DropdownMenuItem asChild>
                <a href={row.original.credentialUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Credential
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

  if (loading && certificates.length === 0) {
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
        title="Certificates"
        description="Manage your certifications and credentials"
        actionLabel="Add Certificate"
        actionHref="/admin/certificates/new"
      />

      {certificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Add your professional certifications and credentials."
          actionLabel="Add Certificate"
          actionHref="/admin/certificates/new"
        />
      ) : (
        <DataTable
          columns={columns}
          data={certificates}
          searchKey="name"
          searchPlaceholder="Search certificates..."
        />
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Certificate"
        description="Are you sure you want to delete this certificate? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        loading={deleting}
        variant="destructive"
      />
    </div>
  )
}
