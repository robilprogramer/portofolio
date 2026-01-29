"use client"

import { useState, useCallback } from "react"
import { api } from "@/lib/api-client"
import { 
  Skill, 
  SkillFormData, 
  SkillFilters, 
  ApiResponse 
} from "@/types/admin"

interface UseSkillsReturn {
  skills: Skill[]
  loading: boolean
  error: string | null
  fetchSkills: (filters?: SkillFilters) => Promise<void>
  getSkill: (id: string) => Promise<Skill | null>
  createSkill: (data: SkillFormData) => Promise<Skill | null>
  updateSkill: (id: string, data: Partial<SkillFormData>) => Promise<Skill | null>
  deleteSkill: (id: string) => Promise<boolean>
}

export function useSkills(): UseSkillsReturn {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSkills = useCallback(async (filters?: SkillFilters) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<ApiResponse<Skill[]>>("/skills", {
        params: {
          category: filters?.category,
          published: filters?.published,
        },
      })
      setSkills(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch skills")
    } finally {
      setLoading(false)
    }
  }, [])

  const getSkill = useCallback(async (id: string): Promise<Skill | null> => {
    try {
      const response = await api.get<ApiResponse<Skill>>(`/skills/${id}`)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch skill")
      return null
    }
  }, [])

  const createSkill = useCallback(async (data: SkillFormData): Promise<Skill | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<ApiResponse<Skill>>("/skills", data)
      setSkills((prev) => [...prev, response.data])
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create skill")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSkill = useCallback(async (id: string, data: Partial<SkillFormData>): Promise<Skill | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put<ApiResponse<Skill>>(`/skills/${id}`, data)
      setSkills((prev) =>
        prev.map((s) => (s.id === id ? response.data : s))
      )
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update skill")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteSkill = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/skills/${id}`)
      setSkills((prev) => prev.filter((s) => s.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete skill")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    skills,
    loading,
    error,
    fetchSkills,
    getSkill,
    createSkill,
    updateSkill,
    deleteSkill,
  }
}
