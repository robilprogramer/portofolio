"use client"

import { useState } from "react"
import Link from "next/link"
import { useProjects } from "@/hooks/fe/useApi"
import { ArrowLeft, ArrowRight, Loader2, Layers } from "lucide-react"
import Image from "next/image"

export default function ProjectsPage() {
  const [page, setPage] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>()
  
  const { data, isLoading, error } = useProjects({ 
    page, 
    limit: 9,
    category: categoryFilter 
  })

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load projects</p>
          <Link href="/" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 mt-4 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const projects = data?.data || []
  const pagination = data?.pagination

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800/50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm font-semibold uppercase tracking-widest">
              <Layers className="h-4 w-4" />
              Portfolio
            </span>
            <h1 className="mt-4 text-4xl sm:text-6xl font-black">
              All <span className="text-zinc-500 dark:text-zinc-400">Projects</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Explore my complete portfolio of projects across different technologies and domains.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            <button
              onClick={() => setCategoryFilter(undefined)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !categoryFilter
                  ? 'bg-violet-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              All
            </button>
            {['Web App', 'AI/ML', 'SaaS', 'Mobile', 'API'].map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === category
                    ? 'bg-violet-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            </div>
          ) : projects.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="group relative rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-500 hover:border-violet-500/50 dark:hover:border-zinc-700 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2"
                  >
                    {/* Image */}
                    <div className="relative aspect-video overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
                      <Image
                        fill
                        src={project.thumbnail}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-zinc-50 dark:from-zinc-900 via-zinc-50/50 dark:via-zinc-900/50 to-transparent" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center rounded-full bg-linear-to-r ${project.color || 'from-violet-500 to-purple-600'} px-3 py-1 text-xs font-semibold text-white`}>
                          {project.category}
                        </span>
                      </div>

                      {/* View Count */}
                      <div className="absolute top-4 right-4 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-zinc-600 dark:text-zinc-400 shadow-sm">
                        {project.viewCount} views
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {project.shortDesc}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center rounded-lg bg-zinc-200 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-400"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="inline-flex items-center rounded-lg bg-zinc-200 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-400">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-16">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-violet-500/50 hover:text-zinc-900 dark:hover:text-white transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-full font-medium transition-all ${
                          p === page
                            ? 'bg-violet-600 text-white'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-violet-500/50 hover:text-zinc-900 dark:hover:text-white transition-all"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-500 dark:text-zinc-400">No projects found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}