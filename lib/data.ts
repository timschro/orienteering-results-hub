// Single source of truth for domains and their competition data.
//
// Adding a domain is ONE edit: add an entry to `DOMAIN_CONFIGS` below.
// `SUPPORTED_DOMAINS` (and therefore the middleware allowlist) is derived from
// the keys of this object, so the allowlist can never drift from the data.

export interface Competition {
  id: number
  name: string
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
}

export interface DomainConfig {
  /** Display name shown in the page header and the <title>. */
  name: string
  description: string
  region: string
  organization: string
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
        startTime: "2026-05-23T12:00:00+02:00",
        endTime: "2026-05-23T18:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3188/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189036/DM-Sprint-2026-Qualifikation",
      },
      {
        id: 2,
        name: "DM Sprint Finale",
        startTime: "2026-05-24T09:00:00+02:00",
        endTime: "2026-05-24T15:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3189/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189038/DM-Sprint-2026-Finale",
      },
      {
        id: 3,
        name: "DM K.O.-Sprint Halbfinale",
        startTime: "2026-05-24T16:00:00+02:00",
        endTime: "2026-05-24T19:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3190/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189463/DM-KO-Sprint-Halbfinale",
      },
      {
        id: 4,
        name: "DM K.O.-Sprint Finale",
        startTime: "2026-05-24T19:15:00+02:00",
        endTime: "2026-05-24T21:30:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3257/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189464/DM-KO-Sprint-Finale",
      },
      {
        id: 5,
        name: "DM Sprintstaffel",
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
    // Names, dates and OResults event IDs are taken from oresults.eu
    // (events 3655-3658, 28.-30.08.2026).
    //
    // All four events are now published on Livelox as well. If a future event
    // is missing there, the card hides the Livelox link while `liveloxUrl` is
    // "", so an empty string is the correct placeholder - do not use a dummy
    // URL.
    competitions: [
      {
        id: 1,
        name: "Prolog",
        // Friday evening before the sprints, as in 2025.
        startTime: "2026-08-28T17:00:00+02:00",
        endTime: "2026-08-28T20:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3655/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/200157/Hamburg-OL-2026-Prolog",
      },
      {
        id: 2,
        name: "Sprint 1",
        startTime: "2026-08-29T11:00:00+02:00",
        endTime: "2026-08-29T14:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3656/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/199868/Hamburg-Sprint-2026-1-Lauf",
      },
      {
        id: 3,
        name: "Sprint 2",
        startTime: "2026-08-29T15:00:00+02:00",
        endTime: "2026-08-29T18:00:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3657/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/199869/Hamburg-Sprint-2026-2-Lauf",
      },
      {
        id: 4,
        name: "Mitteldistanz",
        startTime: "2026-08-30T10:30:00+02:00",
        endTime: "2026-08-30T13:30:00+02:00",
        liveResultsUrl: "https://oresults.eu/events/3658/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/199885/Hamburg-OL-2026-Mitteldistanz",
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
