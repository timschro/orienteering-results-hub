"use client"

import { useEffect, useState } from "react"

import {
  getCompetitionStatus,
  type CompetitionStatus as Status,
} from "@/lib/competition-status"

interface CompetitionStatusProps {
  startTime: string
  endTime: string
  /**
   * The status as computed on the server. Seeding state with it means the first
   * client render is identical to the server HTML (no hydration mismatch) and
   * the label is already correct for visitors without JavaScript.
   */
  initial: Status
  /** Callers set the text size here; the base classes deliberately don't, so
   *  there is nothing for the concatenated class list to conflict over. */
  className: string
}

const STYLES: Record<Status["kind"], string> = {
  live: "text-primary font-semibold",
  soon: "text-foreground font-medium",
  upcoming: "text-muted-foreground",
  finished: "text-muted-foreground",
}

/**
 * The page's only client component. Everything else — including which
 * competition is featured — is decided on the server; this just keeps the
 * relative label ("in 12 Min.") and the live indicator honest on a tab that
 * stays open.
 *
 * Note the plain string concatenation instead of `cn`: importing that helper
 * here would ship clsx and tailwind-merge to every visitor to merge two
 * class lists that never conflict.
 */
export function CompetitionStatus({
  startTime,
  endTime,
  initial,
  className,
}: CompetitionStatusProps) {
  const [status, setStatus] = useState(initial)

  useEffect(() => {
    const tick = () => setStatus(getCompetitionStatus(startTime, endTime))

    tick()
    const interval = setInterval(tick, 30_000)

    return () => clearInterval(interval)
  }, [startTime, endTime])

  if (!status.label) return null

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap ${
        STYLES[status.kind]
      } ${className}`}
    >
      {status.kind === "live" && (
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
      )}
      {status.label}
    </span>
  )
}
