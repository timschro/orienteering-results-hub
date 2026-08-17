import { ExternalLink } from "lucide-react"

import type { Competition } from "@/lib/data"
import { cn } from "@/lib/utils"

// min-h-11 is 44px, the smallest comfortable touch target. These two links are
// the only actions on the site, so they are buttons rather than text links.
const button =
  "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md px-4 " +
  "text-[15px] font-medium transition-colors sm:flex-none"

interface CompetitionLinksProps {
  competition: Competition
  /** Fills the results button with the accent colour. Used by the featured slot. */
  emphasis?: boolean
  className?: string
}

/**
 * Both buttons are named after where they go, not after what they will contain.
 *
 * An OResults event page moves through phases the organiser controls - no start
 * list, then a start list, then live results, then finals - and none of those
 * transitions are derivable from our start and end times, so any label
 * promising content would be wrong some of the time. The destination never is.
 * The status next to the button ("Live", "in 38 Min.", "beendet") already
 * carries the timing, which leaves the button free to carry the destination.
 */
export function CompetitionLinks({
  competition,
  emphasis = false,
  className,
}: CompetitionLinksProps) {
  const hasLiveResults = competition.liveResultsUrl.trim() !== ""
  const hasLivelox = competition.liveloxUrl.trim() !== ""

  if (!hasLiveResults && !hasLivelox) return null

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {hasLiveResults && (
        <a
          href={competition.liveResultsUrl}
          target="_blank"
          rel="noopener noreferrer"
          // The visible text repeats down the page, so the accessible name
          // names the competition too. It still contains the visible label, as
          // WCAG 2.5.3 (Label in Name) requires.
          aria-label={`${competition.name} bei OResults`}
          className={cn(
            button,
            emphasis
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border bg-card hover:bg-muted"
          )}
        >
          OResults
          <ExternalLink className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
        </a>
      )}

      {hasLivelox && (
        <a
          href={competition.liveloxUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${competition.name} bei Livelox`}
          className={cn(button, "border bg-card hover:bg-muted")}
        >
          Livelox
          <ExternalLink className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
        </a>
      )}
    </div>
  )
}
