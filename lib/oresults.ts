import { unstable_cache } from "next/cache"

import type { Competition } from "@/lib/data"

// Detects whether an OResults event has a start list published yet, so the
// timetable can say so in the days before a race - the window in which the
// most-asked question is "what is my start time".
//
// This reads https://cdn.oresults.eu/events/{id}/changes, which is the
// endpoint the OResults single-page app itself calls. It is UNDOCUMENTED and
// carries no stability guarantee, so every failure path here returns `null`
// ("don't know") and the page renders exactly as it did before. Nothing about
// the timetable depends on this succeeding.

const ORESULTS_EVENT_URL = /^https:\/\/oresults\.eu\/events\/(\d+)(?:\/|$)/

/** The OResults event id embedded in a results URL, if it is one. */
export function oresultsEventId(liveResultsUrl: string): number | null {
  const match = ORESULTS_EVENT_URL.exec(liveResultsUrl.trim())
  return match ? Number(match[1]) : null
}

/**
 * How long before a race we start asking. Organisers publish start lists days
 * ahead, not weeks, and outside this window the page makes no outbound
 * requests at all - which is most of the year.
 */
const WINDOW_BEFORE_START_MS = 10 * 24 * 60 * 60 * 1000

/**
 * Enough of the response to decide. The JSON is ordered `event`, `punches`,
 * `runners`, and `punches` is empty for the whole window (we stop asking once
 * the race starts), so the answer sits around byte 300.
 *
 * The wire cost is set by the CDN's chunk size, not by this number: an event
 * with no start list is a single ~400 byte chunk, one with a start list is one
 * ~16KB chunk. Both measured against live events.
 */
const PREFIX_BYTES = 2048

/** Bounded so a slow or hanging CDN can never hold up a page render. */
const TIMEOUT_MS = 2000

/**
 * Read only the head of the response and hang up.
 *
 * A published event's payload is ~429KB and there is no lighter endpoint, no
 * HEAD content-length and no Range support (all three checked). Cancelling the
 * stream after the prefix keeps each check to a couple of KB on the wire
 * instead of re-downloading the full result set every revalidation.
 */
async function readStartListState(eventId: number): Promise<boolean | null> {
  try {
    const response = await fetch(
      `https://cdn.oresults.eu/events/${eventId}/changes?since=0`,
      { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) }
    )

    if (!response.ok || !response.body) return null

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let prefix = ""

    try {
      while (prefix.length < PREFIX_BYTES) {
        const { done, value } = await reader.read()
        if (done) break
        prefix += decoder.decode(value, { stream: true })
      }
    } finally {
      // Discards the remaining ~429KB rather than pulling it down to look at
      // eleven characters near the front.
      await reader.cancel().catch(() => {})
    }

    if (prefix.includes('"runners":[]')) return false
    if (prefix.includes('"runners":[{')) return true

    // Anything else (a shape change, or punches already present and pushing
    // `runners` past the prefix) is a "don't know", not a "no".
    return null
  } catch {
    // Timeout, network error, malformed response - all mean the same thing
    // here, and none of them should be visible to a visitor.
    return null
  }
}

/**
 * Cached by event id in the Next Data Cache, so the number of requests to
 * OResults is bounded by this TTL rather than by how many people are looking
 * at the page. Zero visitors means zero requests.
 *
 * Half an hour rather than the few minutes used for genuinely live data. The
 * cost is asymmetric and backwards: while we are waiting a check is ~400
 * bytes, but from the moment the start list appears - the point at which the
 * answer stops changing and polling stops being useful - every check pulls
 * ~16KB. Since there is nowhere to record "already answered" without adding
 * storage, a longer TTL is what keeps this polite to an undocumented CDN we
 * do not own: roughly 2MB per competition over the days before a race,
 * against ~14MB at a five minute TTL.
 *
 * The trade is detection lag: with the CDN's s-maxage=60 (see middleware.ts) a
 * newly published start list surfaces within about half an hour. That is well
 * inside the useful window for a fact that lands days before the race.
 */
const getStartListState = unstable_cache(readStartListState, ["oresults-start-list"], {
  revalidate: 1800,
})

/**
 * `true` when a start list is published, `false` when it demonstrably is not,
 * and `null` when we did not ask or could not tell. Only `true` changes what
 * the page renders.
 */
export async function hasPublishedStartList(
  competition: Competition,
  now: number
): Promise<boolean | null> {
  const start = new Date(competition.startTime).getTime()

  // Only worth asking before the race: once it is running or done, the status
  // already says so and the start list is no longer the interesting fact.
  if (now >= start || now < start - WINDOW_BEFORE_START_MS) return null

  const eventId = oresultsEventId(competition.liveResultsUrl)
  if (eventId === null) return null

  return getStartListState(eventId)
}
