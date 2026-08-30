import { ExternalLink, Trophy } from "lucide-react"

import type { DomainConfig } from "@/lib/data"
import { fill, type Translation } from "@/lib/dictionaries"

interface OverallResultsProps {
  overallResults: NonNullable<DomainConfig["overallResults"]>
  translation: Translation
}

/**
 * The standings that combine several runnings of one format - at Hamburg, the
 * two sprints scored as one result.
 *
 * It closes the day those races were run on, directly under them, because that
 * is what makes it self-explanatory: a link that follows the two sprints and
 * says "Gesamtwertung Sprint" needs no further explaining of what it combines.
 * Above the timetable it had to carry that meaning on its own, and it was given
 * a card's worth of weight to do it - more than a supplementary list of the
 * same races deserves next to the races themselves.
 *
 * So it is sized like the timetable's own links rather than like a banner:
 * the same border, card background and hover as the OResults and Livelox
 * buttons, shrink-to-fit instead of full width. Still a 44px target.
 *
 * The label names the format it combines, so it is unique on the page and
 * carries its own accessible name; there is no aria-label to keep in sync.
 */
export function OverallResults({
  overallResults,
  translation: { t },
}: OverallResultsProps) {
  return (
    <div className="pt-4">
      <a
        href={overallResults.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-md border bg-card px-4 text-[15px] font-medium transition-colors hover:bg-muted"
      >
        <Trophy className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
        {fill(t.links.overallResults, { race: t.races[overallResults.race] })}
        <ExternalLink className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
      </a>
    </div>
  )
}
