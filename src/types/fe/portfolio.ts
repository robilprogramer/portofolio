export type TranslationFn = (key: string) => string;

export interface ProfileData {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  email: string;
  yearsExperience: number;
  projectsCompleted: number;
  happyClients: number;
}

export interface SocialLinkData {
  id: string | number;
  platform: string;
  url: string;
}

export interface ProjectData {
  id: string | number;
  title: string;
  shortDesc: string;
  thumbnail: string;
  category?: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack: string[];
}

export interface SkillData {
  id: string | number;
  name: string;
  category: string;
  level: number;
}

export interface ExperienceData {
  id: string | number;
  title: string;
  company: string;
  startDate: string | Date;
  endDate?: string | Date;
  isCurrent: boolean;
  description: string;
  employmentType?: string;
}

export interface EducationData {
  id: string | number;
  degree: string;
  institution: string;
  startDate: string | Date;
  endDate?: string | Date;
  isCurrent: boolean;
  field: string;
  gpa?: string | number;
}