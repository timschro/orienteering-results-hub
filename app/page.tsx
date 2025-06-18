"use client"

import { Suspense, useEffect, useState, memo } from "react"
import { Compass, ExternalLink, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { getCompetitionsForDomain, getDomainConfig } from "@/lib/data"
import { formatTimeWindow, isCompetitionActive } from "@/lib/utils"
import { CompetitionCard } from "@/components/ui/competition-card"
import { useMobile } from "@/hooks/use-mobile"
import { useDomain } from "@/hooks/use-domain"
import { Skeleton } from "@/components/ui/skeleton"

// Dynamically import QRCode with no SSR
const QRCode = dynamic(() => import("react-qr-code"), { ssr: false })

export default function Home() {
  const { domainConfig, isLoading, isSupportedDomain } = useDomain()
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-6 w-6 text-primary" aria-hidden="true" />
                <Skeleton className="h-8 w-48" />
              </div>
              <ClientTime />
            </div>
          </div>
        </header>
        <main className="container mx-auto py-8 px-4">
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3].map((i) => (
              <CompetitionCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (!isSupportedDomain) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Compass className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Domain nicht unterstützt</h1>
          <p className="text-muted-foreground">
            Diese Domain wird nicht unterstützt. Bitte verwenden Sie eine der unterstützten Domains.
          </p>
        </div>
      </div>
    )
  }

  const competitions = domainConfig?.competitions || []

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" aria-hidden="true" />
              <h1 className="text-2xl font-bold">{domainConfig?.name || 'OL Live Results'}</h1>
            </div>
            <ClientTime />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="grid gap-6 md:grid-cols-2">
          {competitions.map((competition) => (
            <Suspense key={competition.id} fallback={<CompetitionCardSkeleton />}>
              <CompetitionCard competition={competition} />
            </Suspense>
          ))}
        </div>
      </main>
    </div>
  )
}

// Client Components

// Client-side time component
const ClientTime = memo(function ClientTime() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <time dateTime={currentTime.toISOString()} className="text-sm text-muted-foreground">
      {currentTime.toLocaleDateString("de-DE")}{" "}
      {currentTime.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
    </time>
  )
})

// Fully client-side QR code component
export const ResultsQRCode = memo(function ResultsQRCode({ value }: { value: string }) {
  const isMobile = useMobile()
  
  if (isMobile) return null
  
  return (
    <div className="w-full md:w-auto">
      <QRCode 
        value={value} 
        size={120} 
        className="mx-auto md:mx-0" 
        aria-label={`QR code für ${value}`}
      />
      <p className="text-xs text-center md:text-left mt-2 text-muted-foreground">
       Live Results
      </p>
    </div>
  )
})

// Loading skeleton
function CompetitionCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-7 w-48" />
      </div>
      <div className="flex items-center gap-2 text-muted-foreground mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div className="space-y-3 w-full md:w-1/2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-36" />
        </div>
      </div>
    </div>
  )
}

