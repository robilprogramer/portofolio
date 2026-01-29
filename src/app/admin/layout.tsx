// import { redirect } from "next/navigation"
// import { getSession } from "@/lib/auth"
// import { AdminSidebar } from "@/components/admin/sidebar"
// import { Providers } from "@/components/providers"

// export const metadata = {
//   title: "Admin Dashboard",
//   description: "Portfolio Admin Dashboard",
// }

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   // Server-side session check (this runs on every request)
//   const session = await getSession()

//   // If no session, redirect to login
//   // Note: Middleware should handle this, but this is a fallback
//   if (!session) {
//     redirect("/login")
//   }

//   // Optional: Check for specific roles
//   if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
//     redirect("/unauthorized")
//   }

//   return (
//     <Providers>
//       <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
//         <AdminSidebar />
//         <main className="flex-1 overflow-auto">
//           <div className="mx-auto max-w-7xl p-6 lg:p-8">
//             {children}
//           </div>
//         </main>
//       </div>
//     </Providers>
//   )
// }

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