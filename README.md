# Orienteering Results Hub

A multi-domain application for displaying live orienteering competition results and tracking information.

## Features

- **Multi-domain support**: Different competitions per domain
- **Live results integration**: Direct links to oresults.eu and livelox.com
- **Real-time updates**: Automatic time updates and competition status
- **QR code generation**: Easy sharing of live results
- **Responsive design**: Works on desktop and mobile devices
- **Dark/light theme**: Automatic theme switching

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
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/               # UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and data
│   ├── data.ts          # Domain + competition configuration (single source of truth)
│   └── utils.ts         # Utility functions
├── middleware.ts         # Next.js middleware for domain detection
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
- Any other host renders the "Domain nicht unterstützt" page.

The home page is a Server Component: the competition list, including every
results link, is in the initial HTML for crawlers and social previews. Only the
clock, the "Aktiv" badge and the QR code are client-side, which keeps the
response cacheable by the CDN (`s-maxage`, set in `middleware.ts`).

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