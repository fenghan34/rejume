'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession, signOut } from '@/lib/auth/client'

export function UserAvatar() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  if (isPending) {
    return <Skeleton className="size-8 rounded-full animate-pulse" />
  }

  if (!session?.user) {
    return null
  }

  const { name, image } = session.user
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      console.error(error)
      toast.error(error.message)
    } else {
      router.replace('/login')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={image || undefined} alt={name || 'User'} />
          <AvatarFallback>{initials}</AvatarFallback>
          <span className="sr-only">{name}</span>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-auto">
        <DropdownMenuItem className="cursor-pointer" onSelect={handleSignOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
