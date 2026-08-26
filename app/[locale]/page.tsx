import type { Metadata } from "next"
import { headers } from "next/headers"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Compass } from "lucide-react"

import { CompetitionRow } from "@/components/competition-row"
import { FeaturedCompetition } from "@/components/featured-competition"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getCompetitionStatus } from "@/lib/competition-status"
import { fill, getTranslation } from "@/lib/dictionaries"
import { DEFAULT_DOMAIN, getDomainConfig, resolveDomain } from "@/lib/data"
import { isLocale, LOCALES, LOCALE_META } from "@/lib/i18n"
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

// The locale lives in the path, so every language is a separate URL the CDN can
// cache on its own and a separate page search engines can index. `/` never
// renders anything itself - middleware.ts redirects it to one of these.
//
// Deliberately no `generateStaticParams`: the page reads `headers()` for the
// domain and `Date.now()` for the featured competition, so it is rendered per
// request in every language regardless. Listing the params would only claim a
// prerender that never happens.

async function currentDomain(): Promise<string> {
  const headersList = await headers()
  // The middleware sets x-domain; fall back to the Host header so the page is
  // correct even when it is reached without the middleware.
  return (
    headersList.get("x-domain") ?? resolveDomain(headersList.get("host")) ?? ""
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { t } = getTranslation(isLocale(locale) ? locale : "de")

  const domainConfig = getDomainConfig((await currentDomain()) || DEFAULT_DOMAIN)

  const title = domainConfig?.name || "Orienteering Results Hub"
  const description = fill(t.metaDescription, {
    event: domainConfig?.name || title,
  })

  return {
    title,
    description,
    // metadataBase is inherited from app/layout.tsx, which is what makes these
    // relative alternates resolve to absolute URLs.
    alternates: {
      canonical: `/${locale}`,
      // Every language is a real URL, so search engines can be told about all
      // of them. `x-default` points at `/`, which is the only address that
      // negotiates - it redirects on Accept-Language (see middleware.ts).
      languages: {
        ...Object.fromEntries(
          LOCALES.map((option) => [LOCALE_META[option].htmlLang, `/${option}`])
        ),
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      locale: LOCALE_META[isLocale(locale) ? locale : "de"].intl.replace("-", "_"),
      title,
      description,
      siteName: title,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

// Server Component: the competition data is a compile-time constant, so the
// whole timetable - including which competition is featured and what each
// status says - is rendered into the HTML. The page is fully usable without
// JavaScript; components/competition-status.tsx is the only client component,
// and it only keeps the relative labels ticking.
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  // Anything that is not one of our seven languages is a 404 rather than a
  // silent fallback: /es must not quietly serve German under a Spanish URL.
  if (!isLocale(locale)) notFound()

  const translation = getTranslation(locale)
  const { intl, t } = translation

  const domainConfig = getDomainConfig(await currentDomain())

  if (!domainConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="max-w-sm text-center">
          <Compass className="mx-auto mb-4 h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <h1 className="mb-2 text-xl font-bold">{t.unsupportedDomain.title}</h1>
          <p className="text-muted-foreground">{t.unsupportedDomain.body}</p>
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
  const days = groupCompetitionsByDay(visibleCompetitions, intl)
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
          {/* The logo already reads as the event's mark and the heading beside
              it says the same thing, so the image is decorative. `unoptimized`
              because the optimiser refuses SVG without dangerouslyAllowSVG and
              has nothing to gain on a 12KB vector anyway. */}
          {domainConfig.logo ? (
            <Image
              src={domainConfig.logo.src}
              width={domainConfig.logo.width}
              height={domainConfig.logo.height}
              alt=""
              unoptimized
              priority
              className="h-11 w-auto shrink-0 sm:h-14"
            />
          ) : (
            <Compass className="h-7 w-7 shrink-0 text-primary" aria-hidden="true" />
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-balance sm:text-2xl">
              {domainConfig.name}
            </h1>
            {visibleCompetitions.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {formatEventDateRange(visibleCompetitions, intl)} · {domainConfig.region}
              </p>
            )}
          </div>

          <LanguageSwitcher translation={translation} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8">
        {visibleCompetitions.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="mb-2 text-lg font-semibold">{t.empty.title}</h2>
            <p className="text-muted-foreground">{t.empty.body}</p>
          </div>
        ) : (
          <>
            {featured && (
              <FeaturedCompetition
                competition={featured}
                status={getCompetitionStatus(
                  featured.startTime,
                  featured.endTime,
                  now,
                  intl,
                  t.status
                )}
                translation={translation}
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
                        now,
                        intl,
                        t.status
                      )}
                      translation={translation}
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
          · {t.footer.results}
          {hasLivelox && `, ${t.footer.maps}`}
        </p>

        {/* Impressum and Datenschutz live on the organiser's site; see the
            DomainConfig comment in lib/data.ts. Only rendered for domains that
            name them, so the other domain is never given the wrong imprint.
            The pages themselves are German whatever the visitor reads the
            timetable in, so the links are marked `hrefLang="de"`. */}
        {(domainConfig.imprintUrl || domainConfig.privacyUrl) && (
          <p className="mt-1 flex flex-wrap gap-x-4">
            {domainConfig.imprintUrl && (
              <a
                href={domainConfig.imprintUrl}
                target="_blank"
                rel="noopener noreferrer"
                hrefLang="de"
                className={footerLink}
              >
                {t.footer.imprint}
              </a>
            )}
            {domainConfig.privacyUrl && (
              <a
                href={domainConfig.privacyUrl}
                target="_blank"
                rel="noopener noreferrer"
                hrefLang="de"
                className={footerLink}
              >
                {t.footer.privacy}
              </a>
            )}
          </p>
        )}
      </footer>
    </div>
  )
}
