import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { getSession } from '@/lib/auth/server'
import { Logo } from './logo'

export default async function AuthPage({ type }: { type: 'signup' | 'login' }) {
  const session = await getSession()
  if (session?.user?.id) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-2">
      <div className="flex flex-col items-center justify-center relative">
        <div className="absolute top-4 left-6">
          <Logo />
        </div>

        <AuthForm type={type} />
      </div>

      <div className="bg-primary text-primary-foreground hidden xl:block">
        <div className="h-full flex items-center justify-center">
          <h1 className="text-6xl font-semibold">
            <span>More than a resume, </span>
            <span className="block">it’s expression</span>
          </h1>
        </div>
      </div>
    </div>
  )
}
