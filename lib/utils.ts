import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Determine if a competition is active based on start and end times
export function isCompetitionActive(startTime: string, endTime: string): boolean {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)

  return now >= start && now <= end
}

// Format time window from ISO strings (ex: 08:00 - 16:00)
export function formatTimeWindow(startTime: string, endTime: string): string {
  const start = new Date(startTime)
  const end = new Date(endTime)

  const startHours = start.getHours().toString().padStart(2, "0")
  const startMinutes = start.getMinutes().toString().padStart(2, "0")
  const endHours = end.getHours().toString().padStart(2, "0")
  const endMinutes = end.getMinutes().toString().padStart(2, "0")

  return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`
}
