// Locale configuration and language negotiation.
//
// The locale lives in the URL (`/de`, `/en`, ...) rather than in a cookie or a
// `Vary: Accept-Language` on `/`. That is what keeps the CDN cache in
// middleware.ts honest: every URL has exactly one rendering, so the shared
// cache can keep serving it. `/` itself only ever redirects.
//
// Adding a language is ONE edit here plus the matching entry in
// lib/dictionaries.ts - `LOCALES` is derived from `LOCALE_META`, so the route
// segments, the switcher and the hreflang alternates can never drift apart.

export interface LocaleMeta {
  /** Endonym, shown in the language switcher. Always in its own language. */
  label: string
  /**
   * BCP 47 tag handed to `Intl`. Region-qualified because the bare language
   * tag leaves date order and separators up to CLDR's default region, which
   * is not always the European one (`en` would give US-style dates).
   */
  intl: string
  /** Value for `<html lang>`; `no` is the macrolanguage, `nb` the written form. */
  htmlLang: string
}

export const LOCALE_META = {
  de: { label: "Deutsch", intl: "de-DE", htmlLang: "de" },
  en: { label: "English", intl: "en-GB", htmlLang: "en" },
  sv: { label: "Svenska", intl: "sv-SE", htmlLang: "sv" },
  da: { label: "Dansk", intl: "da-DK", htmlLang: "da" },
  no: { label: "Norsk", intl: "nb-NO", htmlLang: "nb" },
  fr: { label: "Français", intl: "fr-FR", htmlLang: "fr" },
  nl: { label: "Nederlands", intl: "nl-NL", htmlLang: "nl" },
} as const satisfies Record<string, LocaleMeta>

export type Locale = keyof typeof LOCALE_META

/** Route segments, in the order the switcher lists them. */
export const LOCALES = Object.keys(LOCALE_META) as Locale[]

/**
 * Both current domains are German events run by German organisers, and the
 * legal pages they link to are German. German is therefore the answer whenever
 * the browser does not ask for something else.
 */
export const DEFAULT_LOCALE: Locale = "de"

export function isLocale(value: string | null | undefined): value is Locale {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(LOCALE_META, value)
  )
}

/** The `Intl` tag for a locale (ex: "no" -> "nb-NO"). */
export function intlLocale(locale: Locale): string {
  return LOCALE_META[locale].intl
}

/**
 * Browser language tags we serve under a different segment. Norwegian is the
 * real case - browsers send `nb`, `nn` or `no` and all three want `/no`.
 */
const LANGUAGE_ALIASES: Record<string, Locale> = {
  nb: "no",
  nn: "no",
}

/** The locale a bare language subtag maps to, if any (ex: "en-US" -> "en"). */
function matchLanguage(tag: string): Locale | null {
  const language = tag.toLowerCase().split("-")[0]
  if (isLocale(language)) return language
  return LANGUAGE_ALIASES[language] ?? null
}

/**
 * Pick a locale from an `Accept-Language` header, honouring the quality values
 * so that `de;q=0.8, en;q=0.9` picks English. Returns `null` when the browser
 * asks for nothing we speak, which is the caller's cue to use
 * `DEFAULT_LOCALE` - we deliberately do not fall back to English.
 */
export function matchAcceptLanguage(header: string | null | undefined): Locale | null {
  if (!header) return null

  const ranked = header
    .split(",")
    .map((part, index) => {
      const [tag, ...parameters] = part.trim().split(";")
      const quality = parameters
        .map((parameter) => /^\s*q=([\d.]+)\s*$/.exec(parameter))
        .find(Boolean)

      return {
        tag: tag.trim(),
        // Ties keep the header's own order, which is how browsers express
        // preference when they omit q entirely.
        quality: quality ? Number(quality[1]) : 1,
        index,
      }
    })
    .filter((entry) => entry.tag !== "" && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index)

  for (const { tag } of ranked) {
    // `*` means "anything", which is exactly what DEFAULT_LOCALE is for.
    if (tag === "*") return null
    const locale = matchLanguage(tag)
    if (locale) return locale
  }

  return null
}
