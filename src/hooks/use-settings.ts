"use client"

import { useState, useCallback } from "react"
import { api } from "@/lib/api-client"
import { 
  Setting, 
  SettingFormData, 
  ApiResponse 
} from "@/types/admin"

interface UseSettingsReturn {
  settings: Setting[]
  loading: boolean
  error: string | null
  fetchSettings: () => Promise<void>
  getSetting: (key: string) => Promise<Setting | null>
  createSetting: (data: SettingFormData) => Promise<Setting | null>
  updateSetting: (id: string, data: Partial<SettingFormData>) => Promise<Setting | null>
  deleteSetting: (id: string) => Promise<boolean>
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<ApiResponse<Setting[]>>("/settings")
      setSettings(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch settings")
    } finally {
      setLoading(false)
    }
  }, [])

  const getSetting = useCallback(async (key: string): Promise<Setting | null> => {
    try {
      const response = await api.get<ApiResponse<Setting>>("/settings", {
        params: { key },
      })
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch setting")
      return null
    }
  }, [])

  const createSetting = useCallback(async (data: SettingFormData): Promise<Setting | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<ApiResponse<Setting>>("/settings", data)
      setSettings((prev) => [...prev, response.data])
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create setting")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSetting = useCallback(async (id: string, data: Partial<SettingFormData>): Promise<Setting | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put<ApiResponse<Setting>>(`/settings/${id}`, data)
      setSettings((prev) =>
        prev.map((s) => (s.id === id ? response.data : s))
      )
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update setting")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteSetting = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/settings/${id}`)
      setSettings((prev) => prev.filter((s) => s.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete setting")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    settings,
    loading,
    error,
    fetchSettings,
    getSetting,
    createSetting,
    updateSetting,
    deleteSetting,
  }
}
