// Kept deliberately separate from lib/utils.ts: this is the only module the
// client bundle needs. Importing it from lib/utils.ts instead would pull `cn`
// (and therefore clsx + tailwind-merge) plus every Intl formatter on the page
// into the browser for the sake of one status label.
//
// It is also deliberately free of any import from lib/dictionaries.ts: the
// labels arrive as a `StatusStrings` prop from the server, so the browser
// downloads the six strings of one language instead of all seven languages.

// All competitions take place in Germany, so every date and time is displayed
// in Europe/Berlin regardless of where the visitor is - only the *language* of
// the labels follows the visitor.
export const BERLIN_TIME_ZONE = "Europe/Berlin"

/**
 * `Intl.DateTimeFormat` construction is the expensive part, so formatters are
 * built once per locale/option pair and reused. Shared with lib/utils.ts via
 * this module because the client bundle already pays for this file.
 */
const formatters = new Map<string, Intl.DateTimeFormat>()

export function berlinFormatter(
  locale: string,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`
  let formatter = formatters.get(key)

  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      timeZone: BERLIN_TIME_ZONE,
      ...options,
    })
    formatters.set(key, formatter)
  }

  return formatter
}

// Machine-readable date for <time dateTime=""> (ex: 2025-06-27). Locale-
// independent by construction: it asks a fixed locale for numeric parts and
// reassembles them itself, so it stays ISO 8601 in every language.
export function toCompetitionDateISO(startTime: string | number | Date): string {
  const parts = berlinFormatter("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date(startTime))
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

/**
 * The translated labels this module needs, as plain strings so they can cross
 * the server/client boundary (a `(minutes: number) => string` could not).
 * `inMinutes` carries a `{minutes}` placeholder.
 */
export interface StatusStrings {
  live: string
  finished: string
  soon: string
  inMinutes: string
  today: string
  tomorrow: string
}

export interface CompetitionStatus {
  kind: CompetitionStatusKind
  /**
   * Short label in the visitor's language. Empty for competitions more than a
   * week out, where the day heading above the row already says everything
   * useful.
   */
  label: string
}

/**
 * Classify a competition relative to `now`. Rendered on the server first (so
 * the page is correct without JavaScript) and re-evaluated on the client every
 * 30s by components/competition-status.tsx.
 *
 * The timestamps carry an explicit UTC offset (see lib/data.ts), so this is
 * correct for visitors in every timezone. `intl` is the BCP 47 tag behind the
 * weekday name; `strings` supplies everything else.
 */
export function getCompetitionStatus(
  startTime: string,
  endTime: string,
  now: number,
  intl: string,
  strings: StatusStrings
): CompetitionStatus {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()

  if (now >= start && now <= end) return { kind: "live", label: strings.live }
  if (now > end) return { kind: "finished", label: strings.finished }

  const untilStart = start - now
  if (untilStart <= SOON_THRESHOLD_MS) {
    const minutes = Math.round(untilStart / 60_000)
    return {
      kind: "soon",
      label:
        minutes <= 1
          ? strings.soon
          : strings.inMinutes.replace("{minutes}", String(minutes)),
    }
  }

  const daysAway = berlinDayNumber(start) - berlinDayNumber(now)
  if (daysAway === 0) return { kind: "upcoming", label: strings.today }
  if (daysAway === 1) return { kind: "upcoming", label: strings.tomorrow }
  if (daysAway <= 6) {
    return {
      kind: "upcoming",
      label: berlinFormatter(intl, { weekday: "long" }).format(start),
    }
  }

  return { kind: "upcoming", label: "" }
}
