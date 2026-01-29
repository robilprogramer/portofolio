// import { NextAuthOptions } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { compare } from "bcryptjs"
// import prisma from "./prisma"

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email and password required")
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email }
//         })

//         if (!user) {
//           throw new Error("Invalid credentials")
//         }

//         const isPasswordValid = await compare(credentials.password, user.password)

//         if (!isPasswordValid) {
//           throw new Error("Invalid credentials")
//         }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//           avatar: user.avatar,
//         }
//       }
//     })
//   ],
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id
//         token.role = user.role
//         token.avatar = user.avatar
//       }
//       return token
//     },
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id as string
//         session.user.role = token.role as string
//         session.user.avatar = token.avatar as string
//       }
//       return session
//     }
//   },
//   pages: {
//     signIn: "/admin/login",
//     error: "/admin/login",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// }

// // Extend NextAuth types
// declare module "next-auth" {
//   interface User {
//     id: string
//     role: string
//     avatar?: string | null
//   }
//   interface Session {
//     user: User & {
//       id: string
//       role: string
//       avatar?: string | null
//     }
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string
//     role: string
//     avatar?: string | null
//   }
// }

import { NextAuthOptions, getServerSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import prisma from "./prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        // Sanitize email input
        const email = credentials.email.toLowerCase().trim()

        const user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user || !user.password) {
          // Use generic error message to prevent user enumeration
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        // Check if user is active (optional - add isActive field to User model)
        // if (!user.isActive) {
        //   throw new Error("Account is deactivated")
        // }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days (reduced from 30 for better security)
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email!
        token.name = user.name!
        token.role = user.role
        token.avatar = user.avatar
      }

      // Handle session update (e.g., when user updates their profile)
      if (trigger === "update" && session) {
        token.name = session.name ?? token.name
        token.avatar = session.avatar ?? token.avatar
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string | null
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

// Helper function to get session on server side
export async function getSession() {
  return await getServerSession(authOptions)
}

// Helper function to get current user
export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

// Helper function to check if user is authenticated
export async function isAuthenticated() {
  const session = await getSession()
  return !!session?.user
}

// Helper function to check if user has specific role
export async function hasRole(roles: string | string[]) {
  const session = await getSession()
  if (!session?.user?.role) return false
  
  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  return allowedRoles.includes(session.user.role)
}

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    id: string
    role: string
    avatar?: string | null
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      avatar?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    role: string
    avatar?: string | null
  }
}