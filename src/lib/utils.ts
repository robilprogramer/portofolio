import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ✅ TAMBAHKAN INI
export function getInitials(name?: string) {
  if (!name) return ""

  const words = name.trim().split(/\s+/)

  if (words.length === 1) {
    return words[0][0].toUpperCase()
  }

  return (
    words[0][0] + words[words.length - 1][0]
  ).toUpperCase()
}

// ✅ FORMAT DATE
export function formatDate(
  date: string | Date,
  locale: string = "id-ID"
) {
  if (!date) return "-"

  const d = typeof date === "string" ? new Date(date) : date

  if (isNaN(d.getTime())) return "-"

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d)
}

// lib/utils.ts

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // hapus karakter non huruf & angka
    .replace(/[^a-z0-9\s-]/g, "")
    // ganti spasi & underscore jadi dash
    .replace(/[\s_-]+/g, "-")
    // hapus dash di awal & akhir
    .replace(/^-+|-+$/g, "")
}


export function toDateTimeLocal(value?: string | Date) {
  if (!value) return ""

  const date = new Date(value)
  if (isNaN(date.getTime())) return ""

  const pad = (n: number) => String(n).padStart(2, "0")

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function formatDateShort(date?: string | Date | null) {
  if (!date) return "-"

  const d = typeof date === "string" ? new Date(date) : date

  if (isNaN(d.getTime())) return "-"

  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

export const toISODate = (date?: string | null) => {
  if (!date) return undefined
  return new Date(date).toISOString()
}
export const toISODateRequired = (date: string): string => {
  return new Date(`${date}T00:00:00Z`).toISOString()
}




// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// /**
//  * Get initials from a name
//  * @param name - Full name string
//  * @returns Initials (up to 2 characters)
//  */
// export function getInitials(name: string): string {
//   if (!name) return "U"
  
//   const words = name.trim().split(/\s+/)
  
//   if (words.length === 1) {
//     return words[0].substring(0, 2).toUpperCase()
//   }
  
//   return (words[0][0] + words[words.length - 1][0]).toUpperCase()
// }

// /**
//  * Format date to locale string
//  * @param date - Date string or Date object
//  * @param options - Intl.DateTimeFormat options
//  */
// export function formatDate(
//   date: string | Date,
//   options: Intl.DateTimeFormatOptions = {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   }
// ): string {
//   return new Date(date).toLocaleDateString("en-US", options)
// }

// /**
//  * Format relative time (e.g., "2 hours ago")
//  * @param date - Date string or Date object
//  */
// export function formatRelativeTime(date: string | Date): string {
//   const now = new Date()
//   const then = new Date(date)
//   const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000)

//   if (diffInSeconds < 60) {
//     return "just now"
//   }

//   const diffInMinutes = Math.floor(diffInSeconds / 60)
//   if (diffInMinutes < 60) {
//     return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
//   }

//   const diffInHours = Math.floor(diffInMinutes / 60)
//   if (diffInHours < 24) {
//     return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
//   }

//   const diffInDays = Math.floor(diffInHours / 24)
//   if (diffInDays < 30) {
//     return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
//   }

//   const diffInMonths = Math.floor(diffInDays / 30)
//   if (diffInMonths < 12) {
//     return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`
//   }

//   const diffInYears = Math.floor(diffInMonths / 12)
//   return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`
// }

// /**
//  * Truncate text with ellipsis
//  * @param text - Text to truncate
//  * @param maxLength - Maximum length
//  */
// export function truncate(text: string, maxLength: number): string {
//   if (text.length <= maxLength) return text
//   return text.substring(0, maxLength - 3) + "..."
// }

// /**
//  * Generate a slug from text
//  * @param text - Text to convert to slug
//  */
// export function slugify(text: string): string {
//   return text
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/[\s_-]+/g, "-")
//     .replace(/^-+|-+$/g, "")
// }

// /**
//  * Sleep for a specified duration
//  * @param ms - Milliseconds to sleep
//  */
// export function sleep(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }