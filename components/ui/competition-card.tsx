"use client"

import { memo, useEffect, useState } from "react"
import { ExternalLink, Clock } from "lucide-react"
import Link from "next/link"
import { Competition } from "@/lib/data"
import { isCompetitionActive, formatTimeWindow } from "@/lib/utils"
import { ResultsQRCode } from "@/app/page"

interface CompetitionCardProps {
  competition: Competition
}

export const CompetitionCard = memo(function CompetitionCard({ competition }: CompetitionCardProps) {
  const [isActive, setIsActive] = useState(false)

  // Check if competition is active
  useEffect(() => {
    const checkIfActive = () => {
      setIsActive(isCompetitionActive(competition.startTime, competition.endTime))
    }

    // Initial check
    checkIfActive()

    // Update every 60 seconds
    const interval = setInterval(checkIfActive, 60000)

    return () => clearInterval(interval)
  }, [competition.startTime, competition.endTime])

  return (
    <div
      className={`border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow ${
        isActive ? "border-primary bg-primary/5" : ""
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold">{competition.name}</h2>
        {isActive && (
          <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
            Aktiv
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 text-muted-foreground mb-4">
        <time dateTime={competition.startTime.split('T')[0]}>{competition.date}</time>
        <span className="mx-1" aria-hidden="true">•</span>
        <Clock className="h-3 w-3" aria-hidden="true" />
        <p className="text-sm">{formatTimeWindow(competition.startTime, competition.endTime)}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div className="space-y-3 w-full md:w-1/2">
          <Link
            href={competition.liveResultsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Live Ergebnisse
          </Link>

          <Link
            href={competition.liveloxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Livelox
          </Link>
        </div>

        <ResultsQRCode value={competition.liveResultsUrl} />
      </div>
    </div>
  )
})