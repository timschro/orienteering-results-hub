import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Competition } from "@/lib/data"
import type { Dictionary, RaceFormat } from "@/lib/dictionaries"
import { berlinFormatter, toCompetitionDateISO } from "@/lib/competition-status"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Everything below is server-only in practice: the page renders the whole
// timetable on the server. The status helpers the client does need live in
// lib/competition-status.ts, deliberately apart from `cn`.
//
// Every formatter takes an `intl` BCP 47 tag (from lib/i18n.ts) and is pinned
// to Europe/Berlin by `berlinFormatter`. The event is in Germany, so the clock
// is always the organiser's; only the notation follows the visitor's language.

/**
 * What to call a competition in the reader's language.
 *
 * A competition that names one of the standard formats (`race` in
 * lib/data.ts) is titled from the dictionary; anything else keeps the name
 * the organiser gave it, untranslated, which is what a proper noun wants.
 */
export function competitionName(competition: Competition, t: Dictionary): string {
  if (!competition.race) return competition.name

  const format = t.races[competition.race]
  return competition.number === undefined ? format : `${format} ${competition.number}`
}

// Displayed date, derived from startTime (ex: 27.06.2025 / 27/06/2025)
export function formatCompetitionDate(startTime: string, intl: string): string {
  return berlinFormatter(intl, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(startTime))
}

// Format time window from ISO strings (ex: 08:00 - 16:00). `h23` in every
// language: the timetable's time column must stay one narrow, uniform width,
// and 24-hour time is unambiguous in all seven.
export function formatTimeWindow(
  startTime: string,
  endTime: string,
  intl: string
): string {
  const formatter = berlinFormatter(intl, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })

  return `${formatter.format(new Date(startTime))} - ${formatter.format(new Date(endTime))}`
}

// Start time only, for the timetable's left-hand column (ex: 11:00)
export function formatStartTime(startTime: string, intl: string): string {
  return berlinFormatter(intl, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(startTime))
}

export interface CompetitionDay {
  /** YYYY-MM-DD in Berlin. Stable React key and `<time dateTime>` value. */
  date: string
  /** Heading for the day group (ex: "Freitag, 28.08." / "Friday 28/08") */
  heading: string
  competitions: Competition[]
}

/**
 * Group competitions into Berlin calendar days, chronologically. Derived from
 * `startTime` so that adding an event stays a single edit in lib/data.ts.
 *
 * The heading is one `Intl` pattern rather than a weekday and a date glued
 * together, so each language gets its own separator and word order - and its
 * own capitalisation, which is why the heading is styled `uppercase`: Swedish,
 * Danish, Norwegian, French and Dutch all lowercase weekday names mid-sentence.
 */
export function groupCompetitionsByDay(
  competitions: Competition[],
  intl: string
): CompetitionDay[] {
  const days = new Map<string, CompetitionDay>()
  const headingFormatter = berlinFormatter(intl, {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  })

  for (const competition of sortByStart(competitions)) {
    const date = toCompetitionDateISO(competition.startTime)
    const day = days.get(date)

    if (day) {
      day.competitions.push(competition)
      continue
    }

    days.set(date, {
      date,
      heading: headingFormatter.format(new Date(competition.startTime)),
      competitions: [competition],
    })
  }

  return [...days.values()]
}

/**
 * The Berlin day a combined classification belongs to: the day the *last* race
 * of that format runs, which is the moment the combined result becomes final
 * and the only day a link to it is not a promise about races still to come.
 *
 * Derived rather than configured, so `overallResults` in lib/data.ts does not
 * carry a date that can drift from the competitions it describes - move the
 * sprints to another day and the link moves with them.
 *
 * `null` when no competition has that format at all. The caller renders the
 * link after the timetable in that case rather than dropping it: a link in the
 * wrong place is visible and fixable, a missing one is not.
 */
export function lastDayOfRace(
  competitions: Competition[],
  race: RaceFormat
): string | null {
  const ofFormat = sortByStart(competitions.filter((c) => c.race === race))
  const last = ofFormat[ofFormat.length - 1]

  return last ? toCompetitionDateISO(last.startTime) : null
}

/**
 * Human-readable span of the whole event, for the page header
 * (ex: "28.-30. August 2026" / "28-30 August 2026").
 *
 * `formatRange` rather than hand-built separators: it already knows to
 * collapse the shared month and year, which of the two dates carries the
 * month in each language, and which dash to use - and it returns the plain
 * single date when the event lasts one day.
 */
export function formatEventDateRange(
  competitions: Competition[],
  intl: string
): string {
  if (competitions.length === 0) return ""

  const times = competitions.map((competition) =>
    new Date(competition.startTime).getTime()
  )

  return berlinFormatter(intl, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatRange(new Date(Math.min(...times)), new Date(Math.max(...times)))
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
