
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Providers } from "@/components/providers"
import { AdminLayoutClient } from "@/components/admin/admin-layout-client"
export const metadata = {
  title: "Admin Dashboard",
  description: "Portfolio Admin Dashboard",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side session check (this runs on every request)
  const session = await getSession()

  // If no session, redirect to login
  // Note: Middleware should handle this, but this is a fallback
  if (!session) {
    redirect("/login")
  }

  // Optional: Check for specific roles
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/unauthorized")
  }

  return (
    <Providers>
      <AdminLayoutClient>
        {children}
      </AdminLayoutClient>
    </Providers>
  )
}