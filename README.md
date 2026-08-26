# Orienteering Results Hub

A multi-domain application for displaying live orienteering competition results and tracking information.

## Features

- **Multi-domain support**: Different competitions per domain
- **Live results integration**: Direct links to oresults.eu and livelox.com
- **Real-time updates**: Automatic time updates and competition status
- **QR code generation**: Easy sharing of live results
- **Responsive design**: Works on desktop and mobile devices
- **Dark/light theme**: Automatic theme switching
- **Nine languages**: German, Danish, Estonian, English, Spanish, French,
  Dutch, Norwegian and Swedish, chosen from the browser's `Accept-Language`
  and overridable in the UI

## Supported Domains

- `results.ol-dm.de` - German Championship orienteering events
- `results.hamburg-ol.de` - Hamburg orienteering events

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd orienteering-results-hub
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing Multi-Domain Setup

To test the multi-domain functionality locally:

1. Add entries to your `/etc/hosts` file:
```
127.0.0.1 results.ol-dm.de
127.0.0.1 results.hamburg-ol.de
```

2. Run the test script:
```bash
npm run test:domains
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── [locale]/          # One route per language
│   │   └── page.tsx       # Home page
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                  # Utility functions and data
│   ├── data.ts          # Domain + competition configuration (single source of truth)
│   ├── i18n.ts          # Locale list and Accept-Language negotiation
│   ├── dictionaries.ts  # Every user-visible string, per language
│   └── utils.ts         # Utility functions
├── middleware.ts         # Domain detection and language redirect
└── scripts/             # Utility scripts
```

## Configuration

### Adding New Domains

`lib/data.ts` is the single source of truth: `SUPPORTED_DOMAINS` (and therefore
the middleware allowlist) is derived from the keys of `DOMAIN_CONFIGS`, so
adding a domain is one edit in one place.

```typescript
export const DOMAIN_CONFIGS = {
  // ... existing configs
  'results.new-domain.de': {
    name: 'New Domain OL',           // shown in the header and the <title>
    description: 'Live results for new domain events',
    region: 'Region',
    organization: 'Organization',
    competitions: [
      {
        id: 1,
        name: "Competition Name",
        race: "middleDistance",          // optional; see "Race names" below
        startTime: "YYYY-MM-DDTHH:MM:SS+02:00",
        endTime: "YYYY-MM-DDTHH:MM:SS+02:00",
        liveResultsUrl: "https://oresults.eu/events/XXXX",
        liveloxUrl: "https://www.livelox.com/Events/Show/XXXX/Event-Name",
      },
    ]
  }
} satisfies Record<string, DomainConfig>
```

#### Timestamps

`startTime`/`endTime` must carry an explicit UTC offset — `+02:00` during CEST
(late March to late October) and `+01:00` during CET. Without it the timestamp
is parsed in the *visitor's* timezone and the "Aktiv" badge fires at the wrong
wall-clock time outside Germany.

There is no separate `date` field: the displayed date (`27.06.2025`) is derived
from `startTime` and rendered in `Europe/Berlin`, so it cannot drift from the
machine-readable timestamp.

### Hosts and rendering

- Supported domains are served their own configuration.
- `localhost`, `127.0.0.1` and `*.vercel.app` (local dev and preview
  deployments) are served the default domain (`DEFAULT_DOMAIN` in
  `lib/data.ts`, currently `results.hamburg-ol.de`) instead of being redirected.
- Any other host renders the "domain not supported" page, in the visitor's
  language.

The home page is a Server Component: the competition list, including every
results link, is in the initial HTML for crawlers and social previews. Only the
clock, the "Aktiv" badge and the QR code are client-side, which keeps the
response cacheable by the CDN (`s-maxage`, set in `middleware.ts`).

## Languages

The language is part of the URL — `/de`, `/da`, `/et`, `/en`, `/es`, `/fr`,
`/nl`, `/no`, `/sv` — so every language is a separate page for the CDN to cache
and for search engines to index. `/` renders nothing itself: `middleware.ts` redirects
it, preferring in order

1. the `NEXT_LOCALE` cookie, written whenever a language URL is opened,
2. the browser's `Accept-Language` header, quality values included,
3. German, which is the fallback whenever the browser asks for nothing we speak.

The switcher in the header is nine plain links and no JavaScript; opening one
of them *is* the choice, which is what the cookie records. It lists the default
language first and the rest alphabetically by endonym, which is the order
`LOCALE_META` is authored in.

### Race names

A competition's `name` is shown as-is in every language, which is what a
proper noun wants. When the race is one of the standard orienteering formats,
set `race` as well and the title follows the reader's language instead:

```typescript
{ id: 1, name: "Prolog",        race: "prologue" }                  // → Prologue, Proloog, Prólogo
{ id: 2, name: "Sprint 1",      race: "sprint", number: 1 }         // → Sprint 1 everywhere
{ id: 4, name: "Mitteldistanz", race: "middleDistance" }            // → Medeldistans, Keskmaa
```

The vocabulary is `RaceFormat` in `lib/dictionaries.ts`. It is closed on
purpose: "Mitteldistanz" means the same thing at every event, so it is
translated once there rather than nine times per race in `lib/data.ts`, and
adding a race stays a single edit. Names are translated whole rather than
composed from parts — French reverses the word order of "Sprint
Qualifikation", and a composed name would have to encode that.

`number` is appended after the translated name to tell repeated runs of one
format apart. Every language served puts the numeral last, so it needs no
translation.

A format that is not in the vocabulary either gets added to it (one edit plus
one line per language, enforced by the compiler) or is left out entirely, in
which case `name` carries it untranslated.

### Adding a language

Two edits, both mechanical:

1. add an entry to `LOCALE_META` in `lib/i18n.ts` (endonym, `Intl` tag,
   `<html lang>` value) — `LOCALES`, the switcher, the `hreflang` alternates
   and the sitemap are all derived from it;
2. add the matching entry to `dictionaries` in `lib/dictionaries.ts`.
   TypeScript will not compile until it is there.

Dates, times, weekday names and the header's date range are formatted by `Intl`
from the locale's tag, so they need no translation. They stay pinned to
`Europe/Berlin` in every language: the event is in Germany, and only the
notation follows the reader.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Technologies Used

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons
- **React QR Code** - QR code generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 