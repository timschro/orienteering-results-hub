// Every user-visible string on the page, per language.
//
// Server-only by construction: importing this from a client component would
// ship all seven languages to every visitor. The one place the browser needs
// translated text is the ticking status label, and components/competition-row
// hands it the `StatusStrings` slice as a prop instead (see
// lib/competition-status.ts).
//
// Placeholders are `{name}` and are substituted by `fill()` below rather than
// by string concatenation, so a translator can move them where their language
// needs them.

import { intlLocale, type Locale } from "@/lib/i18n"
import type { StatusStrings } from "@/lib/competition-status"

export interface Dictionary {
  unsupportedDomain: { title: string; body: string }
  empty: { title: string; body: string }
  featured: { live: string; next: string }
  links: {
    startList: string
    /** Accessible names. `{competition}` is the competition's own name. */
    oresults: string
    oresultsStartList: string
    livelox: string
  }
  footer: {
    results: string
    /** Appended after `results` only when the event has Livelox links. */
    maps: string
    imprint: string
    privacy: string
  }
  status: StatusStrings
  language: { label: string }
  /** Meta description; `{event}` is the domain's display name. */
  metaDescription: string
}

// Same order as LOCALE_META in lib/i18n.ts, so the two read in parallel.
const dictionaries: Record<Locale, Dictionary> = {
  de: {
    unsupportedDomain: {
      title: "Domain nicht unterstützt",
      body: "Diese Domain wird nicht unterstützt. Bitte verwenden Sie eine der unterstützten Domains.",
    },
    empty: {
      title: "Noch keine Ergebnisse",
      body: "Für diese Veranstaltung sind noch keine Live-Ergebnisse verlinkt.",
    },
    featured: { live: "Jetzt live", next: "Als Nächstes" },
    links: {
      startList: "Startliste",
      oresults: "{competition} bei OResults",
      oresultsStartList: "{competition}: Startliste bei OResults",
      livelox: "{competition} bei Livelox",
    },
    footer: {
      results: "Ergebnisse von OResults",
      maps: "Karten von Livelox",
      imprint: "Impressum",
      privacy: "Datenschutz",
    },
    status: {
      live: "Live",
      finished: "beendet",
      soon: "gleich",
      inMinutes: "in {minutes} Min.",
      today: "heute",
      tomorrow: "morgen",
    },
    language: { label: "Sprache" },
    metaDescription: "Live-Ergebnisse und Verfolgung für {event}",
  },

  da: {
    unsupportedDomain: {
      title: "Domænet understøttes ikke",
      body: "Dette domæne understøttes ikke. Brug venligst et af de understøttede domæner.",
    },
    empty: {
      title: "Ingen resultater endnu",
      body: "Der er endnu ikke linket til liveresultater for dette arrangement.",
    },
    featured: { live: "Live nu", next: "Næste" },
    links: {
      startList: "Startliste",
      oresults: "{competition} på OResults",
      oresultsStartList: "{competition}: startliste på OResults",
      livelox: "{competition} på Livelox",
    },
    footer: {
      results: "Resultater fra OResults",
      maps: "kort fra Livelox",
      imprint: "Juridisk information",
      privacy: "Privatlivspolitik",
    },
    status: {
      live: "Live",
      finished: "afsluttet",
      soon: "straks",
      inMinutes: "om {minutes} min.",
      today: "i dag",
      tomorrow: "i morgen",
    },
    language: { label: "Sprog" },
    metaDescription: "Liveresultater og tracking for {event}",
  },

  et: {
    unsupportedDomain: {
      title: "Domeeni ei toetata",
      body: "Seda domeeni ei toetata. Palun kasuta mõnda toetatud domeeni.",
    },
    empty: {
      title: "Tulemusi veel ei ole",
      body: "Selle võistluse kohta ei ole veel otsetulemusi lingitud.",
    },
    featured: { live: "Praegu otse", next: "Järgmisena" },
    links: {
      startList: "Stardiprotokoll",
      oresults: "{competition} OResultsis",
      oresultsStartList: "{competition}: stardiprotokoll OResultsis",
      livelox: "{competition} Liveloxis",
    },
    footer: {
      results: "Tulemused OResultsist",
      maps: "kaardid Liveloxist",
      imprint: "Õigusteave",
      privacy: "Privaatsus",
    },
    status: {
      live: "Otse",
      finished: "lõppenud",
      soon: "kohe",
      inMinutes: "{minutes} min pärast",
      today: "täna",
      tomorrow: "homme",
    },
    language: { label: "Keel" },
    // Estonian puts the event in the genitive in front of the noun, which is
    // why the placeholder moves rather than the sentence bending around it.
    metaDescription: "{event} otsetulemused ja jälgimine",
  },

  en: {
    unsupportedDomain: {
      title: "Domain not supported",
      body: "This domain is not supported. Please use one of the supported domains.",
    },
    empty: {
      title: "No results yet",
      body: "No live results have been linked for this event yet.",
    },
    featured: { live: "Live now", next: "Up next" },
    links: {
      startList: "Start list",
      oresults: "{competition} on OResults",
      oresultsStartList: "{competition}: start list on OResults",
      livelox: "{competition} on Livelox",
    },
    footer: {
      results: "Results by OResults",
      maps: "maps by Livelox",
      imprint: "Legal notice",
      privacy: "Privacy",
    },
    status: {
      live: "Live",
      finished: "finished",
      soon: "starting now",
      inMinutes: "in {minutes} min",
      today: "today",
      tomorrow: "tomorrow",
    },
    language: { label: "Language" },
    metaDescription: "Live results and tracking for {event}",
  },

  es: {
    unsupportedDomain: {
      title: "Dominio no compatible",
      body: "Este dominio no es compatible. Utiliza uno de los dominios admitidos.",
    },
    empty: {
      title: "Aún no hay resultados",
      body: "Todavía no hay resultados en directo enlazados para esta competición.",
    },
    featured: { live: "En directo", next: "A continuación" },
    links: {
      startList: "Lista de salida",
      oresults: "{competition} en OResults",
      oresultsStartList: "{competition}: lista de salida en OResults",
      livelox: "{competition} en Livelox",
    },
    footer: {
      results: "Resultados de OResults",
      maps: "mapas de Livelox",
      imprint: "Aviso legal",
      privacy: "Privacidad",
    },
    status: {
      live: "Directo",
      finished: "finalizado",
      soon: "inminente",
      inMinutes: "en {minutes} min",
      today: "hoy",
      tomorrow: "mañana",
    },
    language: { label: "Idioma" },
    metaDescription: "Resultados en directo y seguimiento de {event}",
  },

  fr: {
    unsupportedDomain: {
      title: "Domaine non pris en charge",
      body: "Ce domaine n'est pas pris en charge. Veuillez utiliser l'un des domaines pris en charge.",
    },
    empty: {
      title: "Pas encore de résultats",
      body: "Aucun résultat en direct n'est encore lié à cette compétition.",
    },
    featured: { live: "En direct", next: "À suivre" },
    links: {
      startList: "Liste de départ",
      oresults: "{competition} sur OResults",
      oresultsStartList: "{competition} : liste de départ sur OResults",
      livelox: "{competition} sur Livelox",
    },
    footer: {
      results: "Résultats par OResults",
      maps: "cartes par Livelox",
      imprint: "Mentions légales",
      privacy: "Confidentialité",
    },
    status: {
      live: "Direct",
      finished: "terminé",
      soon: "imminent",
      inMinutes: "dans {minutes} min",
      today: "aujourd'hui",
      tomorrow: "demain",
    },
    language: { label: "Langue" },
    metaDescription: "Résultats en direct et suivi pour {event}",
  },

  nl: {
    unsupportedDomain: {
      title: "Domein niet ondersteund",
      body: "Dit domein wordt niet ondersteund. Gebruik een van de ondersteunde domeinen.",
    },
    empty: {
      title: "Nog geen uitslagen",
      body: "Er zijn nog geen live-uitslagen gekoppeld aan dit evenement.",
    },
    featured: { live: "Nu live", next: "Hierna" },
    links: {
      startList: "Startlijst",
      oresults: "{competition} op OResults",
      oresultsStartList: "{competition}: startlijst op OResults",
      livelox: "{competition} op Livelox",
    },
    footer: {
      results: "Resultaten van OResults",
      maps: "kaarten van Livelox",
      imprint: "Colofon",
      privacy: "Privacy",
    },
    status: {
      live: "Live",
      finished: "afgelopen",
      soon: "zo meteen",
      inMinutes: "over {minutes} min",
      today: "vandaag",
      tomorrow: "morgen",
    },
    language: { label: "Taal" },
    metaDescription: "Live-uitslagen en tracking voor {event}",
  },

  no: {
    unsupportedDomain: {
      title: "Domenet støttes ikke",
      body: "Dette domenet støttes ikke. Bruk et av de støttede domenene.",
    },
    empty: {
      title: "Ingen resultater ennå",
      body: "Det er ennå ikke lenket til liveresultater for dette arrangementet.",
    },
    featured: { live: "Live nå", next: "Neste" },
    links: {
      startList: "Startliste",
      oresults: "{competition} på OResults",
      oresultsStartList: "{competition}: startliste på OResults",
      livelox: "{competition} på Livelox",
    },
    footer: {
      results: "Resultater fra OResults",
      maps: "kart fra Livelox",
      imprint: "Juridisk informasjon",
      privacy: "Personvern",
    },
    status: {
      live: "Live",
      finished: "avsluttet",
      soon: "straks",
      inMinutes: "om {minutes} min",
      today: "i dag",
      tomorrow: "i morgen",
    },
    language: { label: "Språk" },
    metaDescription: "Liveresultater og følging for {event}",
  },

  sv: {
    unsupportedDomain: {
      title: "Domänen stöds inte",
      body: "Den här domänen stöds inte. Använd någon av de domäner som stöds.",
    },
    empty: {
      title: "Inga resultat än",
      body: "Inga liveresultat är länkade för det här arrangemanget än.",
    },
    featured: { live: "Live nu", next: "Härnäst" },
    links: {
      startList: "Startlista",
      oresults: "{competition} på OResults",
      oresultsStartList: "{competition}: startlista på OResults",
      livelox: "{competition} på Livelox",
    },
    footer: {
      results: "Resultat från OResults",
      maps: "kartor från Livelox",
      imprint: "Juridisk information",
      privacy: "Integritetspolicy",
    },
    status: {
      live: "Live",
      finished: "avslutat",
      soon: "strax",
      inMinutes: "om {minutes} min",
      today: "idag",
      tomorrow: "imorgon",
    },
    language: { label: "Språk" },
    metaDescription: "Liveresultat och följning för {event}",
  },
}

/**
 * Everything a component needs to render in one language, threaded through the
 * tree as a single `translation` prop. Bundling the `Intl` tag with the strings
 * keeps the two from being passed separately - and from drifting apart.
 */
export interface Translation {
  locale: Locale
  /** BCP 47 tag for `Intl`; see `intlLocale` in lib/i18n.ts. */
  intl: string
  t: Dictionary
}

export function getTranslation(locale: Locale): Translation {
  return { locale, intl: intlLocale(locale), t: dictionaries[locale] }
}

/** Substitute `{placeholder}` values into a translated string. */
export function fill(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match
  )
}
