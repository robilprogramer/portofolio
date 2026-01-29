"use client"

import * as React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "./admin-header"
import { AdminFooter } from "./admin-footer"

interface AdminLayoutClientProps {
  children: React.ReactNode
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminSidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex flex-1 flex-col">
        <AdminHeader onMobileMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-12xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
        
        <AdminFooter />
      </div>
    </div>
  )
}