"use client"

import { useState, useCallback } from "react"
import { api } from "@/lib/api-client"
import { 
  Experience, 
  ExperienceFormData, 
  ExperienceFilters, 
  ApiResponse, 
  PaginationMeta 
} from "@/types/admin"

interface UseExperiencesReturn {
  experiences: Experience[]
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
  fetchExperiences: (filters?: ExperienceFilters) => Promise<void>
  getExperience: (id: string) => Promise<Experience | null>
  createExperience: (data: ExperienceFormData) => Promise<Experience | null>
  updateExperience: (id: string, data: Partial<ExperienceFormData>) => Promise<Experience | null>
  deleteExperience: (id: string) => Promise<boolean>
}

export function useExperiences(): UseExperiencesReturn {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExperiences = useCallback(async (filters?: ExperienceFilters) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<ApiResponse<Experience[]>>("/experiences", {
        params: {
          page: filters?.page,
          limit: filters?.limit,
          type: filters?.type,
          published: filters?.published,
          current: filters?.current,
        },
      })
      setExperiences(response.data)
      setMeta(response.meta || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch experiences")
    } finally {
      setLoading(false)
    }
  }, [])

  const getExperience = useCallback(async (id: string): Promise<Experience | null> => {
    try {
      const response = await api.get<ApiResponse<Experience>>(`/experiences/${id}`)
      console.log("Fetched experience:", response.data)
      console.log("b",response)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch experience")
      return null
    }
  }, [])

  const createExperience = useCallback(async (data: ExperienceFormData): Promise<Experience | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<ApiResponse<Experience>>("/experiences", data)
      setExperiences((prev) => [response.data, ...prev])
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create experience")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateExperience = useCallback(async (id: string, data: Partial<ExperienceFormData>): Promise<Experience | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put<ApiResponse<Experience>>(`/experiences/${id}`, data)
      setExperiences((prev) =>
        prev.map((e) => (e.id === id ? response.data : e))
      )
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update experience")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteExperience = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/experiences/${id}`)
      setExperiences((prev) => prev.filter((e) => e.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete experience")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    experiences,
    meta,
    loading,
    error,
    fetchExperiences,
    getExperience,
    createExperience,
    updateExperience,
    deleteExperience,
  }
}
