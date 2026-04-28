import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Card — surface-raised box with cool-navy depth.
 *
 * Default: shadow-sm-cool (subtle but visible against canvas), border-soft
 * (slightly cool grey-blue, not pure greyscale), rounded-xl. Header carries
 * a 1px hairline rule underneath via `border-b` on CardHeader so the
 * heading separates cleanly from content without needing extra spacing.
 *
 * For interactive cards (clickable tiles, builder gallery), wrap in a
 * `Link` and add `card-hover` utility from globals.css to get the
 * hover-lift treatment (transform + stronger shadow + stronger border).
 */
function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        // Premium base: cool shadow, soft border, raised surface.
        // 28 Apr evening: shadow bumped one notch; canvas tint bumped one
        // notch — together cards read as actually raised, not just outlined.
        "group/card flex flex-col gap-0 overflow-hidden rounded-xl surface-raised border border-soft shadow-sm-cool text-sm text-card-foreground",
        "has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0",
        "*:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        "transition-shadow",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-5 py-4 border-b border-soft",
        "group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:py-3",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-display font-bold uppercase tracking-tight text-foreground text-base leading-snug group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-5 py-5 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:py-4",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t border-soft surface-pebble px-5 py-3 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:py-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
