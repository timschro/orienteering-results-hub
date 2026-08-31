import { ExternalLink } from "lucide-react"

import type { Competition } from "@/lib/data"
import { fill, type Translation } from "@/lib/dictionaries"
import { cn, competitionName } from "@/lib/utils"

// min-h-11 is 44px, the smallest comfortable touch target. These two links are
// the only actions on the site, so they are buttons rather than text links.
const button =
  "inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md px-4 " +
  "text-[15px] font-medium transition-colors sm:flex-none"

interface CompetitionLinksProps {
  competition: Competition
  translation: Translation
  /**
   * Name the start list on the OResults button - a caption under the label and
   * a fuller accessible name - because it is the reason to tap it in the days
   * before a race. Driven by OResults; see lib/oresults.ts.
   *
   * Not simply "a start list exists": the featured card states that in a line
   * of its own and leaves this `false`, so the same fact is not said twice
   * inside one card.
   */
  noteStartList?: boolean
  /** Fills the results button with the accent colour. Used by the featured slot. */
  emphasis?: boolean
  className?: string
}

/**
 * The live buttons are named after where they go, not after what they will
 * contain.
 *
 * An OResults event page moves through phases the organiser controls - no start
 * list, then a start list, then live results, then finals - and none of those
 * transitions are derivable from our start and end times, so any label
 * promising content would be wrong some of the time. The destination never is.
 * The status next to the button ("Live", "in 38 Min.", "beendet") already
 * carries the timing, which leaves the button free to carry the destination.
 *
 * Two exceptions, both of which name content because the content is a fact and
 * not a guess:
 *
 * The start-list caption is read back from OResults itself, so while it shows
 * it is true. It belongs on the button rather than beside the competition name
 * - a badge up there says a start list exists somewhere, the caption says which
 * tap opens it.
 *
 * The official result list is labelled "PDF" - the format, not the host, which
 * is whatever the organiser happens to use and would tell a visitor nothing.
 * Untranslated for the same reason "OResults" and "Livelox" are: it reads the
 * same in all nine languages, and a translated word here would have to be short
 * in every one of them. The row is tight enough that it must be. The link's
 * accessible name carries the full "offizielle Ergebnisse (PDF)" in the
 * reader's own language.
 *
 * It sits between the two live services: results together, routes last.
 */
export function CompetitionLinks({
  competition,
  translation: { t },
  noteStartList = false,
  emphasis = false,
  className,
}: CompetitionLinksProps) {
  // The accessible names name the competition, so they need the same
  // translated title the heading above them shows.
  const name = competitionName(competition, t)
  const hasLiveResults = competition.liveResultsUrl.trim() !== ""
  const hasLivelox = competition.liveloxUrl.trim() !== ""
  const resultsPdfUrl = competition.resultsPdfUrl?.trim() ?? ""
  const hasResultsPdf = resultsPdfUrl !== ""

  if (!hasLiveResults && !hasLivelox && !hasResultsPdf) return null

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
          aria-label={fill(
            noteStartList ? t.links.oresultsStartList : t.links.oresults,
            { competition: name }
          )}
          className={cn(
            button,
            // The caption sits under the label, so the button lays its text out
            // as a column and keeps the icon beside it.
            noteStartList && "py-1.5",
            emphasis
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "border bg-card hover:bg-muted"
          )}
        >
          <span className="flex flex-col items-center leading-tight">
            <span>OResults</span>
            {noteStartList && (
              <span className="text-xs font-normal opacity-75">
                {t.links.startList}
              </span>
            )}
          </span>
          <ExternalLink className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
        </a>
      )}

      {hasResultsPdf && (
        <a
          href={resultsPdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={fill(t.links.resultsPdfLink, { competition: name })}
          className={cn(button, "border bg-card hover:bg-muted")}
        >
          PDF
          <ExternalLink className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
        </a>
      )}

      {hasLivelox && (
        <a
          href={competition.liveloxUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={fill(t.links.livelox, { competition: name })}
          className={cn(button, "border bg-card hover:bg-muted")}
        >
          Livelox
          <ExternalLink className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
        </a>
      )}
    </div>
  )
}
