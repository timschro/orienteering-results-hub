import { headers } from "next/headers"
import { Compass } from "lucide-react"

import { CompetitionCard } from "@/components/ui/competition-card"
import { CurrentTime } from "@/components/current-time"
import { getDomainConfig, resolveDomain } from "@/lib/data"

// Server Component: the competition data is a compile-time constant, so the
// whole list is rendered into the HTML. Crawlers and social previews see the
// competition names and the results links without running any JavaScript.
export default async function Home() {
  const headersList = await headers()
  // The middleware sets x-domain; fall back to the Host header so the page is
  // correct even when it is reached without the middleware.
  const domain =
    headersList.get("x-domain") ?? resolveDomain(headersList.get("host")) ?? ""
  const domainConfig = getDomainConfig(domain)

  if (!domainConfig) {
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

  // Filter out competitions with empty URLs
  const visibleCompetitions = domainConfig.competitions.filter((competition) => {
    const hasLiveResults = competition.liveResultsUrl.trim() !== ""
    const hasLivelox = competition.liveloxUrl.trim() !== ""
    return hasLiveResults || hasLivelox
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-primary" aria-hidden="true" />
              <h1 className="text-2xl font-bold">{domainConfig.name}</h1>
            </div>
            <CurrentTime />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {visibleCompetitions.length === 0 ? (
          <div className="text-center py-12">
            <Compass className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Keine Live-Ergebnisse verfügbar</h2>
            <p className="text-muted-foreground">
              Derzeit sind keine Live-Ergebnisse für diese Veranstaltung verfügbar.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {visibleCompetitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
