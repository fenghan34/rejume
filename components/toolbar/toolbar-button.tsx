import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

export function ToolbarButton({
  className,
  ...rest
}: Omit<React.ComponentProps<typeof Button>, 'variant' | 'size'>) {
  return (
    <Button
      {...rest}
      variant="ghost"
      size="icon"
      className={cn('cursor-pointer', className)}
    />
  )
}
