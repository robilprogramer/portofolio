import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  type LucideIcon,
} from 'lucide-react'

// Map platform names to Lucide icons
export const socialIconMap: Record<string, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  email: Mail,
  mail: Mail,
  twitter: Twitter,
  x: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  website: Globe,
  portfolio: Globe,
}

export function getSocialIcon(platform: string): LucideIcon {
  const normalizedPlatform = platform.toLowerCase()
  return socialIconMap[normalizedPlatform] || Globe
}

// Map experience employment types to icons
import { Briefcase, Clock, FileText, Users } from 'lucide-react'

export const employmentTypeIconMap: Record<string, LucideIcon> = {
  FULL_TIME: Briefcase,
  PART_TIME: Clock,
  CONTRACT: FileText,
  FREELANCE: Users,
  INTERNSHIP: Briefcase,
}

export function getEmploymentTypeIcon(type: string): LucideIcon {
  return employmentTypeIconMap[type] || Briefcase
}
