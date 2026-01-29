"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Github,
  Filter,
  Grid3X3,
  List,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"

// Demo data - in production this comes from API
const demoProjects = [
  {
    id: "1",
    title: "E-Commerce Platform",
    slug: "e-commerce-platform",
    description: "A full-featured e-commerce platform built with Next.js, featuring cart functionality, payment integration, and admin dashboard.",
    thumbnail: "https://images.unsplash.com/photo-1557821552-17105176677c?w=600",
    techStack: ["Next.js", "TypeScript", "Prisma", "Stripe"],
    category: "Web App",
    featured: true,
    status: "COMPLETED",
    views: 1234,
    isPublished: true,
  },
  {
    id: "2",
    title: "Task Management App",
    slug: "task-management-app",
    description: "A collaborative task management application with real-time updates, team collaboration features, and progress tracking.",
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600",
    techStack: ["React", "Node.js", "Socket.io", "MongoDB"],
    category: "Web App",
    featured: false,
    status: "IN_PROGRESS",
    views: 856,
    isPublished: true,
  },
  {
    id: "3",
    title: "AI Chat Assistant",
    slug: "ai-chat-assistant",
    description: "An intelligent chatbot powered by GPT with context awareness and multi-language support.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600",
    techStack: ["Python", "FastAPI", "OpenAI", "Redis"],
    category: "AI/ML",
    featured: true,
    status: "COMPLETED",
    views: 2341,
    isPublished: true,
  },
  {
    id: "4",
    title: "Mobile Fitness App",
    slug: "mobile-fitness-app",
    description: "A cross-platform mobile app for tracking workouts, nutrition, and health metrics.",
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
    techStack: ["React Native", "Expo", "Firebase", "TensorFlow"],
    category: "Mobile",
    featured: false,
    status: "COMPLETED",
    views: 678,
    isPublished: false,
  },
]

type ViewMode = "grid" | "list"

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState(demoProjects)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")
  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen: boolean
    projectId: string | null
  }>({ isOpen: false, projectId: null })
  const [activeTab, setActiveTab] = React.useState("all")

  const filteredProjects = React.useMemo(() => {
    let filtered = projects

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by tab
    if (activeTab === "published") {
      filtered = filtered.filter((p) => p.isPublished)
    } else if (activeTab === "draft") {
      filtered = filtered.filter((p) => !p.isPublished)
    } else if (activeTab === "featured") {
      filtered = filtered.filter((p) => p.featured)
    }

    return filtered
  }, [projects, searchQuery, activeTab])

  const handleDelete = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId))
    setDeleteModal({ isOpen: false, projectId: null })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="success">Completed</Badge>
      case "IN_PROGRESS":
        return <Badge variant="warning">In Progress</Badge>
      case "ON_HOLD":
        return <Badge variant="secondary">On Hold</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Projects
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-2 transition-colors ${
                    viewMode === "grid"
                      ? "bg-zinc-100 dark:bg-zinc-800"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-2 transition-colors ${
                    viewMode === "list"
                      ? "bg-zinc-100 dark:bg-zinc-800"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All ({projects.length})
          </TabsTrigger>
          <TabsTrigger value="published">
            Published ({projects.filter((p) => p.isPublished).length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft ({projects.filter((p) => !p.isPublished).length})
          </TabsTrigger>
          <TabsTrigger value="featured">
            Featured ({projects.filter((p) => p.featured).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <ProjectsGrid
            projects={filteredProjects}
            viewMode={viewMode}
            onDelete={(id) => setDeleteModal({ isOpen: true, projectId: id })}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="published" className="mt-0">
          <ProjectsGrid
            projects={filteredProjects}
            viewMode={viewMode}
            onDelete={(id) => setDeleteModal({ isOpen: true, projectId: id })}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="draft" className="mt-0">
          <ProjectsGrid
            projects={filteredProjects}
            viewMode={viewMode}
            onDelete={(id) => setDeleteModal({ isOpen: true, projectId: id })}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="featured" className="mt-0">
          <ProjectsGrid
            projects={filteredProjects}
            viewMode={viewMode}
            onDelete={(id) => setDeleteModal({ isOpen: true, projectId: id })}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
      </Tabs>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, projectId: null })}
      >
        <ModalHeader onClose={() => setDeleteModal({ isOpen: false, projectId: null })}>
          Delete Project
        </ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ isOpen: false, projectId: null })}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              deleteModal.projectId && handleDelete(deleteModal.projectId)
            }
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

interface ProjectsGridProps {
  projects: typeof demoProjects
  viewMode: ViewMode
  onDelete: (id: string) => void
  getStatusBadge: (status: string) => React.ReactNode
}

function ProjectsGrid({
  projects,
  viewMode,
  onDelete,
  getStatusBadge,
}: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
          <Search className="h-8 w-8 text-zinc-400" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          No projects found
        </h3>
        <p className="mt-2 text-sm text-zinc-500">
          Try adjusting your search or filter to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-2">
        <AnimatePresence>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="h-16 w-24 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <Badge variant="gradient">Featured</Badge>
                        )}
                        {getStatusBadge(project.status)}
                      </div>
                      <p className="text-sm text-zinc-500 truncate mt-1">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.techStack.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.techStack.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-500 flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {project.views}
                      </span>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="h-8">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                  <div className="flex gap-1">
                    <button className="rounded-full bg-white/90 p-2 hover:bg-white transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button className="rounded-full bg-white/90 p-2 hover:bg-white transition-colors">
                      <Github className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {project.featured && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="gradient">Featured</Badge>
                  </div>
                )}
                {!project.isPublished && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary">Draft</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {project.title}
                      </h3>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  </div>
                  <button className="rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <MoreVertical className="h-4 w-4 text-zinc-500" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.techStack.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.techStack.length - 4}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm text-zinc-500 flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {project.views} views
                  </span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
