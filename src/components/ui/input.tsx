import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input — premium form field.
 *
 * Soft cool-tinted border at rest, brand lime ring + foreground border on
 * focus. Slightly bigger touch target (h-9) than shadcn default for
 * thumb-on-phone friendliness — site supervisors are often on mobile.
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // base — slightly raised feel via subtle inner background
        "h-9 w-full min-w-0 rounded-lg border border-soft bg-card px-3 py-1.5 text-sm transition-all outline-none",
        "placeholder:text-muted-foreground",
        // file input chrome (kept from shadcn)
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // focus — brand lime ring with stronger border
        "focus-visible:border-foreground focus-visible:ring-3 focus-visible:ring-brand/35",
        // disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-50",
        // invalid
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        // hover (subtle border darken)
        "hover:border-strong",
        className
      )}
      {...props}
    />
  )
}

export { Input }
