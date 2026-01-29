"use client"

import { useState, useCallback } from "react"
import { api } from "@/lib/api-client"
import { 
  Project, 
  ProjectFormData, 
  ProjectFilters, 
  ApiResponse, 
  PaginationMeta 
} from "@/types/admin"

interface UseProjectsReturn {
  projects: Project[]
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
  fetchProjects: (filters?: ProjectFilters) => Promise<void>
  getProject: (id: string) => Promise<Project | null>
  createProject: (data: ProjectFormData) => Promise<Project | null>
  updateProject: (id: string, data: Partial<ProjectFormData>) => Promise<Project | null>
  deleteProject: (id: string) => Promise<boolean>
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async (filters?: ProjectFilters) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<ApiResponse<Project[]>>("/projects", {
        params: {
          page: filters?.page,
          limit: filters?.limit,
          search: filters?.search,
          category: filters?.category,
          status: filters?.status,
          featured: filters?.featured,
          published: filters?.published,
        },
      })
      setProjects(response.data)
      setMeta(response.meta || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects")
    } finally {
      setLoading(false)
    }
  }, [])

  const getProject = useCallback(async (id: string): Promise<Project | null> => {
    try {
      const response = await api.get<ApiResponse<Project>>(`/projects/${id}`)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch project")
      return null
    }
  }, [])

  const createProject = useCallback(async (data: ProjectFormData): Promise<Project | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<ApiResponse<Project>>("/projects", data)
      setProjects((prev) => [response.data, ...prev])
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create project")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProject = useCallback(async (id: string, data: Partial<ProjectFormData>): Promise<Project | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, data)
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? response.data : p))
      )
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update project")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/projects/${id}`)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    projects,
    meta,
    loading,
    error,
    fetchProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
  }
}
