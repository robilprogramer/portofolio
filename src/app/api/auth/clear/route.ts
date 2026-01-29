import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const cookieStore = await cookies()
  
  // Hapus semua NextAuth cookies
  cookieStore.delete("next-auth.session-token")
  cookieStore.delete("next-auth.csrf-token")
  cookieStore.delete("next-auth.callback-url")
  cookieStore.delete("__Secure-next-auth.session-token")
  
  return NextResponse.json({ message: "Cookies cleared" })
}