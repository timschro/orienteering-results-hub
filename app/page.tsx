import { headers } from "next/headers"
import { Compass } from "lucide-react"

import { CompetitionRow } from "@/components/competition-row"
import { FeaturedCompetition } from "@/components/featured-competition"
import { getCompetitionStatus } from "@/lib/competition-status"
import { getDomainConfig, resolveDomain } from "@/lib/data"
import { hasPublishedStartList } from "@/lib/oresults"
import {
  formatEventDateRange,
  groupCompetitionsByDay,
  pickFeaturedCompetition,
} from "@/lib/utils"

// Footer links are text rather than buttons, so they get vertical padding to
// reach a tappable height without the row looking like a toolbar.
const footerLink =
  "inline-block py-1 underline underline-offset-4 transition-colors hover:text-foreground"

// Server Component: the competition data is a compile-time constant, so the
// whole timetable - including which competition is featured and what each
// status says - is rendered into the HTML. The page is fully usable without
// JavaScript; components/competition-status.tsx is the only client component,
// and it only keeps the relative labels ticking.
export default async function Home() {
  const headersList = await headers()
  // The middleware sets x-domain; fall back to the Host header so the page is
  // correct even when it is reached without the middleware.
  const domain =
    headersList.get("x-domain") ?? resolveDomain(headersList.get("host")) ?? ""
  const domainConfig = getDomainConfig(domain)

  if (!domainConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="max-w-sm text-center">
          <Compass className="mx-auto mb-4 h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <h1 className="mb-2 text-xl font-bold">Domain nicht unterstützt</h1>
          <p className="text-muted-foreground">
            Diese Domain wird nicht unterstützt. Bitte verwenden Sie eine der unterstützten
            Domains.
          </p>
        </div>
      </div>
    )
  }

  // Competitions without any link have nothing to offer yet.
  const visibleCompetitions = domainConfig.competitions.filter(
    (competition) =>
      competition.liveResultsUrl.trim() !== "" || competition.liveloxUrl.trim() !== ""
  )

  // One timestamp for the whole render, so every status on the page agrees.
  const now = Date.now()
  const featured = pickFeaturedCompetition(visibleCompetitions, now)
  const days = groupCompetitionsByDay(visibleCompetitions)
  const hasLivelox = visibleCompetitions.some(
    (competition) => competition.liveloxUrl.trim() !== ""
  )

  // Which competitions already have a start list on OResults. Only races
  // inside the pre-race window are actually asked about, and every failure
  // resolves to `null`, so this cannot break the render (see lib/oresults.ts).
  const startLists = new Map(
    await Promise.all(
      visibleCompetitions.map(
        async (competition) =>
          [competition.id, await hasPublishedStartList(competition, now)] as const
      )
    )
  )

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-6">
          <Compass className="h-7 w-7 shrink-0 text-primary" aria-hidden="true" />
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-balance sm:text-2xl">
              {domainConfig.name}
            </h1>
            {visibleCompetitions.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {formatEventDateRange(visibleCompetitions)} · {domainConfig.region}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8">
        {visibleCompetitions.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="mb-2 text-lg font-semibold">Noch keine Ergebnisse</h2>
            <p className="text-muted-foreground">
              Für diese Veranstaltung sind noch keine Live-Ergebnisse verlinkt.
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <FeaturedCompetition
                competition={featured}
                status={getCompetitionStatus(featured.startTime, featured.endTime, now)}
                hasStartList={startLists.get(featured.id) === true}
              />
            )}

            {days.map((day) => (
              <section key={day.date} className="mb-8 last:mb-0">
                <h2 className="sticky top-0 z-10 -mx-5 bg-background/95 px-5 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground backdrop-blur">
                  {day.heading}
                </h2>
                <ul className="divide-y">
                  {day.competitions.map((competition) => (
                    <CompetitionRow
                      key={competition.id}
                      competition={competition}
                      status={getCompetitionStatus(
                        competition.startTime,
                        competition.endTime,
                        now
                      )}
                      hasStartList={startLists.get(competition.id) === true}
                    />
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
      </main>

      <footer className="mx-auto max-w-2xl px-5 pb-10 text-sm text-muted-foreground">
        <p>
          {domainConfig.organizationUrl ? (
            <a
              href={domainConfig.organizationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={footerLink}
            >
              {domainConfig.organization}
            </a>
          ) : (
            domainConfig.organization
          )}{" "}
          · Ergebnisse von OResults
          {hasLivelox && ", Karten von Livelox"}
        </p>

        {/* Impressum and Datenschutz live on the organiser's site; see the
            DomainConfig comment in lib/data.ts. Only rendered for domains that
            name them, so the other domain is never given the wrong imprint. */}
        {(domainConfig.imprintUrl || domainConfig.privacyUrl) && (
          <p className="mt-1 flex flex-wrap gap-x-4">
            {domainConfig.imprintUrl && (
              <a
                href={domainConfig.imprintUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={footerLink}
              >
                Impressum
              </a>
            )}
            {domainConfig.privacyUrl && (
              <a
                href={domainConfig.privacyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={footerLink}
              >
                Datenschutz
              </a>
            )}
          </p>
        )}
      </footer>
    </div>
  )
}
