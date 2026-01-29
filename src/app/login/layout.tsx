import { Providers } from "@/components/providers"

export const metadata = {
  title: "Login | Admin",
  description: "Sign in to your admin account",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Login page has its own layout without the admin sidebar
  return (
    <Providers>
      {children}
    </Providers>
  )
}