// Kept deliberately separate from lib/utils.ts: this is the only module the
// client bundle needs. Importing it from lib/utils.ts instead would pull `cn`
// (and therefore clsx + tailwind-merge) plus every Intl formatter on the page
// into the browser for the sake of one status label.

// All competitions take place in Germany, so every date and time is displayed
// in Europe/Berlin regardless of where the visitor is.
export const BERLIN_TIME_ZONE = "Europe/Berlin"

const berlinDayMonthYearFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: BERLIN_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const berlinWeekdayFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: BERLIN_TIME_ZONE,
  weekday: "long",
})

// Machine-readable date for <time dateTime=""> (ex: 2025-06-27)
export function toCompetitionDateISO(startTime: string | number | Date): string {
  const parts = berlinDayMonthYearFormatter.formatToParts(new Date(startTime))
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ""

  return `${get("year")}-${get("month")}-${get("day")}`
}

/**
 * The calendar day a timestamp falls on *in Berlin*, expressed as a whole
 * number of days since the epoch. Subtracting two of these gives the calendar
 * day difference, which is what "heute"/"morgen" depend on — a plain
 * millisecond difference would call 23:30 and 00:30 the same day.
 */
export function berlinDayNumber(value: string | number | Date): number {
  return Math.round(Date.parse(`${toCompetitionDateISO(value)}T00:00:00Z`) / 86_400_000)
}

/**
 * A competition within an hour of its start counts as "soon" and gets a
 * minute-resolution countdown. Anything further out is described by the day it
 * falls on — the timetable already shows the exact start time.
 */
const SOON_THRESHOLD_MS = 60 * 60 * 1000

export type CompetitionStatusKind = "upcoming" | "soon" | "live" | "finished"

export interface CompetitionStatus {
  kind: CompetitionStatusKind
  /**
   * Short German label. Empty for competitions more than a week out, where the
   * day heading above the row already says everything useful.
   */
  label: string
}

/**
 * Classify a competition relative to `now`. Rendered on the server first (so
 * the page is correct without JavaScript) and re-evaluated on the client every
 * 30s by components/competition-status.tsx.
 *
 * The timestamps carry an explicit UTC offset (see lib/data.ts), so this is
 * correct for visitors in every timezone.
 */
export function getCompetitionStatus(
  startTime: string,
  endTime: string,
  now: number = Date.now()
): CompetitionStatus {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()

  if (now >= start && now <= end) return { kind: "live", label: "Live" }
  if (now > end) return { kind: "finished", label: "beendet" }

  const untilStart = start - now
  if (untilStart <= SOON_THRESHOLD_MS) {
    const minutes = Math.round(untilStart / 60_000)
    return { kind: "soon", label: minutes <= 1 ? "gleich" : `in ${minutes} Min.` }
  }

  const daysAway = berlinDayNumber(start) - berlinDayNumber(now)
  if (daysAway === 0) return { kind: "upcoming", label: "heute" }
  if (daysAway === 1) return { kind: "upcoming", label: "morgen" }
  if (daysAway <= 6) {
    return { kind: "upcoming", label: berlinWeekdayFormatter.format(start) }
  }

  return { kind: "upcoming", label: "" }
}
