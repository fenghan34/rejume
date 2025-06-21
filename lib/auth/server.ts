import 'server-only'
import type { User } from 'better-auth'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'
import { Resend } from 'resend'
import { db } from '../db/queries'
import { accounts, sessions, users, verifications } from '../db/schema'

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      account: accounts,
      session: sessions,
      verification: verifications,
    },
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // every 1 day the session expiration is updated
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
  },
  emailVerification: {
    enabled: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60, // 1 hour
    sendVerificationEmail: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: 'Rejume <onboarding@resend.dev>',
        to: user.email,
        subject: 'Verify your email address',
        html: `
        <p>Hi,</p>
        <p>Thank you for signing up for Rejume. Please verify your email address by clicking the link below:</p>
        <p><a href="${url}" target="_blank">${url}</a></p>
        `,
      })

      if (error) {
        console.error(error)
      }
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
})

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session
}

export const verifySession = async () => {
  const session = await getSession()

  if (!session?.user?.id) {
    redirect('/login')
  }

  return session
}

type Handler = (req: NextRequest, context: { user: User }) => Promise<Response>

export function withAuth(handler: Handler): Handler {
  return async (req, context) => {
    const session = await getSession()
    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return handler(req, { ...context, user: session.user })
  }
}
