// Single source of truth for domains and their competition data.
//
// Adding a domain is ONE edit: add an entry to `DOMAIN_CONFIGS` below.
// `SUPPORTED_DOMAINS` (and therefore the middleware allowlist) is derived from
// the keys of this object, so the allowlist can never drift from the data.

import type { RaceFormat } from "@/lib/dictionaries"

export interface Competition {
  id: number
  /**
   * What the organiser calls the race. Shown as-is in every language, which
   * is the right answer for a proper noun - and the fallback whenever `race`
   * is not set.
   */
  name: string
  /**
   * The standard race format this competition is, when it is one. Set it and
   * the name shown follows the reader's language instead of `name`; leave it
   * unset and `name` is used everywhere. See `RaceFormat` in
   * lib/dictionaries.ts for the vocabulary.
   */
  race?: RaceFormat
  /**
   * Distinguishes repeated runs of the same format on one weekend, appended
   * after the translated name ("Sprint 1", "Sprint 2"). Every language we
   * serve puts the numeral last, so it needs no translation of its own.
   */
  number?: number
  /**
   * ISO 8601 timestamp *with an explicit UTC offset*.
   * Germany is +02:00 during CEST (late March - late October) and +01:00
   * during CET. The offset is required: without it the timestamp is parsed in
   * the viewer's local timezone and the "Aktiv" badge fires at the wrong
   * wall-clock time outside Europe/Berlin.
   */
  startTime: string
  /** ISO 8601 timestamp with an explicit UTC offset. See `startTime`. */
  endTime: string
  liveResultsUrl: string
  liveloxUrl: string
  /**
   * The organiser's official result list, as exported from the competition
   * software after the race. Absolute URL to wherever the organiser publishes
   * it; the button is hidden while this is unset, so leaving it out is the
   * correct state for a race that has not been finalised.
   *
   * This is the definitive result. OResults stays linked beside it because it
   * carries splits and the live view, and Livelox because it carries the
   * routes - the PDF replaces neither.
   */
  resultsPdfUrl?: string
}

export interface DomainConfig {
  /** Display name shown in the page header and the <title>. */
  name: string
  description: string
  region: string
  organization: string
  /** The organiser's own website, linked from their name in the footer. */
  organizationUrl?: string
  /**
   * The event logo, shown in the header in place of the generic compass.
   * `width`/`height` are the file's own dimensions - they only set the aspect
   * ratio the browser reserves before the SVG loads, so the header never
   * jumps. A domain without a logo keeps the compass.
   */
  logo?: { src: string; width: number; height: number; alt: string }
  /**
   * A German site needs a reachable Impressum and Datenschutzerklärung. This
   * one publishes no content of its own beyond a timetable of links, so it
   * points at the organiser's pages rather than keeping a second copy that
   * could fall out of date. Per domain, because each domain has a different
   * organiser behind it - a shared hardcoded link would put the wrong
   * imprint on the other domain.
   */
  imprintUrl?: string
  privacyUrl?: string
  /**
   * Standings combining several runnings of one format into a single
   * classification - the two sprints of a Hamburg weekend add up to one sprint
   * result, and that combined list is what the event is actually won on.
   *
   * `race` is what it combines, not the event: this PDF ranks the sprints and
   * says nothing about the prologue or the middle distance, so it is labelled
   * "Gesamtwertung Sprint" rather than a bare "Gesamtwertung" that would claim
   * more than the file contains. It reuses the `RaceFormat` vocabulary, so the
   * label follows the reader's language like every other race name.
   *
   * Event-level rather than per-competition: it belongs to no single race, and
   * hanging it off one of them would put two links both calling themselves the
   * results on the same row.
   */
  overallResults?: { race: RaceFormat; url: string }
  competitions: Competition[]
}

export const DOMAIN_CONFIGS = {
  "results.ol-dm.de": {
    name: "DM Sprint 2026 in Bad Harzburg",
    description: "Live results for German Championship orienteering events",
    region: "Germany",
    organization: "DM-OL",
    competitions: [
      {
        id: 1,
        name: "DM Sprint Qualifikation",
        race: "sprintQualification",
        startTime: "2026-05-23T12:00:00+02:00",
        endTime: "2026-05-23T18:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3188/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189036/DM-Sprint-2026-Qualifikation",
      },
      {
        id: 2,
        name: "DM Sprint Finale",
        race: "sprintFinal",
        startTime: "2026-05-24T09:00:00+02:00",
        endTime: "2026-05-24T15:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3189/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189038/DM-Sprint-2026-Finale",
      },
      {
        id: 3,
        name: "DM K.O.-Sprint Halbfinale",
        race: "knockoutSprintSemifinal",
        startTime: "2026-05-24T16:00:00+02:00",
        endTime: "2026-05-24T19:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3190/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189463/DM-KO-Sprint-Halbfinale",
      },
      {
        id: 4,
        name: "DM K.O.-Sprint Finale",
        race: "knockoutSprintFinal",
        startTime: "2026-05-24T19:15:00+02:00",
        endTime: "2026-05-24T21:30:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3257/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189464/DM-KO-Sprint-Finale",
      },
      {
        id: 5,
        name: "DM Sprintstaffel",
        race: "sprintRelay",
        startTime: "2026-05-25T09:00:00+02:00",
        endTime: "2026-05-25T15:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3191/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189041/DM-Sprintstaffel-2026",
      },
    ],
  },
  "results.hamburg-ol.de": {
    name: "Hamburg-OL 2026",
    description: "Live results for Hamburg orienteering events",
    region: "Hamburg",
    organization: "Hamburg-OL",
    organizationUrl: "https://hamburg-ol.de",
    logo: { src: "/Hamburg-OL.svg", width: 3476, height: 1932, alt: "Hamburg-OL" },
    imprintUrl: "https://hamburg-ol.de/de/impressum",
    privacyUrl: "https://hamburg-ol.de/de/datenschutz",
    // Combined standings over Sprint 1 and Sprint 2 (MeOS "Total Results",
    // columns Total time / Stage 1 / Stage 2). Published the evening of the
    // second sprint, a day before the middle distance.
    overallResults: {
      race: "sprint",
      url: "https://view.oschh.de/v/1yYtBWs3oNfOspdV2AHRT0VGtR2wg62Ri.J5orS63BO8w",
    },
    // Names, dates and OResults event IDs are taken from oresults.eu
    // (events 3655-3658, 28.-30.08.2026).
    //
    // All four events are now published on Livelox as well. If a future event
    // is missing there, the card hides the Livelox link while `liveloxUrl` is
    // "", so an empty string is the correct placeholder - do not use a dummy
    // URL.
    //
    // The result PDFs are MeOS exports living in the organiser's Drive folder
    // "Hamburg-OL 2026 - Winterhude/Public", shared read-only with anyone who
    // has the link.
    //
    // They are linked through view.oschh.de rather than drive.google.com. A
    // Drive share link opens Google's viewer page - JavaScript-dependent,
    // wrapped in Google's own chrome, and inclined to hand off to the Drive app
    // on a phone. view.oschh.de streams the same file back as
    // `application/pdf` inline, so the link opens the document itself. That
    // buys a second thing to keep alive: a dead link now needs only one of
    // Drive or view.oschh.de to break.
    //
    // A link is `<Drive file id>.<truncated HMAC>`, minted by pasting the Drive
    // link into view.oschh.de/admin. Signing is deterministic, so a file always
    // yields the same link - but rotating that app's ENCRYPTION_KEY invalidates
    // every link below at once.
    competitions: [
      {
        id: 1,
        name: "Prolog",
        race: "prologue",
        // Friday evening before the sprints, as in 2025.
        startTime: "2026-08-28T17:00:00+02:00",
        endTime: "2026-08-28T20:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3655/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/200157/Hamburg-OL-2026-Prolog",
        resultsPdfUrl: "https://view.oschh.de/v/11fQy7oFtobtYLj798ZDkKeL1wRf6KM4v.V53nkOQTdVE",
      },
      {
        id: 2,
        name: "Sprint 1",
        race: "sprint",
        number: 1,
        startTime: "2026-08-29T11:00:00+02:00",
        endTime: "2026-08-29T14:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3656/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/199868/Hamburg-Sprint-2026-1-Lauf",
        resultsPdfUrl: "https://view.oschh.de/v/13M1_tQarcztEIGJsUg7dRihNI0IEYZVH.zuiULFE1p_g",
      },
      {
        id: 3,
        name: "Sprint 2",
        race: "sprint",
        number: 2,
        startTime: "2026-08-29T15:00:00+02:00",
        endTime: "2026-08-29T18:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3657/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/199869/Hamburg-Sprint-2026-2-Lauf",
        resultsPdfUrl: "https://view.oschh.de/v/1UTm9a2ad3jtxfsqndi9sff7UYafRnEDo._dnDHbYlooM",
      },
      {
        id: 4,
        name: "Mitteldistanz",
        race: "middleDistance",
        startTime: "2026-08-30T10:30:00+02:00",
        endTime: "2026-08-30T13:30:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3658/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/199885/Hamburg-OL-2026-Mitteldistanz",
        resultsPdfUrl:
          "https://view.oschh.de/v/19mFShoMfLBM-nmHH1Fun28IELNQgu4sO.8NRolIKvfyk",
      },
    ],
  },
} satisfies Record<string, DomainConfig>

export type Domain = keyof typeof DOMAIN_CONFIGS

/** Derived from the config keys - it cannot disagree with the data. */
export const SUPPORTED_DOMAINS = Object.keys(DOMAIN_CONFIGS) as Domain[]

/** Domain used for local development and preview deployments. */
export const DEFAULT_DOMAIN: Domain = "results.hamburg-ol.de"

export function isSupportedDomain(domain: string): domain is Domain {
  return Object.prototype.hasOwnProperty.call(DOMAIN_CONFIGS, domain)
}

export function getDomainConfig(domain: string): DomainConfig | undefined {
  return isSupportedDomain(domain) ? DOMAIN_CONFIGS[domain] : undefined
}

export function getCompetitionsForDomain(domain: string): Competition[] {
  return getDomainConfig(domain)?.competitions ?? []
}

/** The non-competition metadata of a domain, as exposed by /api/domain. */
export function getDomainInfo(domain: string) {
  const config = getDomainConfig(domain)
  if (!config) return undefined

  const { name, description, region, organization } = config
  return { name, description, region, organization }
}

/**
 * Hosts that are not public domains: local development and Vercel previews
 * (including the project's own *.vercel.app production URL). These are served
 * the `DEFAULT_DOMAIN` instead of being redirected away.
 */
export function isDevelopmentHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".vercel.app")
  )
}

/** Strip any port from a `Host` header value. */
export function hostnameFromHeader(host: string | null | undefined): string {
  if (!host) return ""
  // IPv6 literals arrive as [::1]:3000
  if (host.startsWith("[")) return host.slice(1, host.indexOf("]"))
  return host.split(":")[0]
}

/**
 * Resolve the `Host` header (or the middleware-provided `x-domain`) to a
 * supported domain. Returns `null` for genuinely unknown public hosts, which
 * is what makes the "Domain nicht unterstützt" branch reachable.
 */
export function resolveDomain(host: string | null | undefined): Domain | null {
  const hostname = hostnameFromHeader(host)
  if (isSupportedDomain(hostname)) return hostname
  if (isDevelopmentHost(hostname)) return DEFAULT_DOMAIN
  return null
}
