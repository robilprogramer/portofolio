"use client"

import { useState, useCallback } from "react"
import { api } from "@/lib/api-client"
import { 
  Certificate, 
  CertificateFormData, 
  ApiResponse 
} from "@/types/admin"

interface UseCertificatesReturn {
  certificates: Certificate[]
  loading: boolean
  error: string | null
  fetchCertificates: (published?: boolean) => Promise<void>
  getCertificate: (id: string) => Promise<Certificate | null>
  createCertificate: (data: CertificateFormData) => Promise<Certificate | null>
  updateCertificate: (id: string, data: Partial<CertificateFormData>) => Promise<Certificate | null>
  deleteCertificate: (id: string) => Promise<boolean>
}

export function useCertificates(): UseCertificatesReturn {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCertificates = useCallback(async (published?: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<ApiResponse<Certificate[]>>("/certificates", {
        params: { published },
      })
      setCertificates(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch certificates")
    } finally {
      setLoading(false)
    }
  }, [])

  const getCertificate = useCallback(async (id: string): Promise<Certificate | null> => {
    try {
      const response = await api.get<ApiResponse<Certificate>>(`/certificates/${id}`)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch certificate")
      return null
    }
  }, [])

  const createCertificate = useCallback(async (data: CertificateFormData): Promise<Certificate | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<ApiResponse<Certificate>>("/certificates", data)
      setCertificates((prev) => [...prev, response.data])
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create certificate")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCertificate = useCallback(async (id: string, data: Partial<CertificateFormData>): Promise<Certificate | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put<ApiResponse<Certificate>>(`/certificates/${id}`, data)
      setCertificates((prev) =>
        prev.map((c) => (c.id === id ? response.data : c))
      )
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update certificate")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCertificate = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/certificates/${id}`)
      setCertificates((prev) => prev.filter((c) => c.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete certificate")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    certificates,
    loading,
    error,
    fetchCertificates,
    getCertificate,
    createCertificate,
    updateCertificate,
    deleteCertificate,
  }
}
