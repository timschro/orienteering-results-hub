import type { Competition } from "@/lib/data"
import type { CompetitionStatus as Status } from "@/lib/competition-status"
import { formatCompetitionDate, formatTimeWindow } from "@/lib/utils"
import { CompetitionLinks } from "@/components/competition-links"
import { CompetitionStatus } from "@/components/competition-status"
import { StartListBadge } from "@/components/start-list-badge"

interface FeaturedCompetitionProps {
  competition: Competition
  status: Status
  /** OResults reports a start list for this competition. See lib/oresults.ts. */
  hasStartList?: boolean
}

/**
 * The one competition promoted above the timetable. This is the answer to the
 * question the page exists for - "which race is on and where are the results" -
 * so it sits in the first screenful and gets the accent-filled button.
 */
export function FeaturedCompetition({
  competition,
  status,
  hasStartList = false,
}: FeaturedCompetitionProps) {
  const isLive = status.kind === "live"

  return (
    <section aria-labelledby="featured-heading" className="mb-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {isLive ? "Jetzt live" : "Als Nächstes"}
      </p>

      <div
        className={`rounded-lg border bg-card p-5 sm:p-6 ${
          isLive ? "border-primary shadow-sm" : ""
        }`}
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <h2 id="featured-heading" className="text-2xl font-bold tracking-tight">
            {competition.name}
          </h2>
          <div className="mt-1.5 flex shrink-0 items-center gap-2">
            {hasStartList && <StartListBadge />}
            <CompetitionStatus
              startTime={competition.startTime}
              endTime={competition.endTime}
              initial={status}
              className="text-base"
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          <time dateTime={competition.startTime}>
            {formatCompetitionDate(competition.startTime)}
          </time>
          {", "}
          {formatTimeWindow(competition.startTime, competition.endTime)}
        </p>

        <CompetitionLinks competition={competition} emphasis className="mt-5" />
      </div>
    </section>
  )
}
