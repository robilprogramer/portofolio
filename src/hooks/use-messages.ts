"use client"

import { useState, useCallback } from "react"
import { api } from "@/lib/api-client"
import { 
  Message, 
  MessageFilters, 
  ApiResponse, 
  PaginationMeta 
} from "@/types/admin"

interface UseMessagesReturn {
  messages: Message[]
  meta: PaginationMeta | null
  loading: boolean
  error: string | null
  fetchMessages: (filters?: MessageFilters) => Promise<void>
  getMessage: (id: string) => Promise<Message | null>
  markAsRead: (id: string) => Promise<boolean>
  toggleStar: (id: string, isStarred: boolean) => Promise<boolean>
  toggleArchive: (id: string, isArchived: boolean) => Promise<boolean>
  markAsReplied: (id: string) => Promise<boolean>
  deleteMessage: (id: string) => Promise<boolean>
}

export function useMessages(): UseMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async (filters?: MessageFilters) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<ApiResponse<Message[]>>("/messages", {
        params: {
          page: filters?.page,
          limit: filters?.limit,
          isRead: filters?.isRead,
          isArchived: filters?.isArchived,
          isStarred: filters?.isStarred,
        },
      })
      setMessages(response.data)
      setMeta(response.meta || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages")
    } finally {
      setLoading(false)
    }
  }, [])

  const getMessage = useCallback(async (id: string): Promise<Message | null> => {
    try {
      const response = await api.get<ApiResponse<Message>>(`/messages/${id}`)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch message")
      return null
    }
  }, [])

  const markAsRead = useCallback(async (id: string): Promise<boolean> => {
    try {
      await api.put(`/messages/${id}`, { isRead: true })
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      )
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as read")
      return false
    }
  }, [])

  const toggleStar = useCallback(async (id: string, isStarred: boolean): Promise<boolean> => {
    try {
      await api.put(`/messages/${id}`, { isStarred })
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isStarred } : m))
      )
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle star")
      return false
    }
  }, [])

  const toggleArchive = useCallback(async (id: string, isArchived: boolean): Promise<boolean> => {
    try {
      await api.put(`/messages/${id}`, { isArchived })
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isArchived } : m))
      )
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle archive")
      return false
    }
  }, [])

  const markAsReplied = useCallback(async (id: string): Promise<boolean> => {
    try {
      await api.put(`/messages/${id}`, { repliedAt: new Date().toISOString() })
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, repliedAt: new Date().toISOString() } : m))
      )
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as replied")
      return false
    }
  }, [])

  const deleteMessage = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/messages/${id}`)
      setMessages((prev) => prev.filter((m) => m.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete message")
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    messages,
    meta,
    loading,
    error,
    fetchMessages,
    getMessage,
    markAsRead,
    toggleStar,
    toggleArchive,
    markAsReplied,
    deleteMessage,
  }
}
