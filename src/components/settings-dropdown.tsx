"use client"

import { useState, useRef, useEffect, useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Monitor, Check, ChevronDown } from "lucide-react"
import { useSettings } from "@/lib/contexts/settings-context"

const themes = [
  { value: "light", label: "settings.theme.light", icon: Sun },
  { value: "dark", label: "settings.theme.dark", icon: Moon },
  { value: "system", label: "settings.theme.system", icon: Monitor },
] as const

const languages = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "id", label: "Indonesia", flag: "🇮🇩" },
] as const

// Hydration-safe hook
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { language, setLanguage, t } = useSettings()
  const mounted = useHasMounted()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  // Skeleton loader while mounting
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 px-3 py-2 text-sm animate-pulse">
        <div className="h-4 w-4 rounded bg-zinc-300 dark:bg-zinc-700" />
        <div className="hidden sm:block h-4 w-4 rounded bg-zinc-300 dark:bg-zinc-700" />
        <div className="h-3 w-3 rounded bg-zinc-300 dark:bg-zinc-700" />
      </div>
    )
  }

  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white"
        aria-label="Settings"
      >
        <CurrentIcon className="h-4 w-4" />
        <span className="hidden sm:inline">
          {languages.find(l => l.value === language)?.flag}
        </span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/50 transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2"
        }`}
      >
        {/* Theme Section */}
        <div className="p-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {t("settings.theme")}
          </p>
          <div className="space-y-1">
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  theme === value
                    ? "bg-violet-500/20 text-violet-600 dark:text-violet-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1 text-left">{t(label)}</span>
                {theme === value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-800" />

        {/* Language Section */}
        <div className="p-2">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            {t("settings.language")}
          </p>
          <div className="space-y-1">
            {languages.map(({ value, label, flag }) => (
              <button
                key={value}
                onClick={() => {
                  setLanguage(value as "en" | "id")
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  language === value
                    ? "bg-violet-500/20 text-violet-600 dark:text-violet-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                <span className="text-lg">{flag}</span>
                <span className="flex-1 text-left">{label}</span>
                {language === value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for mobile
export function SettingsCompact() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useSettings()
  const mounted = useHasMounted()

  const cycleTheme = () => {
    const themeOrder = ["light", "dark", "system"]
    const currentIndex = themeOrder.indexOf(theme || "system")
    const nextIndex = (currentIndex + 1) % themeOrder.length
    setTheme(themeOrder[nextIndex])
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "id" : "en")
  }

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        <div className="h-10 w-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={cycleTheme}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Moon className="h-5 w-5" />
        ) : theme === "light" ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Monitor className="h-5 w-5" />
        )}
      </button>
      <button
        onClick={toggleLanguage}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 text-lg transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
        aria-label="Toggle language"
      >
        {language === "en" ? "🇺🇸" : "🇮🇩"}
      </button>
    </div>
  )
}