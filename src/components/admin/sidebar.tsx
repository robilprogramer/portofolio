// "use client"

// import * as React from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { motion } from "framer-motion"
// import {
//   LayoutDashboard,
//   FolderKanban,
//   FileText,
//   Briefcase,
//   GraduationCap,
//   Code2,
//   Award,
//   MessageSquare,
//   Quote,
//   Link2,
//   Settings,
//   User,
//   LogOut,
//   Menu,
//   X,
//   ChevronRight,
//   Sun,
//   Moon,
//   Monitor,
// } from "lucide-react"
// import { signOut, useSession } from "next-auth/react"
// import { useTheme } from "next-themes"
// import { getInitials } from "@/lib/utils"

// const navigation = [
//   { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
//   { name: "Projects", href: "/admin/projects", icon: FolderKanban },
//   { name: "Blog Posts", href: "/admin/posts", icon: FileText },
//   { name: "Experience", href: "/admin/experience", icon: Briefcase },
//   { name: "Education", href: "/admin/education", icon: GraduationCap },
//   { name: "Skills", href: "/admin/skills", icon: Code2 },
//   { name: "Certificates", href: "/admin/certificates", icon: Award },
//   { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
//   { name: "Messages", href: "/admin/messages", icon: MessageSquare },
//   { name: "Social Links", href: "/admin/social-links", icon: Link2 },
//   { name: "Profile", href: "/admin/profile", icon: User },
//   { name: "Settings", href: "/admin/settings", icon: Settings },
// ]

// interface AdminSidebarProps {
//   className?: string
// }

// export function AdminSidebar({ className }: AdminSidebarProps) {
//   const pathname = usePathname()
//   const { data: session } = useSession()
//   const { theme, setTheme } = useTheme()
//   const [isCollapsed, setIsCollapsed] = React.useState(false)
//   const [isMobileOpen, setIsMobileOpen] = React.useState(false)
//   const [mounted, setMounted] = React.useState(false)

//   // Prevent hydration mismatch
//   React.useEffect(() => {
//     setMounted(true)
//   }, [])

//   const cycleTheme = () => {
//     if (theme === "light") setTheme("dark")
//     else if (theme === "dark") setTheme("system")
//     else setTheme("light")
//   }

//   const getThemeIcon = () => {
//     if (!mounted) return <Sun className="h-5 w-5" />
    
//     switch (theme) {
//       case "light":
//         return <Sun className="h-5 w-5" />
//       case "dark":
//         return <Moon className="h-5 w-5" />
//       default:
//         return <Monitor className="h-5 w-5" />
//     }
//   }

//   const getThemeLabel = () => {
//     if (!mounted) return "Light"
    
//     switch (theme) {
//       case "light":
//         return "Light"
//       case "dark":
//         return "Dark"
//       default:
//         return "System"
//     }
//   }

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setIsMobileOpen(true)}
//         className="fixed top-4 left-4 z-50 rounded-lg bg-white p-2 shadow-lg lg:hidden dark:bg-zinc-900"
//       >
//         <Menu className="h-5 w-5" />
//       </button>

//       {/* Mobile Overlay */}
//       {isMobileOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
//           onClick={() => setIsMobileOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <motion.aside
//         initial={false}
//         animate={{ width: isCollapsed ? 80 : 280 }}
//         className={cn(
//           "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
//           "lg:relative lg:translate-x-0",
//           isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
//           className
//         )}
//       >
//         {/* Header */}
//         <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
//           {!isCollapsed && (
//             <motion.span
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-xl font-bold bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"
//             >
//               Portfolio Admin
//             </motion.span>
//           )}
//           <button
//             onClick={() => {
//               if (isMobileOpen) setIsMobileOpen(false)
//               else setIsCollapsed(!isCollapsed)
//             }}
//             className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:block"
//           >
//             {isMobileOpen ? (
//               <X className="h-5 w-5" />
//             ) : (
//               <ChevronRight
//                 className={cn(
//                   "h-5 w-5 transition-transform",
//                   isCollapsed ? "" : "rotate-180"
//                 )}
//               />
//             )}
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto p-3">
//           <ul className="space-y-1">
//             {navigation.map((item) => {
//               const isActive = pathname === item.href || 
//                 (item.href !== "/admin" && pathname.startsWith(item.href))

//               return (
//                 <li key={item.name}>
//                   <Link
//                     href={item.href}
//                     onClick={() => setIsMobileOpen(false)}
//                     className={cn(
//                       "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
//                       isActive
//                         ? "bg-linear-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 dark:text-violet-400"
//                         : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
//                     )}
//                   >
//                     <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-violet-600 dark:text-violet-400")} />
//                     {!isCollapsed && (
//                       <motion.span
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         className="truncate"
//                       >
//                         {item.name}
//                       </motion.span>
//                     )}
//                     {isActive && !isCollapsed && (
//                       <motion.div
//                         layoutId="activeIndicator"
//                         className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-600"
//                       />
//                     )}
//                   </Link>
//                 </li>
//               )
//             })}
//           </ul>
//         </nav>

//         {/* Theme Toggle Section */}
//         <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
//           <button
//             onClick={cycleTheme}
//             className={cn(
//               "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors",
//               isCollapsed && "justify-center"
//             )}
//             title={`Current theme: ${getThemeLabel()}. Click to cycle.`}
//           >
//             {getThemeIcon()}
//             {!isCollapsed && (
//               <span className="flex items-center gap-2">
//                 Theme: <span className="font-semibold">{getThemeLabel()}</span>
//               </span>
//             )}
//           </button>
//         </div>

//         {/* User Section */}
//         <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
//           <div className={cn(
//             "flex items-center gap-3 rounded-lg p-2",
//             isCollapsed ? "justify-center" : ""
//           )}>
//             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-500 text-sm font-medium text-white">
//               {session?.user?.name ? getInitials(session.user.name) : "AD"}
//             </div>
//             {!isCollapsed && (
//               <div className="flex-1 truncate">
//                 <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
//                   {session?.user?.name || "Admin"}
//                 </p>
//                 <p className="text-xs text-zinc-500 truncate">
//                   {session?.user?.email || "admin@example.com"}
//                 </p>
//               </div>
//             )}
//           </div>
//           <button
//             onClick={() => signOut({ callbackUrl: "/login" })}
//             className={cn(
//               "mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors",
//               isCollapsed && "justify-center"
//             )}
//           >
//             <LogOut className="h-5 w-5" />
//             {!isCollapsed && <span>Sign Out</span>}
//           </button>
//         </div>
//       </motion.aside>
//     </>
//   )
// }

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
  MessageSquare,
  Quote,
  Link2,
  Settings,
  User,
  LogOut,
  X,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { getInitials } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Blog Posts", href: "/admin/posts", icon: FileText },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Skills", href: "/admin/skills", icon: Code2 },
  { name: "Certificates", href: "/admin/certificates", icon: Award },
  { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Social Links", href: "/admin/social-links", icon: Link2 },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface AdminSidebarProps {
  className?: string
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export function AdminSidebar({ 
  className, 
  isMobileOpen = false,
  onMobileClose 
}: AdminSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const getThemeIcon = () => {
    if (!mounted) return <Sun className="h-5 w-5" />
    
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5" />
      case "dark":
        return <Moon className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  const getThemeLabel = () => {
    if (!mounted) return "Light"
    
    switch (theme) {
      case "light":
        return "Light"
      case "dark":
        return "Dark"
      default:
        return "System"
    }
  }

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
          "lg:relative lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-300 ease-in-out",
          className
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent"
            >
              Portfolio Admin
            </motion.span>
          )}
          <button
            onClick={() => {
              if (isMobileOpen && onMobileClose) {
                onMobileClose()
              } else {
                setIsCollapsed(!isCollapsed)
              }
            }}
            className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <ChevronRight
                className={cn(
                  "h-5 w-5 transition-transform",
                  isCollapsed ? "" : "rotate-180"
                )}
              />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/admin" && pathname.startsWith(item.href))

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-linear-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 dark:text-violet-400"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-violet-600 dark:text-violet-400")} />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                    {isActive && !isCollapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-600"
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Theme Toggle Section */}
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <button
            onClick={cycleTheme}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors",
              isCollapsed && "justify-center"
            )}
            title={`Current theme: ${getThemeLabel()}. Click to cycle.`}
          >
            {getThemeIcon()}
            {!isCollapsed && (
              <span className="flex items-center gap-2">
                Theme: <span className="font-semibold">{getThemeLabel()}</span>
              </span>
            )}
          </button>
        </div>

        {/* User Section */}
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          <div className={cn(
            "flex items-center gap-3 rounded-lg p-2",
            isCollapsed ? "justify-center" : ""
          )}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-500 text-sm font-medium text-white">
              {session?.user?.name ? getInitials(session.user.name) : "AD"}
            </div>
            {!isCollapsed && (
              <div className="flex-1 truncate">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {session?.user?.email || "admin@example.com"}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={cn(
              "mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors",
              isCollapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}