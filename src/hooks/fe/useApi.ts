import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query'
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
  SiteSettings,
  AnalyticsFilters,
  PaginatedResponse,
} from '@/types/fe'
import { api } from '@/lib/fe/api'

// ═══════════════════════════════════════════════════════════════════════════
// QUERY KEYS
// ═══════════════════════════════════════════════════════════════════════════

export const queryKeys = {
  profile: ['profile'] as const,
  projects: {
    all: (filters?: ProjectFilters) => ['projects', filters] as const,
    detail: (slug: string) => ['projects', slug] as const,
    featured: (limit?: number) => ['projects', 'featured', limit] as const,
  },
  posts: {
    all: (filters?: BlogPostFilters) => ['posts', filters] as const,
    detail: (slug: string) => ['posts', slug] as const,
    featured: (limit?: number) => ['posts', 'featured', limit] as const,
  },
  experience: ['experience'] as const,
  education: ['education'] as const,
  skills: (filters?: SkillFilters) => ['skills', filters] as const,
  certificates: ['certificates'] as const,
  testimonials: (filters?: TestimonialFilters) => ['testimonials', filters] as const,
  socialLinks: ['socialLinks'] as const,
  settings: ['settings'] as const,
  analytics: (filters?: AnalyticsFilters) => ['analytics', filters] as const,
}

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useProfile(options?: UseQueryOptions<Profile>) {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => api.profile.getProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// PROJECTS HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useProjects(
  filters?: ProjectFilters,
  options?: UseQueryOptions<PaginatedResponse<Project>>
) {
  return useQuery({
    queryKey: queryKeys.projects.all(filters),
    queryFn: () => api.projects.getAll(filters),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useProject(
  slug: string,
  options?: UseQueryOptions<Project>
) {
  return useQuery({
    queryKey: queryKeys.projects.detail(slug),
    queryFn: () => api.projects.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useFeaturedProjects(
  limit: number = 6,
  options?: UseQueryOptions<Project[]>
) {
  return useQuery({
    queryKey: queryKeys.projects.featured(limit),
    queryFn: () => api.projects.getFeatured(limit),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useIncrementProjectViews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => api.projects.incrementViews(slug),
    onSuccess: (_, slug) => {
      // Invalidate the project detail query to refetch with updated view count
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(slug) })
    },
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// BLOG POSTS HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function usePosts(
  filters?: BlogPostFilters,
  options?: UseQueryOptions<PaginatedResponse<BlogPost>>
) {
  return useQuery({
    queryKey: queryKeys.posts.all(filters),
    queryFn: () => api.posts.getAll(filters),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function usePost(
  slug: string,
  options?: UseQueryOptions<BlogPost>
) {
  return useQuery({
    queryKey: queryKeys.posts.detail(slug),
    queryFn: () => api.posts.getBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useFeaturedPosts(
  limit: number = 6,
  options?: UseQueryOptions<BlogPost[]>
) {
  return useQuery({
    queryKey: queryKeys.posts.featured(limit),
    queryFn: () => api.posts.getFeatured(limit),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useIncrementPostViews() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => api.posts.incrementViews(slug),
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.detail(slug) })
    },
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// EXPERIENCE HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useExperience(options?: UseQueryOptions<Experience[]>) {
  return useQuery({
    queryKey: queryKeys.experience,
    queryFn: () => api.experience.getAll(),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// EDUCATION HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useEducation(options?: UseQueryOptions<Education[]>) {
  return useQuery({
    queryKey: queryKeys.education,
    queryFn: () => api.education.getAll(),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// SKILLS HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useSkills(
  filters?: SkillFilters,
  options?: UseQueryOptions<Skill[]>
) {
  return useQuery({
    queryKey: queryKeys.skills(filters),
    queryFn: () => api.skills.getAll(filters),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// CERTIFICATES HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useCertificates(options?: UseQueryOptions<Certificate[]>) {
  return useQuery({
    queryKey: queryKeys.certificates,
    queryFn: () => api.certificates.getAll(),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// TESTIMONIALS HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useTestimonials(
  filters?: TestimonialFilters,
  options?: UseQueryOptions<Testimonial[]>
) {
  return useQuery({
    queryKey: queryKeys.testimonials(filters),
    queryFn: () => api.testimonials.getAll(filters),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

export function useFeaturedTestimonials(options?: UseQueryOptions<Testimonial[]>) {
  return useQuery({
    queryKey: queryKeys.testimonials({ featured: true }),
    queryFn: () => api.testimonials.getFeatured(),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL LINKS HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useSocialLinks(options?: UseQueryOptions<SocialLink[]>) {
  return useQuery({
    queryKey: queryKeys.socialLinks,
    queryFn: () => api.socialLinks.getAll(),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTACT HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useSendMessage() {
  return useMutation({
    mutationFn: (message: ContactMessage) => api.contact.sendMessage(message),
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useSiteSettings(options?: UseQueryOptions<SiteSettings>) {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: () => api.settings.getPublicSettings(),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// ANALYTICS HOOKS
// ═══════════════════════════════════════════════════════════════════════════

export function useAnalyticsStats(
  filters?: AnalyticsFilters,
  options?: UseQueryOptions<any>
) {
  return useQuery({
    queryKey: queryKeys.analytics(filters),
    queryFn: () => api.analytics.getStats(filters),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useTrackPageView() {
  return useMutation({
    mutationFn: (path: string) => 
      api.analytics.trackPageView({
        path,
        referrer: typeof window !== 'undefined' ? document.referrer : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      }),
  })
}
