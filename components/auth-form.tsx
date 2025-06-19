'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Google, GitHub, Spinner } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn, signUp, useSession } from '@/lib/auth/client'

export function AuthForm({ type }: { type: 'login' | 'signup' }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const isSignup = type === 'signup'

  const getCallbackURL = () => {
    return new URL('/dashboard', window.location.origin).href
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    let result
    if (isSignup) {
      result = await signUp.email({
        name: email.split('@')[0],
        email,
        password,
        callbackURL: getCallbackURL(),
      })
    } else {
      result = await signIn.email({
        email,
        password,
        rememberMe: true,
      })
    }

    setLoading(false)

    if (result.error) {
      toast.error(result.error.message)
    }
  }

  async function handleProviderSignIn(provider: 'google' | 'github') {
    setLoading(true)

    const { error } = await signIn.social({
      provider,
      callbackURL: getCallbackURL(),
    })

    setLoading(false)

    if (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (session?.user?.id) {
      router.push('/dashboard')
    }
  }, [router, session?.user?.id])

  return (
    <div className="w-full max-w-md p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isSignup ? 'Create a Rejume account' : 'Log in to Rejume'}
        </h1>
        <Button
          variant="link"
          className="p-0 text-sm opacity-50 hover:opacity-100"
          asChild
        >
          <Link href={`/${isSignup ? 'login' : 'signup'}`}>
            {isSignup
              ? 'Already have an account? Log in'
              : "Don't have an account? Sign up"}
          </Link>
        </Button>
      </div>
      <div className="space-y-6">
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="space-y-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              minLength={8}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              disabled={loading}
              required
            />
          </div>
          <Button className="w-full cursor-pointer" disabled={loading}>
            {loading && <Spinner className="animate-spin" />}
            {isSignup ? 'Sign up' : 'Login'}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={loading}
            onClick={() => handleProviderSignIn('google')}
          >
            <Google />
            Google
          </Button>
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={loading}
            onClick={() => handleProviderSignIn('github')}
          >
            <GitHub />
            GitHub
          </Button>
        </div>
      </div>
    </div>
  )
}
