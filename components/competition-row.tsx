import type { Competition } from "@/lib/data"
import type { CompetitionStatus as Status } from "@/lib/competition-status"
import type { Translation } from "@/lib/dictionaries"
import { cn, competitionName, formatStartTime } from "@/lib/utils"
import { CompetitionLinks } from "@/components/competition-links"
import { CompetitionStatus } from "@/components/competition-status"

interface CompetitionRowProps {
  competition: Competition
  status: Status
  translation: Translation
  /** OResults reports a start list for this competition. See lib/oresults.ts. */
  hasStartList?: boolean
}

/**
 * One line of the timetable. Phones stack the links under the name so they can
 * be full-width targets; from `sm` up everything sits on a single line and the
 * page reads like the programme board at the arena.
 */
export function CompetitionRow({
  competition,
  status,
  translation,
  hasStartList = false,
}: CompetitionRowProps) {
  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4">
      <div
        className={cn(
          "flex min-w-0 flex-1 items-baseline gap-4",
          // Past races fade back, but their links stay at full strength —
          // results matter most after the race has finished.
          status.kind === "finished" && "opacity-60"
        )}
      >
        <time
          dateTime={competition.startTime}
          className="w-14 shrink-0 text-sm font-medium text-muted-foreground"
        >
          {formatStartTime(competition.startTime, translation.intl)}
        </time>

        <h3 className="min-w-0 flex-1 font-semibold">
          {competitionName(competition, translation.t)}
        </h3>

        <CompetitionStatus
          startTime={competition.startTime}
          endTime={competition.endTime}
          initial={status}
          intl={translation.intl}
          strings={translation.t.status}
          // shrink-0 so a long race name can never squeeze the status into it.
          className="shrink-0 text-sm"
        />
      </div>

      <CompetitionLinks
        competition={competition}
        translation={translation}
        noteStartList={hasStartList}
        className="sm:shrink-0"
      />
    </li>
  )
}
