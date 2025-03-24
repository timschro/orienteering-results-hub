"use client"

import { Compass, ExternalLink, Clock } from "lucide-react"
import Link from "next/link"
import QRCode from "react-qr-code"
import { useMobile } from "@/hooks/use-mobile"
import { useEffect, useState } from "react"

// Wettbewerb-Daten mit Zeitfenstern
const competitions = [
  {
    id: 1,
    name: "Frühlings-Waldlauf",
    date: "15.04.2025",
    startTime: "2025-04-15T08:00:00",
    endTime: "2025-04-15T16:00:00",
    liveResultsUrl: "https://oresults.eu/events/spring-forest-2025",
    liveloxUrl: "https://livelox.com/events/spring-forest-2025",
  },
  {
    id: 2,
    name: "Sommer-Hochland-Challenge",
    date: "22.06.2025",
    startTime: "2025-06-22T09:00:00",
    endTime: "2025-06-22T17:00:00",
    liveResultsUrl: "https://oresults.eu/events/highland-challenge-2025",
    liveloxUrl: "https://livelox.com/events/highland-challenge-2025",
  },
  {
    id: 3,
    name: "Herbst-Trail-Meisterschaften",
    date: "10.09.2025",
    startTime: "2025-09-10T08:30:00",
    endTime: "2025-09-10T15:30:00",
    liveResultsUrl: "https://oresults.eu/events/trail-masters-2025",
    liveloxUrl: "https://livelox.com/events/trail-masters-2025",
  },
  {
    id: 4,
    name: "Winter-Navigations-Cup",
    date: "05.12.2025",
    startTime: "2025-12-05T10:00:00",
    endTime: "2025-12-05T16:00:00",
    liveResultsUrl: "https://oresults.eu/events/navigation-cup-2025",
    liveloxUrl: "https://livelox.com/events/navigation-cup-2025",
  },
]

// Funktion zur Prüfung, ob ein Wettkampf aktiv ist
function isCompetitionActive(startTime: string, endTime: string): boolean {
  const now = new Date()
  const start = new Date(startTime)
  const end = new Date(endTime)

  return now >= start && now <= end
}

// Formatiert die Uhrzeit aus ISO-String (08:00 - 16:00)
function formatTimeWindow(startTime: string, endTime: string): string {
  const start = new Date(startTime)
  const end = new Date(endTime)

  const startHours = start.getHours().toString().padStart(2, "0")
  const startMinutes = start.getMinutes().toString().padStart(2, "0")
  const endHours = end.getHours().toString().padStart(2, "0")
  const endMinutes = end.getMinutes().toString().padStart(2, "0")

  return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`
}

// Wettbewerb-Karten-Komponente
function CompetitionCard({ competition }: { competition: (typeof competitions)[0] }) {
  const isMobile = useMobile()
  const [isActive, setIsActive] = useState(false)

  // Prüft, ob der Wettkampf aktiv ist
  useEffect(() => {
    const checkIfActive = () => {
      setIsActive(isCompetitionActive(competition.startTime, competition.endTime))
    }

    // Initial prüfen
    checkIfActive()

    // Alle 60 Sekunden aktualisieren
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
        <p>{competition.date}</p>
        <span className="mx-1">•</span>
        <Clock className="h-3 w-3" />
        <p className="text-sm">{formatTimeWindow(competition.startTime, competition.endTime)}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div className="space-y-3 w-full md:w-1/2">
          <Link
            href={competition.liveResultsUrl}
            target="_blank"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Live Ergebnisse
          </Link>

          <Link
            href={competition.liveloxUrl}
            target="_blank"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Livelox
          </Link>
        </div>

        {!isMobile && (
          <div className="w-full md:w-auto">
            <QRCode value={competition.liveResultsUrl} size={120} className="mx-auto md:mx-0" />
            <p className="text-xs text-center md:text-left mt-2 text-muted-foreground">Scannen für Live Ergebnisse</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  // State für aktuelle Zeit (für Demo-Zwecke)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  // Aktualisiert die Zeit jede Minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">OL Live Results</h1>
            </div>
            <div className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString("de-DE")}{" "}
              {currentTime.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid gap-6 md:grid-cols-2">
          {competitions.map((competition) => (
            <CompetitionCard key={competition.id} competition={competition} />
          ))}
        </div>
      </main>
    </div>
  )
}

