import Link from 'next/link'
import { montserrat } from '@/lib/fonts'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link prefetch href="/" className={cn(montserrat.className, className)}>
      Rejume
    </Link>
  )
}
