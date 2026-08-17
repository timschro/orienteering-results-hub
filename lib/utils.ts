import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// All competitions take place in Germany, so every date and time is displayed
// in Europe/Berlin regardless of where the visitor is.
const BERLIN_TIME_ZONE = "Europe/Berlin"

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

// Determine if a competition is active based on start and end times.
// The timestamps carry an explicit UTC offset (see lib/data.ts), so this is
// correct for visitors in every timezone.
export function isCompetitionActive(startTime: string, endTime: string): boolean {
  const now = Date.now()
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()

  return now >= start && now <= end
}

// Displayed date, derived from startTime (ex: 27.06.2025)
export function formatCompetitionDate(startTime: string): string {
  return berlinDateFormatter.format(new Date(startTime))
}

// Machine-readable date for <time dateTime=""> (ex: 2025-06-27)
export function toCompetitionDateISO(startTime: string): string {
  const parts = berlinDateFormatter.formatToParts(new Date(startTime))
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ""

  return `${get("year")}-${get("month")}-${get("day")}`
}

// Format time window from ISO strings (ex: 08:00 - 16:00)
export function formatTimeWindow(startTime: string, endTime: string): string {
  const start = berlinTimeFormatter.format(new Date(startTime))
  const end = berlinTimeFormatter.format(new Date(endTime))

  return `${start} - ${end}`
}
