import { ClipboardList } from "lucide-react"

import type { Competition } from "@/lib/data"
import type { CompetitionStatus as Status } from "@/lib/competition-status"
import type { Translation } from "@/lib/dictionaries"
import {
  competitionName,
  formatCompetitionDate,
  formatTimeWindow,
} from "@/lib/utils"
import { CompetitionLinks } from "@/components/competition-links"
import { CompetitionStatus } from "@/components/competition-status"

interface FeaturedCompetitionProps {
  competition: Competition
  status: Status
  translation: Translation
  /** OResults reports a start list for this competition. See lib/oresults.ts. */
  hasStartList?: boolean
}

/**
 * The one competition promoted above the timetable. This is the answer to the
 * question the page exists for - "which race is on and where are the results" -
 * so it sits in the first screenful and gets the accent-filled button.
 *
 * It also states the start list outright rather than captioning the button
 * with it the way the rows do. A row has to be terse; this card does not, and
 * in the days before a race "is the start list up yet" is the question people
 * open the page with. Because the card says it, the button below is left
 * plain - `noteStartList` is not passed on, so the fact is not repeated to
 * screen readers a second time in the link's accessible name.
 */
export function FeaturedCompetition({
  competition,
  status,
  translation,
  hasStartList = false,
}: FeaturedCompetitionProps) {
  const { intl, t } = translation
  const isLive = status.kind === "live"

  return (
    <section aria-labelledby="featured-heading" className="mb-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {isLive ? t.featured.live : t.featured.next}
      </p>

      <div
        className={`rounded-lg border bg-card p-5 sm:p-6 ${
          isLive ? "border-primary shadow-sm" : ""
        }`}
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <h2 id="featured-heading" className="text-2xl font-bold tracking-tight">
            {competitionName(competition, t)}
          </h2>
          <CompetitionStatus
            startTime={competition.startTime}
            endTime={competition.endTime}
            initial={status}
            intl={intl}
            strings={t.status}
            className="mt-1.5 shrink-0 text-base"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          <time dateTime={competition.startTime}>
            {formatCompetitionDate(competition.startTime, intl)}
          </time>
          {", "}
          {formatTimeWindow(competition.startTime, competition.endTime, intl)}
        </p>

        {hasStartList && (
          <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary">
            {/* A list icon rather than a dot: the only other coloured dot on
                the page is the pulsing live indicator, and this is not that. */}
            <ClipboardList className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t.featured.startList}
          </p>
        )}

        <CompetitionLinks
          competition={competition}
          translation={translation}
          emphasis
          className="mt-5"
        />
      </div>
    </section>
  )
}
