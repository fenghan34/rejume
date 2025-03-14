import { Printer } from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

export function Toolbar({ onPrint }: { onPrint: () => void }) {
  return (
    <div className="p-2 flex bg-card border-b">
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={onPrint}
      >
        <Printer />
      </Button>
      <ModeToggle />
    </div>
  )
}
