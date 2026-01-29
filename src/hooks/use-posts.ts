"use client"

import { useState, useCallback } from "react"
import { api } from "@/lib/api-client"
import { 
  Post, 
  PostFormData, 
  PostFilters, 
  ApiResponse, 
  PaginationMeta 
} from "@/types/admin"

interface UsePostsReturn {
  posts: Post[]
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
  fetchPosts: (filters?: PostFilters) => Promise<void>
  getPost: (id: string) => Promise<Post | null>
  createPost: (data: PostFormData) => Promise<Post | null>
  updatePost: (id: string, data: Partial<PostFormData>) => Promise<Post | null>
  deletePost: (id: string) => Promise<boolean>
}

export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<Post[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async (filters?: PostFilters) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<ApiResponse<Post[]>>("/posts", {
        params: {
          page: filters?.page,
          limit: filters?.limit,
          search: filters?.search,
          category: filters?.category,
          tag: filters?.tag,
          featured: filters?.featured,
          published: filters?.published,
        },
      })
      console.log("Fetched posts:", response.data)
      // setPosts(response.data)
       setPosts(response.data || [])
      setMeta(response.meta || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts")
    } finally {
      setLoading(false)
    }
  }, [])

  const getPost = useCallback(async (id: string): Promise<Post | null> => {
    try {
      const response = await api.get<ApiResponse<Post>>(`/posts/${id}`)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch post")
      return null
    }
  }, [])

  const createPost = useCallback(async (data: PostFormData): Promise<Post | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<ApiResponse<Post>>("/posts", data)
      setPosts((prev) => [response.data, ...prev])
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePost = useCallback(async (id: string, data: Partial<PostFormData>): Promise<Post | null> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put<ApiResponse<Post>>(`/posts/${id}`, data)
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? response.data : p))
      )
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePost = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/posts/${id}`)
      setPosts((prev) => prev.filter((p) => p.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    posts,
    meta,
    loading,
    error,
    fetchPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
  }
}
