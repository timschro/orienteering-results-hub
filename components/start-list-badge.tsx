import { cn } from "@/lib/utils"

/**
 * Shown on an upcoming competition once OResults reports runners for it. In
 * the days before a race "is my start time up yet" is the question people open
 * this page to answer, and until now the only way to find out was to tap
 * through and look.
 */
export function StartListBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5",
        "text-xs font-medium text-muted-foreground",
        className
      )}
    >
      Startliste
    </span>
  )
}
