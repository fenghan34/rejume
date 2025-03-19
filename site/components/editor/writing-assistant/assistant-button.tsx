import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export type AssistantButton = { id: string, title: ReactNode, onClick: () => void, disabled?: boolean }

export function ActionButton({ children, ...rest }: Parameters<typeof Button>[0]) {
  return (
    <Button
      size="sm"
      variant="ghost"
      className="cursor-pointer"
      {...rest}
    >
      {children}
    </Button>
  )
}
