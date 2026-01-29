// ============================================================
// Common Types
// ============================================================

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  meta?: PaginationMeta
  message?: string
}

// ============================================================
// Profile Types
// ============================================================

export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  shortBio: string
  avatar?: string | null
  resumeUrl?: string | null
  location?: string | null
  email: string
  phone?: string | null
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface ProfileFormData {
  name: string
  title: string
  bio: string
  shortBio: string
  avatar?: string
  resumeUrl?: string
  location?: string
  email: string
  phone?: string
  isAvailable: boolean
}

// ============================================================
// Project Types
// ============================================================

export type ProjectStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD" | "CANCELLED"

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  shortDesc?: string | null
  thumbnail?: string | null
  images: string[]
  liveUrl?: string | null
  githubUrl?: string | null
  techStack: string[]
  category: string
  featured: boolean
  status: ProjectStatus
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectFormData {
  title: string
  description: string
  shortDesc?: string
  thumbnail?: string
  images?: string[]
  liveUrl?: string
  githubUrl?: string
  techStack: string[]
  category: string
  featured: boolean
  status: ProjectStatus
  isPublished: boolean
}

export interface ProjectFilters {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: ProjectStatus
  featured?: boolean
  published?: boolean
}

// ============================================================
// Post Types
// ============================================================

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  thumbnail?: string | null
  tags: string[]
  category: string
  featured: boolean
  isPublished: boolean
  publishedAt?: string | null
  readTime: number
  views: number
  createdAt: string
  updatedAt: string
}

export interface PostFormData {
  title: string
  excerpt?: string
  content: string
  thumbnail?: string
  tags: string[]
  category: string
  featured: boolean
  isPublished: boolean
  publishedAt?: string
  readTime?: number
}

export interface PostFilters {
  page?: number
  limit?: number
  search?: string
  category?: string
  tag?: string
  featured?: boolean
  published?: boolean
}

// ============================================================
// Experience Types
// ============================================================

export type ExperienceType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "FREELANCE" | "INTERNSHIP"

export interface Experience {
  id: string
  company: string
  position: string
  description?: string | null
  location?: string | null
  type: ExperienceType
  startDate: string
  endDate?: string | null
  isCurrent: boolean
  technologies: string[]
  achievements: string[]
  companyLogo?: string | null
  order: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface ExperienceFormData {
  company: string
  position: string
  description?: string
  location?: string
  type: ExperienceType
  startDate: string
  endDate?: string
  isCurrent: boolean
  technologies: string[]
  achievements: string[]
  companyLogo?: string
  order?: number
  isPublished: boolean
}

export interface ExperienceFilters {
  page?: number
  limit?: number
  type?: ExperienceType
  published?: boolean
  current?: boolean
}

// ============================================================
// Education Types
// ============================================================

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  description?: string | null
  location?: string | null
  gpa?: number | null
  startDate: string
  endDate?: string | null
  isCurrent: boolean
  achievements: string[]
  logo?: string | null
  order: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface EducationFormData {
  institution: string
  degree: string
  field: string
  description?: string
  location?: string
  gpa?: number
  startDate: string
  endDate?: string
  isCurrent: boolean
  achievements: string[]
  logo?: string
  order?: number
  isPublished: boolean
}

export interface EducationFilters {
  page?: number
  limit?: number
  published?: boolean
  current?: boolean
}

// ============================================================
// Skill Types
// ============================================================

export type SkillCategory = "FRONTEND" | "BACKEND" | "DATABASE" | "DEVOPS" | "MOBILE" | "TOOLS" | "OTHER"

export interface Skill {
  id: string
  name: string
  category: SkillCategory
  level: number
  icon?: string | null
  color?: string | null
  order: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface SkillFormData {
  name: string
  category: SkillCategory
  level: number
  icon?: string
  color?: string
  order?: number
  isPublished: boolean
}

export interface SkillFilters {
  category?: SkillCategory
  published?: boolean
}

// ============================================================
// Certificate Types
// ============================================================

export interface Certificate {
  id: string
  name: string
  issuer: string
  description?: string | null
  credentialId?: string | null
  credentialUrl?: string | null
  issueDate: string
  expiryDate?: string | null
  image?: string | null
  order: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface CertificateFormData {
  name: string
  issuer: string
  description?: string
  credentialId?: string
  credentialUrl?: string
  issueDate: string
  expiryDate?: string
  image?: string
  order?: number
  isPublished: boolean
}

// ============================================================
// Testimonial Types
// ============================================================

export interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  content: string
  avatar?: string | null
  rating: number
  featured: boolean
  order: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface TestimonialFormData {
  name: string
  position: string
  company: string
  content: string
  avatar?: string
  rating: number
  featured: boolean
  order?: number
  isPublished: boolean
}

// ============================================================
// Message Types
// ============================================================

export interface Message {
  id: string
  name: string
  email: string
  subject?: string | null
  content: string
  isRead: boolean
  isStarred: boolean
  isArchived: boolean
  repliedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface MessageFilters {
  page?: number
  limit?: number
  isRead?: boolean
  isArchived?: boolean
  isStarred?: boolean
}

// ============================================================
// Social Link Types
// ============================================================

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon?: string | null
  order: number
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface SocialLinkFormData {
  platform: string
  url: string
  icon?: string
  order?: number
  isPublished: boolean
}

// ============================================================
// Settings Types
// ============================================================

export type SettingType = "string" | "number" | "boolean" | "json"

export interface Setting {
  id: string
  key: string
  value: string
  type: SettingType
  description?: string | null
  createdAt: string
  updatedAt: string
}

export interface SettingFormData {
  key: string
  value: string
  type: SettingType
  description?: string
}
