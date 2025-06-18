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

- `results.dm-ol.de` - German Championship orienteering events
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
127.0.0.1 results.dm-ol.de
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
│   ├── data.ts          # Competition data per domain
│   ├── domains.ts       # Domain configuration
│   └── utils.ts         # Utility functions
├── middleware.ts         # Next.js middleware for domain detection
└── scripts/             # Utility scripts
```

## Configuration

### Adding New Domains

1. Add the domain to `lib/domains.ts`:
```typescript
export const SUPPORTED_DOMAINS = [
  'results.dm-ol.de',
  'results.hamburg-ol.de',
  'results.new-domain.de', // Add new domain
] as const
```

2. Add domain configuration:
```typescript
export const DOMAIN_CONFIGS = {
  // ... existing configs
  'results.new-domain.de': {
    name: 'New Domain OL',
    description: 'Live results for new domain events',
    region: 'Region',
    organization: 'Organization',
  },
}
```

3. Add competition data to `lib/data.ts`:
```typescript
export const domainConfigs = {
  // ... existing configs
  'results.new-domain.de': {
    name: 'New Domain OL',
    competitions: [
      {
        id: 1,
        name: "Competition Name",
        date: "DD.MM.YYYY",
        startTime: "YYYY-MM-DDTHH:MM:SS",
        endTime: "YYYY-MM-DDTHH:MM:SS",
        liveResultsUrl: "https://oresults.eu/events/XXXX",
        liveloxUrl: "https://www.livelox.com/Events/Show/XXXX/Event-Name",
      },
    ]
  }
}
```

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