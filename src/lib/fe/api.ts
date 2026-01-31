import {
  Profile,
  Project,
  ProjectFilters,
  BlogPost,
  BlogPostFilters,
  Experience,
  Education,
  Skill,
  SkillFilters,
  Certificate,
  Testimonial,
  TestimonialFilters,
  SocialLink,
  ContactMessage,
  ContactMessageResponse,
  SiteSettings,
  PageViewData,
  AnalyticsStats,
  AnalyticsFilters,
  ApiResponse,
  PaginatedResponse,
} from '@/types/fe'

// ═══════════════════════════════════════════════════════════════════════════
// API CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const API_PUBLIC_PREFIX = '/api/public'

// ═══════════════════════════════════════════════════════════════════════════
// FETCH WRAPPER WITH ERROR HANDLING
// ═══════════════════════════════════════════════════════════════════════════

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${API_PUBLIC_PREFIX}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || 'An error occurred',
        data
      )
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, 'Network error or server is unavailable')
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE API
// ═══════════════════════════════════════════════════════════════════════════

export const profileApi = {
  async getProfile(): Promise<Profile> {
    const response = await fetchApi<ApiResponse<Profile>>('/profile')
    return response.data
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECTS API
// ═══════════════════════════════════════════════════════════════════════════

export const projectsApi = {
  async getAll(filters?: ProjectFilters): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.limit) params.append('limit', String(filters.limit))
    if (filters?.category) params.append('category', filters.category)
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured))

    const queryString = params.toString()
    const endpoint = `/projects${queryString ? `?${queryString}` : ''}`
    
    const response = await fetchApi<ApiResponse<PaginatedResponse<Project>>>(endpoint)
    return response.data
  },

  async getBySlug(slug: string): Promise<Project> {
    const response = await fetchApi<ApiResponse<Project>>(`/projects/${slug}`)
    return response.data
  },

  async incrementViews(slug: string): Promise<void> {
    await fetchApi(`/projects/${slug}/view`, {
      method: 'POST',
    })
  },

  async getFeatured(limit: number = 6): Promise<Project[]> {
    const response = await this.getAll({ featured: true, limit })
    return response.data
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOG POSTS API
// ═══════════════════════════════════════════════════════════════════════════

export const postsApi = {
  async getAll(filters?: BlogPostFilters): Promise<PaginatedResponse<BlogPost>> {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.limit) params.append('limit', String(filters.limit))
    if (filters?.category) params.append('category', filters.category)
    if (filters?.tag) params.append('tag', filters.tag)
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured))

    const queryString = params.toString()
    const endpoint = `/posts${queryString ? `?${queryString}` : ''}`
    
    const response = await fetchApi<ApiResponse<PaginatedResponse<BlogPost>>>(endpoint)
    return response.data
  },

  async getBySlug(slug: string): Promise<BlogPost> {
    const response = await fetchApi<ApiResponse<BlogPost>>(`/posts/${slug}`)
    return response.data
  },

  async incrementViews(slug: string): Promise<void> {
    await fetchApi(`/posts/${slug}/view`, {
      method: 'POST',
    })
  },

  async getFeatured(limit: number = 6): Promise<BlogPost[]> {
    const response = await this.getAll({ featured: true, limit })
    return response.data
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPERIENCE API
// ═══════════════════════════════════════════════════════════════════════════

export const experienceApi = {
  async getAll(): Promise<Experience[]> {
    const response = await fetchApi<ApiResponse<Experience[]>>('/experiences')
    return response.data
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// EDUCATION API
// ═══════════════════════════════════════════════════════════════════════════

export const educationApi = {
  async getAll(): Promise<Education[]> {
    const response = await fetchApi<ApiResponse<Education[]>>('/education')
    return response.data
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// SKILLS API
// ═══════════════════════════════════════════════════════════════════════════

export const skillsApi = {
  async getAll(filters?: SkillFilters): Promise<Skill[]> {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)

    const queryString = params.toString()
    const endpoint = `/skills${queryString ? `?${queryString}` : ''}`
    
    const response = await fetchApi<ApiResponse<Skill[]>>(endpoint)
    return response.data
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// CERTIFICATES API
// ═══════════════════════════════════════════════════════════════════════════

export const certificatesApi = {
  async getAll(): Promise<Certificate[]> {
    const response = await fetchApi<ApiResponse<Certificate[]>>('/certificates')
    return response.data
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS API
// ═══════════════════════════════════════════════════════════════════════════

export const testimonialsApi = {
  async getAll(filters?: TestimonialFilters): Promise<Testimonial[]> {
    const params = new URLSearchParams()
    if (filters?.featured !== undefined) params.append('featured', String(filters.featured))

    const queryString = params.toString()
    const endpoint = `/testimonials${queryString ? `?${queryString}` : ''}`
    
    const response = await fetchApi<ApiResponse<Testimonial[]>>(endpoint)
    return response.data
  },

  async getFeatured(): Promise<Testimonial[]> {
    return this.getAll({ featured: true })
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL LINKS API
// ═══════════════════════════════════════════════════════════════════════════

export const socialLinksApi = {
  async getAll(): Promise<SocialLink[]> {
    const response = await fetchApi<ApiResponse<SocialLink[]>>('/social-links')
    return response.data
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT API
// ═══════════════════════════════════════════════════════════════════════════

export const contactApi = {
  async sendMessage(message: ContactMessage): Promise<ContactMessageResponse> {
    const response = await fetchApi<ApiResponse<ContactMessageResponse>>('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    })
    return response.data
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS API
// ═══════════════════════════════════════════════════════════════════════════

export const settingsApi = {
  async getPublicSettings(): Promise<SiteSettings> {
    const response = await fetchApi<ApiResponse<SiteSettings>>('/settings')
    return response.data
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS API
// ═══════════════════════════════════════════════════════════════════════════

export const analyticsApi = {
  async trackPageView(data: PageViewData): Promise<void> {
    await fetchApi('/analytics/pageview', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async getStats(filters?: AnalyticsFilters): Promise<AnalyticsStats> {
    const params = new URLSearchParams()
    if (filters?.days) params.append('days', String(filters.days))
    if (filters?.path) params.append('path', filters.path)

    const queryString = params.toString()
    const endpoint = `/analytics/stats${queryString ? `?${queryString}` : ''}`
    
    const response = await fetchApi<ApiResponse<AnalyticsStats>>(endpoint)
    return response.data
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPORT ALL
// ═══════════════════════════════════════════════════════════════════════════

export const api = {
  profile: profileApi,
  projects: projectsApi,
  posts: postsApi,
  experience: experienceApi,
  education: educationApi,
  skills: skillsApi,
  certificates: certificatesApi,
  testimonials: testimonialsApi,
  socialLinks: socialLinksApi,
  contact: contactApi,
  settings: settingsApi,
  analytics: analyticsApi,
}

export default api
