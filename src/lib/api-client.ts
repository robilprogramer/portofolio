const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api/admin"

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }
}

function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(`${API_URL}${endpoint}`, window.location.origin)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.append(key, String(value))
      }
    })
  }
  
  return url.toString()
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: unknown
    try {
      errorData = await response.json()
    } catch {
      errorData = null
    }
    
    const message = (errorData as { message?: string })?.message || response.statusText
    throw new ApiError(response.status, message, errorData)
  }
  
  if (response.status === 204) {
    return {} as T
  }
  
  return response.json()
}

export const api = {
  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {}
    const url = buildUrl(endpoint, params)
    
    const response = await fetch(url, {
      ...fetchOptions,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions?.headers,
      },
    })
    
    return handleResponse<T>(response)
  },

  async post<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {}
    const url = buildUrl(endpoint, params)
    
    const response = await fetch(url, {
      ...fetchOptions,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    })
    
    return handleResponse<T>(response)
  },

  async put<T>(endpoint: string, data?: unknown, options?: FetchOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {}
    const url = buildUrl(endpoint, params)
    
    const response = await fetch(url, {
      ...fetchOptions,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    })
    
    return handleResponse<T>(response)
  },

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {}
    const url = buildUrl(endpoint, params)
    
    const response = await fetch(url, {
      ...fetchOptions,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions?.headers,
      },
    })
    
    return handleResponse<T>(response)
  },
}

export { ApiError }
