import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea — matches Input. Soft cool-tinted border, brand lime focus ring,
 * card-coloured fill so it reads as raised on canvas.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-lg border border-soft bg-card px-3 py-2 text-sm transition-all outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-foreground focus-visible:ring-3 focus-visible:ring-brand/35",
        "hover:border-strong",
        "disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
