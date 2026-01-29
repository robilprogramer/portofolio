"use client"
export function AdminFooter() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="ml-auto flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span>© {currentYear} Portfolio Admin.</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>

  )
}