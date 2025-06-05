import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { getSession } from '@/lib/auth/server'

export default async function SignUpPage() {
  const session = await getSession()
  if (session?.user?.id) {
    redirect('/dashboard')
  }

  return <AuthForm type="signup" />
}
