"use client"

import { useState, useCallback } from "react"
import { api } from "@/lib/api-client"
import { 
  Education, 
  EducationFormData, 
  EducationFilters, 
  ApiResponse, 
  PaginationMeta 
} from "@/types/admin"

interface UseEducationsReturn {
  educations: Education[]
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
  fetchEducations: (filters?: EducationFilters) => Promise<void>
  getEducation: (id: string) => Promise<Education | null>
  createEducation: (data: EducationFormData) => Promise<Education | null>
  updateEducation: (id: string, data: Partial<EducationFormData>) => Promise<Education | null>
  deleteEducation: (id: string) => Promise<boolean>
}

export function useEducations(): UseEducationsReturn {
  const [educations, setEducations] = useState<Education[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEducations = useCallback(async (filters?: EducationFilters) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<ApiResponse<Education[]>>("/educations", {
        params: {
          page: filters?.page,
          limit: filters?.limit,
          published: filters?.published,
          current: filters?.current,
        },
      })
      setEducations(response.data)
      setMeta(response.meta || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch educations")
    } finally {
      setLoading(false)
    }
  }, [])

  const getEducation = useCallback(async (id: string): Promise<Education | null> => {
    try {
      const response = await api.get<ApiResponse<Education>>(`/educations/${id}`)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch education")
      return null
    }
  }, [])

  const createEducation = useCallback(async (data: EducationFormData): Promise<Education | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<ApiResponse<Education>>("/educations", data)
      setEducations((prev) => [response.data, ...prev])
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create education")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEducation = useCallback(async (id: string, data: Partial<EducationFormData>): Promise<Education | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put<ApiResponse<Education>>(`/educations/${id}`, data)
      setEducations((prev) =>
        prev.map((e) => (e.id === id ? response.data : e))
      )
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update education")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteEducation = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/educations/${id}`)
      setEducations((prev) => prev.filter((e) => e.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete education")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    educations,
    meta,
    loading,
    error,
    fetchEducations,
    getEducation,
    createEducation,
    updateEducation,
    deleteEducation,
  }
}
