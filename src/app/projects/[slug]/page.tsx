"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useProject, useIncrementProjectViews } from "@/hooks/fe/useApi"
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Loader2, Eye } from "lucide-react"

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const { data: project, isLoading, error } = useProject(params.slug)
  const { mutate: incrementViews } = useIncrementProjectViews()

  useEffect(() => {
    if (project) {
      // Increment view count when project loads
      incrementViews(params.slug)
    }
  }, [project, params.slug, incrementViews])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-zinc-400 mb-6">The project you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/projects" 
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link 
            href="/projects" 
            className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Projects
          </Link>
          
          <div className="flex items-center gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-violet-500/50 hover:text-white transition-all"
              >
                <Github className="h-4 w-4" />
                <span className="hidden sm:inline">Code</span>
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-violet-500/30 transition-all"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`inline-flex items-center rounded-full bg-gradient-to-r ${project.color || 'from-violet-500 to-purple-600'} px-4 py-1.5 text-sm font-semibold text-white`}>
                {project.category}
              </span>
              <div className="flex items-center gap-2 text-zinc-500">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{project.viewCount} views</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black mb-6">
              {project.title}
            </h1>

            <p className="text-xl text-zinc-400 mb-8 max-w-3xl">
              {project.shortDesc}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 text-sm text-zinc-400">
              {project.client && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Client: {project.client}</span>
                </div>
              )}
              {project.role && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Role: {project.role}</span>
                </div>
              )}
              {project.startDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                    {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Main Image */}
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-16 border border-zinc-800">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              {project.longDesc && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">About the Project</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-zinc-400 leading-relaxed">{project.longDesc}</p>
                  </div>
                </div>
              )}

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                  <ul className="space-y-3">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                          ✓
                        </span>
                        <span className="text-zinc-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Challenges & Solutions */}
              {(project.challenges || project.solutions) && (
                <div className="grid md:grid-cols-2 gap-8">
                  {project.challenges && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Challenges</h2>
                      <p className="text-zinc-400 leading-relaxed">{project.challenges}</p>
                    </div>
                  )}
                  {project.solutions && (
                    <div>
                      <h2 className="text-xl font-bold mb-4">Solutions</h2>
                      <p className="text-zinc-400 leading-relaxed">{project.solutions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Images */}
              {project.images && project.images.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {project.images.map((image, index) => (
                      <div 
                        key={index} 
                        className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800"
                      >
                        <img
                          src={image}
                          alt={`${project.title} screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tech Stack */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-lg font-bold mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-lg bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-lg font-bold mb-4">Project Links</h3>
                <div className="space-y-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-violet-400" />
                      <span className="text-sm font-medium">Live Demo</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    >
                      <Github className="h-5 w-5 text-violet-400" />
                      <span className="text-sm font-medium">Source Code</span>
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 transition-colors"
                    >
                      <ExternalLink className="h-5 w-5 text-violet-400" />
                      <span className="text-sm font-medium">Video Demo</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
                <h3 className="text-lg font-bold mb-4">Project Info</h3>
                <div className="space-y-3 text-sm">
                  {project.teamSize && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Team Size</span>
                      <span className="text-zinc-300">{project.teamSize}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Category</span>
                    <span className="text-zinc-300">{project.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Views</span>
                    <span className="text-zinc-300">{project.viewCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
