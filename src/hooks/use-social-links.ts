"use client"

import { useState, useCallback } from "react"
import { api } from "@/lib/api-client"
import { 
  SocialLink, 
  SocialLinkFormData, 
  ApiResponse 
} from "@/types/admin"

interface UseSocialLinksReturn {
  socialLinks: SocialLink[]
  loading: boolean
  error: string | null
  fetchSocialLinks: (published?: boolean) => Promise<void>
  getSocialLink: (id: string) => Promise<SocialLink | null>
  createSocialLink: (data: SocialLinkFormData) => Promise<SocialLink | null>
  updateSocialLink: (id: string, data: Partial<SocialLinkFormData>) => Promise<SocialLink | null>
  deleteSocialLink: (id: string) => Promise<boolean>
}

export function useSocialLinks(): UseSocialLinksReturn {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSocialLinks = useCallback(async (published?: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<ApiResponse<SocialLink[]>>("/social-links", {
        params: { published },
      })
      setSocialLinks(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch social links")
    } finally {
      setLoading(false)
    }
  }, [])

  const getSocialLink = useCallback(async (id: string): Promise<SocialLink | null> => {
    try {
      const response = await api.get<ApiResponse<SocialLink>>(`/social-links/${id}`)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch social link")
      return null
    }
  }, [])

  const createSocialLink = useCallback(async (data: SocialLinkFormData): Promise<SocialLink | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<ApiResponse<SocialLink>>("/social-links", data)
      setSocialLinks((prev) => [...prev, response.data])
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create social link")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSocialLink = useCallback(async (id: string, data: Partial<SocialLinkFormData>): Promise<SocialLink | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put<ApiResponse<SocialLink>>(`/social-links/${id}`, data)
      setSocialLinks((prev) =>
        prev.map((s) => (s.id === id ? response.data : s))
      )
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update social link")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteSocialLink = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/social-links/${id}`)
      setSocialLinks((prev) => prev.filter((s) => s.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete social link")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    socialLinks,
    loading,
    error,
    fetchSocialLinks,
    getSocialLink,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink,
  }
}
