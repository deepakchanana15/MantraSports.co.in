import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db/prisma'
import { loginSchema } from '@/lib/validations/auth'
import type { AdminRole } from '@/types'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        try {
          const admin = await prisma.adminUser.findUnique({
            where: { email: parsed.data.email },
            select: {
              id: true,
              name: true,
              email: true,
              passwordHash: true,
              role: true,
            },
          })

          if (!admin) return null

          const isValid = await bcrypt.compare(parsed.data.password, admin.passwordHash)
          if (!isValid) return null

          // Update last login timestamp (fire-and-forget)
          prisma.adminUser
            .update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } })
            .catch(() => {})

          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role as AdminRole,
          }
        } catch {
          // Database not connected — allow dev-only bypass via environment credentials.
          // This path is unreachable in production (NODE_ENV guard + no DEV_ vars set).
          if (process.env.NODE_ENV !== 'development') return null

          const devEmail = process.env.DEV_ADMIN_EMAIL
          const devPass = process.env.DEV_ADMIN_PASSWORD
          if (!devEmail || !devPass) return null
          if (parsed.data.email !== devEmail || parsed.data.password !== devPass) return null

          return {
            id: 'dev-admin-no-db',
            name: 'Dev Admin',
            email: devEmail,
            role: 'SUPER_ADMIN' as AdminRole,
          }
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // Merge authorised user data into the JWT on first sign-in
        return {
          ...token,
          id: (user as { id: string }).id,
          role: (user as { role: AdminRole }).role,
        }
      }
      return token
    },

    session({ session, token }) {
      // Surface id and role from JWT into the session object
      return {
        ...session,
        user: {
          ...session.user,
          id: (token as { id?: string }).id ?? '',
          role: ((token as { role?: AdminRole }).role) ?? 'ADMIN',
        },
      }
    },
  },

  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
})
