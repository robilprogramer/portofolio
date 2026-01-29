"use client"

import { useState, useCallback } from "react"
import { api } from "@/lib/api-client"
import { 
  Profile, 
  ProfileFormData, 
  ApiResponse 
} from "@/types/admin"

interface UseProfileReturn {
  profile: Profile | null
  loading: boolean
  error: string | null
  fetchProfile: () => Promise<void>
  createProfile: (data: ProfileFormData) => Promise<Profile | null>
  updateProfile: (id: string, data: Partial<ProfileFormData>) => Promise<Profile | null>
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<ApiResponse<Profile>>("/profile")
      setProfile(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile")
    } finally {
      setLoading(false)
    }
  }, [])

  const createProfile = useCallback(async (data: ProfileFormData): Promise<Profile | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<ApiResponse<Profile>>("/profile", data)
      setProfile(response.data)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (id: string, data: Partial<ProfileFormData>): Promise<Profile | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put<ApiResponse<Profile>>(`/profile/${id}`, data)
      setProfile(response.data)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
  }
}
