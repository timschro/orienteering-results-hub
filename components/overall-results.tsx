import { ExternalLink, Trophy } from "lucide-react"

import type { DomainConfig } from "@/lib/data"
import { fill, type Translation } from "@/lib/dictionaries"

interface OverallResultsProps {
  overallResults: NonNullable<DomainConfig["overallResults"]>
  translation: Translation
}

/**
 * The standings that combine several runnings of one format - at Hamburg, the
 * two sprints scored as one result. It sits above the timetable rather than in
 * it because it belongs to no single race, and it is the answer to "who won"
 * once the weekend is over: `pickFeaturedCompetition` returns nothing after the
 * last start, so this is what the top of the page carries from then on.
 *
 * Deliberately not accent-filled. The organiser publishes it the evening the
 * combined result is final, which at a multi-day event is while later races are
 * still upcoming - and until they have run, the featured card above is the more
 * useful thing to look at. Bordered like the timetable's own links, so it reads
 * as one more way in rather than as a banner.
 *
 * The label names the format it combines, so it is unique on the page and
 * carries its own accessible name; there is no aria-label to keep in sync.
 */
export function OverallResults({
  overallResults,
  translation: { t },
}: OverallResultsProps) {
  return (
    <section className="mb-8">
      <a
        href={overallResults.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 items-center gap-3 rounded-lg border bg-card px-4 py-3 font-medium transition-colors hover:bg-muted"
      >
        <Trophy className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          {fill(t.links.overallResults, { race: t.races[overallResults.race] })}
        </span>
        <ExternalLink className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
      </a>
    </section>
  )
}
