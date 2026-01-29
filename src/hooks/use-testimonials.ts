"use client"

import { useState, useCallback } from "react"
import { api } from "@/lib/api-client"
import { 
  Testimonial, 
  TestimonialFormData, 
  ApiResponse 
} from "@/types/admin"

interface UseTestimonialsReturn {
  testimonials: Testimonial[]
  loading: boolean
  error: string | null
  fetchTestimonials: (featured?: boolean, published?: boolean) => Promise<void>
  getTestimonial: (id: string) => Promise<Testimonial | null>
  createTestimonial: (data: TestimonialFormData) => Promise<Testimonial | null>
  updateTestimonial: (id: string, data: Partial<TestimonialFormData>) => Promise<Testimonial | null>
  deleteTestimonial: (id: string) => Promise<boolean>
}

export function useTestimonials(): UseTestimonialsReturn {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTestimonials = useCallback(async (featured?: boolean, published?: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<ApiResponse<Testimonial[]>>("/testimonials", {
        params: { featured, published },
      })
      setTestimonials(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch testimonials")
    } finally {
      setLoading(false)
    }
  }, [])

  const getTestimonial = useCallback(async (id: string): Promise<Testimonial | null> => {
    try {
      const response = await api.get<ApiResponse<Testimonial>>(`/testimonials/${id}`)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch testimonial")
      return null
    }
  }, [])

  const createTestimonial = useCallback(async (data: TestimonialFormData): Promise<Testimonial | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<ApiResponse<Testimonial>>("/testimonials", data)
      setTestimonials((prev) => [...prev, response.data])
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create testimonial")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateTestimonial = useCallback(async (id: string, data: Partial<TestimonialFormData>): Promise<Testimonial | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put<ApiResponse<Testimonial>>(`/testimonials/${id}`, data)
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? response.data : t))
      )
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update testimonial")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTestimonial = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/testimonials/${id}`)
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete testimonial")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    testimonials,
    loading,
    error,
    fetchTestimonials,
    getTestimonial,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  }
}
