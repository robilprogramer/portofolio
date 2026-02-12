"use client"

import { createContext, useContext, useEffect, useState, ReactNode, useSyncExternalStore } from "react"

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type Language = "en" | "id"

interface SettingsContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// ═══════════════════════════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════════════

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.skills": "Skills",
    "nav.experience": "Experience",
    "nav.contact": "Contact",
    "nav.admin": "Admin",
    "nav.resume": "Resume",

    // Hero Section
    "hero.greeting": "Hi, I'm",
    "hero.available": "Open to new opportunities",
    "hero.cta.work": "View My Work",
    "hero.cta.contact": "Get in Touch",
    "hero.scroll": "Scroll",
    "hero.stats.years": "Years Experience",
    "hero.stats.projects": "Projects Completed",
    "hero.stats.clients": "Happy Clients",

    // About Section
    "about.label": "About Me",
    "about.title": "Crafting Digital",
    "about.title2": "Experiences",
    "about.feature.fast": "Fast Delivery",
    "about.feature.clean": "Clean Code",
    "about.feature.modern": "Modern Stack",
    "about.feature.best": "Best Practices",
    "about.cta": "Let's work together",

    // Projects Section
    "projects.label": "Portfolio",
    "projects.title": "Featured",
    "projects.title2": "Projects",
    "projects.description": "A selection of projects that showcase my skills and passion for building great products.",
    "projects.viewAll": "View All Projects",
    "projects.empty": "No featured projects available.",

    // Skills Section
    "skills.label": "Expertise",
    "skills.title": "Skills &",
    "skills.title2": "Technologies",
    "skills.description": "My toolkit for building modern, scalable, and performant applications.",
    "skills.empty": "No skills data available.",

    // Experience Section
    "experience.label": "Journey",
    "experience.title": "Experience &",
    "experience.title2": "Education",
    "experience.empty": "No experience or education data available.",

    // Testimonials Section
    "testimonials.label": "Testimonials",
    "testimonials.title": "What People",
    "testimonials.title2": "Say",

    // Contact Section
    "contact.label": "Contact",
    "contact.title": "Let's Create",
    "contact.title2": "Something Amazing",
    "contact.description": "Have a project in mind? I'd love to hear about it. Let's discuss how we can work together.",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.built": "Built with",
    "footer.using": "using Next.js & Tailwind CSS",

    // Settings
    "settings.theme": "Theme",
    "settings.language": "Language",
    "settings.theme.light": "Light",
    "settings.theme.dark": "Dark",
    "settings.theme.system": "System",

    // Common
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
  },
  id: {
    // Navigation
    "nav.about": "Tentang",
    "nav.projects": "Proyek",
    "nav.skills": "Keahlian",
    "nav.experience": "Pengalaman",
    "nav.contact": "Kontak",
    "nav.admin": "Admin",
    "nav.resume": "Resume",

    // Hero Section
    "hero.greeting": "Halo, Saya",
    "hero.available": "Terbuka untuk peluang baru",
    "hero.cta.work": "Lihat Karya Saya",
    "hero.cta.contact": "Hubungi Saya",
    "hero.scroll": "Gulir",
    "hero.stats.years": "Tahun Pengalaman",
    "hero.stats.projects": "Proyek Selesai",
    "hero.stats.clients": "Klien Puas",

    // About Section
    "about.label": "Tentang Saya",
    "about.title": "Menciptakan",
    "about.title2": "Pengalaman Digital",
    "about.feature.fast": "Pengerjaan Cepat",
    "about.feature.clean": "Kode Bersih",
    "about.feature.modern": "Teknologi Modern",
    "about.feature.best": "Praktik Terbaik",
    "about.cta": "Mari bekerja sama",

    // Projects Section
    "projects.label": "Portofolio",
    "projects.title": "Proyek",
    "projects.title2": "Unggulan",
    "projects.description": "Pilihan proyek yang menampilkan keahlian dan semangat saya dalam membangun produk hebat.",
    "projects.viewAll": "Lihat Semua Proyek",
    "projects.empty": "Belum ada proyek unggulan.",

    // Skills Section
    "skills.label": "Keahlian",
    "skills.title": "Keahlian &",
    "skills.title2": "Teknologi",
    "skills.description": "Peralatan saya untuk membangun aplikasi modern, skalabel, dan berkinerja tinggi.",
    "skills.empty": "Belum ada data keahlian.",

    // Experience Section
    "experience.label": "Perjalanan",
    "experience.title": "Pengalaman &",
    "experience.title2": "Pendidikan",
    "experience.empty": "Belum ada data pengalaman atau pendidikan.",

    // Testimonials Section
    "testimonials.label": "Testimoni",
    "testimonials.title": "Apa Kata",
    "testimonials.title2": "Mereka",

    // Contact Section
    "contact.label": "Kontak",
    "contact.title": "Mari Ciptakan",
    "contact.title2": "Sesuatu yang Luar Biasa",
    "contact.description": "Punya proyek? Saya ingin mendengarnya. Mari diskusikan bagaimana kita bisa bekerja sama.",

    // Footer
    "footer.rights": "Hak cipta dilindungi.",
    "footer.built": "Dibuat dengan",
    "footer.using": "menggunakan Next.js & Tailwind CSS",

    // Settings
    "settings.theme": "Tema",
    "settings.language": "Bahasa",
    "settings.theme.light": "Terang",
    "settings.theme.dark": "Gelap",
    "settings.theme.system": "Sistem",

    // Common
    "common.loading": "Memuat...",
    "common.error": "Terjadi kesalahan",
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// HYDRATION HELPER
// ═══════════════════════════════════════════════════════════════════════════

// Use useSyncExternalStore for hydration-safe mounted state
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

// Get initial language from localStorage (client-side only)
function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en"
  try {
    const stored = localStorage.getItem("portfolio-language")
    if (stored === "en" || stored === "id") return stored
  } catch {
    // localStorage not available
  }
  return "en"
}

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Initialize with stored value or default
  const [language, setLanguageState] = useState<Language>(() => getStoredLanguage())
  const hasMounted = useHasMounted()

  // Update document lang attribute when language changes (after mount)
  useEffect(() => {
    if (hasMounted) {
      document.documentElement.lang = language
    }
  }, [language, hasMounted])

  // Save language to localStorage and update state
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem("portfolio-language", lang)
      document.documentElement.lang = lang
    } catch {
      // localStorage not available
    }
  }

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <SettingsContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}

export function useTranslation() {
  const { t, language } = useSettings()
  return { t, language }
}