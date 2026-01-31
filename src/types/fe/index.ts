// ═══════════════════════════════════════════════════════════════════════════
// API RESPONSE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Profile {
  id: string
  name: string
  title: string
  tagline: string
  bio: string
  avatar: string
  email: string
  phone?: string
  location: string
  isAvailable: boolean
  yearsExperience: number
  projectsCompleted: number
  happyClients: number
  resumeUrl?: string
  createdAt: string
  updatedAt: string
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECT TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Project {
  id: string
  title: string
  slug: string
  category: string
  shortDesc: string
  longDesc?: string
  thumbnail: string
  images?: string[]
  techStack: string[]
  features?: string[]
  challenges?: string
  solutions?: string
  liveUrl?: string
  githubUrl?: string
  demoUrl?: string
  isFeatured: boolean
  isPublished: boolean
  viewCount: number
  startDate?: string
  endDate?: string
  client?: string
  teamSize?: number
  role?: string
  color?: string
  createdAt: string
  updatedAt: string
}

export interface ProjectFilters {
  page?: number
  limit?: number
  category?: string
  featured?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOG POST TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  thumbnail: string
  category: string
  tags: string[]
  isFeatured: boolean
  isPublished: boolean
  viewCount: number
  readTime?: number
  author?: string
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface BlogPostFilters {
  page?: number
  limit?: number
  category?: string
  tag?: string
  featured?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPERIENCE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Experience {
  id: string
  title: string
  company: string
  companyUrl?: string
  location?: string
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP'
  startDate: string
  endDate?: string
  isCurrent: boolean
  description: string
  responsibilities?: string[]
  achievements?: string[]
  technologies?: string[]
  order: number
  createdAt: string
  updatedAt: string
}

// ═══════════════════════════════════════════════════════════════════════════
// EDUCATION TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location?: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  gpa?: string
  description?: string
  achievements?: string[]
  order: number
  createdAt: string
  updatedAt: string
}

// ═══════════════════════════════════════════════════════════════════════════
// SKILL TYPES
// ═══════════════════════════════════════════════════════════════════════════

export enum SkillCategory {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASE = 'DATABASE',
  DEVOPS = 'DEVOPS',
  MOBILE = 'MOBILE',
  TOOLS = 'TOOLS',
  SOFT_SKILLS = 'SOFT_SKILLS',
  OTHER = 'OTHER',
}

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  level: number
  icon?: string
  description?: string
  yearsOfExperience?: number
  order: number
  createdAt: string
  updatedAt: string
}

export interface SkillFilters {
  category?: SkillCategory
}

// ═══════════════════════════════════════════════════════════════════════════
// CERTIFICATE TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Certificate {
  id: string
  title: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  description?: string
  skills?: string[]
  image?: string
  order: number
  createdAt: string
  updatedAt: string
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIAL TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Testimonial {
  id: string
  name: string
  role: string
  company?: string
  avatar?: string
  content: string
  rating?: number
  projectName?: string
  isFeatured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface TestimonialFilters {
  featured?: boolean
}

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL LINK TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon?: string
  order: number
  createdAt: string
  updatedAt: string
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ContactMessage {
  name: string
  email: string
  subject: string
  content: string
}

export interface ContactMessageResponse {
  id: string
  name: string
  email: string
  subject: string
  content: string
  isRead: boolean
  createdAt: string
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SiteSettings {
  siteName?: string
  siteDescription?: string
  siteUrl?: string
  logo?: string
  favicon?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  ogImage?: string
  twitterHandle?: string
  googleAnalyticsId?: string
  maintenanceMode?: boolean
  allowContactForm?: boolean
  [key: string]: any
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PageViewData {
  path: string
  referrer?: string
  userAgent?: string
}

export interface AnalyticsStats {
  totalViews: number
  uniqueVisitors: number
  topPages: Array<{
    path: string
    views: number
  }>
  dailyViews?: Array<{
    date: string
    views: number
  }>
}

export interface AnalyticsFilters {
  days?: number
  path?: string
}
