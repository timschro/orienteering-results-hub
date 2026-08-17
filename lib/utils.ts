import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Competition } from "@/lib/data"
import { BERLIN_TIME_ZONE, toCompetitionDateISO } from "@/lib/competition-status"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Everything below is server-only in practice: the page renders the whole
// timetable on the server. The status helpers the client does need live in
// lib/competition-status.ts, deliberately apart from `cn`.

const berlinDateFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: BERLIN_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const berlinTimeFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: BERLIN_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

const berlinWeekdayFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: BERLIN_TIME_ZONE,
  weekday: "long",
})

const berlinDayMonthFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: BERLIN_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
})

const berlinDayFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: BERLIN_TIME_ZONE,
  day: "numeric",
})

const berlinMonthFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: BERLIN_TIME_ZONE,
  month: "long",
})

const berlinYearFormatter = new Intl.DateTimeFormat("de-DE", {
  timeZone: BERLIN_TIME_ZONE,
  year: "numeric",
})

// Displayed date, derived from startTime (ex: 27.06.2025)
export function formatCompetitionDate(startTime: string): string {
  return berlinDateFormatter.format(new Date(startTime))
}

// Format time window from ISO strings (ex: 08:00 - 16:00)
export function formatTimeWindow(startTime: string, endTime: string): string {
  const start = berlinTimeFormatter.format(new Date(startTime))
  const end = berlinTimeFormatter.format(new Date(endTime))

  return `${start} - ${end}`
}

// Start time only, for the timetable's left-hand column (ex: 11:00)
export function formatStartTime(startTime: string): string {
  return berlinTimeFormatter.format(new Date(startTime))
}

export interface CompetitionDay {
  /** YYYY-MM-DD in Berlin. Stable React key and `<time dateTime>` value. */
  date: string
  /** Heading for the day group (ex: "Freitag, 28.08.") */
  heading: string
  competitions: Competition[]
}

/**
 * Group competitions into Berlin calendar days, chronologically. Derived from
 * `startTime` so that adding an event stays a single edit in lib/data.ts.
 */
export function groupCompetitionsByDay(competitions: Competition[]): CompetitionDay[] {
  const days = new Map<string, CompetitionDay>()

  for (const competition of sortByStart(competitions)) {
    const date = toCompetitionDateISO(competition.startTime)
    const day = days.get(date)

    if (day) {
      day.competitions.push(competition)
      continue
    }

    const start = new Date(competition.startTime)
    days.set(date, {
      date,
      heading: `${berlinWeekdayFormatter.format(start)}, ${berlinDayMonthFormatter.format(start)}`,
      competitions: [competition],
    })
  }

  return [...days.values()]
}

/**
 * Human-readable span of the whole event, for the page header
 * (ex: "28.-30. August 2026"). Collapses the shared month and year.
 */
export function formatEventDateRange(competitions: Competition[]): string {
  if (competitions.length === 0) return ""

  const times = competitions.map((competition) => new Date(competition.startTime).getTime())
  const first = new Date(Math.min(...times))
  const last = new Date(Math.max(...times))

  const day = (date: Date) => berlinDayFormatter.format(date)
  const month = (date: Date) => berlinMonthFormatter.format(date)
  const year = (date: Date) => berlinYearFormatter.format(date)

  if (toCompetitionDateISO(first) === toCompetitionDateISO(last)) {
    return `${day(first)}. ${month(first)} ${year(first)}`
  }
  if (year(first) !== year(last)) {
    return `${day(first)}. ${month(first)} ${year(first)} - ${day(last)}. ${month(last)} ${year(last)}`
  }
  if (month(first) !== month(last)) {
    return `${day(first)}. ${month(first)} - ${day(last)}. ${month(last)} ${year(last)}`
  }

  return `${day(first)}.-${day(last)}. ${month(first)} ${year(first)}`
}

/**
 * The one competition promoted above the timetable: whichever is running now,
 * otherwise the next one to start. `null` once the whole event is over, which
 * collapses the page back to a plain timetable.
 *
 * Chosen on the server, so it only changes when the page is re-fetched. The
 * CDN holds the HTML for 60s (see middleware.ts), which is immaterial for a
 * race that runs for hours.
 */
export function pickFeaturedCompetition(
  competitions: Competition[],
  now: number = Date.now()
): Competition | null {
  const chronological = sortByStart(competitions)

  const live = chronological.find((competition) => {
    const start = new Date(competition.startTime).getTime()
    const end = new Date(competition.endTime).getTime()
    return now >= start && now <= end
  })
  if (live) return live

  const next = chronological.find(
    (competition) => new Date(competition.startTime).getTime() > now
  )
  return next ?? null
}

/** The data is authored in order, but nothing enforces it. */
function sortByStart(competitions: Competition[]): Competition[] {
  return [...competitions].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )
}
