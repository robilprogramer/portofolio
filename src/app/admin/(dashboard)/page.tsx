"use client"

import { motion } from "framer-motion"
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Eye,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const stats = [
  {
    name: "Total Projects",
    value: "12",
    change: "+2",
    trend: "up",
    icon: FolderKanban,
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Blog Posts",
    value: "24",
    change: "+5",
    trend: "up",
    icon: FileText,
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Messages",
    value: "8",
    change: "+3",
    trend: "up",
    icon: MessageSquare,
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Page Views",
    value: "2.4K",
    change: "-12%",
    trend: "down",
    icon: Eye,
    color: "from-orange-500 to-amber-600",
  },
]

const recentActivity = [
  {
    type: "project",
    title: "E-commerce Platform",
    action: "Updated",
    time: "2 hours ago",
  },
  {
    type: "post",
    title: "Introduction to Next.js 15",
    action: "Published",
    time: "4 hours ago",
  },
  {
    type: "message",
    title: "New message from John Doe",
    action: "Received",
    time: "6 hours ago",
  },
  {
    type: "project",
    title: "Portfolio Redesign",
    action: "Created",
    time: "1 day ago",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Dashboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.name} variants={item}>
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {stat.name}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${stat.color} shadow-lg`}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-zinc-500">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-violet-500" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest updates and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-lg p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                      {activity.type === "project" && (
                        <FolderKanban className="h-5 w-5 text-violet-500" />
                      )}
                      {activity.type === "post" && (
                        <FileText className="h-5 w-5 text-blue-500" />
                      )}
                      {activity.type === "message" && (
                        <MessageSquare className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-zinc-500">{activity.time}</p>
                    </div>
                    <Badge variant="secondary">{activity.action}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-500" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks you can perform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Add Project", href: "/admin/projects/new", icon: FolderKanban, color: "violet" },
                  { name: "Write Post", href: "/admin/posts/new", icon: FileText, color: "blue" },
                  { name: "View Messages", href: "/admin/messages", icon: MessageSquare, color: "green" },
                  { name: "Update Profile", href: "/admin/profile", icon: Users, color: "orange" },
                ].map((action) => (
                  <a
                    key={action.name}
                    href={action.href}
                    className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 hover:bg-zinc-50 hover:border-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800/50 dark:hover:border-zinc-700 transition-all"
                  >
                    <action.icon
                      className={`h-5 w-5 ${
                        action.color === "violet"
                          ? "text-violet-500"
                          : action.color === "blue"
                          ? "text-blue-500"
                          : action.color === "green"
                          ? "text-green-500"
                          : "text-orange-500"
                      }`}
                    />
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {action.name}
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
