"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description?: string
  backHref?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  children?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  backHref,
  actionLabel,
  actionHref,
  onAction,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        {backHref && (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
        )}
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-zinc-500 dark:text-zinc-400">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {actionLabel && (actionHref || onAction) && (
          actionHref ? (
            <Button asChild>
              <Link href={actionHref}>
                <Plus className="mr-2 h-4 w-4" />
                {actionLabel}
              </Link>
            </Button>
          ) : (
            <Button onClick={onAction}>
              <Plus className="mr-2 h-4 w-4" />
              {actionLabel}
            </Button>
          )
        )}
      </div>
    </div>
  )
}
