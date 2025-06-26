// Domain-specific competition data
export const domainConfigs = {
  'results.ol-dm.de': {
    name: 'DM OL im Harz 2025',
    competitions: [
      {
        id: 1,
        name: "DHM Staffel",
        date: "04.04.2025",
        startTime: "2025-04-04T16:00:00",
        endTime: "2025-04-04T18:00:00",
        liveResultsUrl: "https://oresults.eu/events/1706",
        liveloxUrl: "https://www.livelox.com/Events/Show/151119/DHM-Staffel", 
      },
      {
        id: 2,
        name: "DM Sprint",
        date: "05.04.2025",
        startTime: "2025-04-05T09:00:00",
        endTime: "2025-04-05T15:00:00",
        liveResultsUrl: "https://oresults.eu/events/1707",
        liveloxUrl: "https://www.livelox.com/Events/Show/151120/DM-Sprint",
      },
      {
        id: 3,
        name: "DM Sprintstaffel",
        date: "05.04.2025",
        startTime: "2025-04-05T16:00:00",
        endTime: "2025-04-05T19:00:00",
        liveResultsUrl: "https://oresults.eu/events/1708",
        liveloxUrl: "https://www.livelox.com/Events/Show/151122/DM-Sprintstaffel",
      },
    ]
  },
  'results.hamburg-ol.de': {
    name: 'Hamburg-OL 2025',
    competitions: [
      {
        id: 1,
        name: "Prolog",
        date: "28.07.2025",
        startTime: "2025-06-27T16:00:00",
        endTime: "2025-06-27T20:00:00",
        liveResultsUrl: "https://oresults.eu/events/1778",
        liveloxUrl: "https://www.livelox.com/Events/Show/160818",
      },
      {
        id: 2,
        name: "Sprint Lauf 1",
        date: "28.06.2025",
        startTime: "2025-06-28T13:00:00",
        endTime: "2025-06-28T16:00:00",
        liveResultsUrl: "https://oresults.eu/events/1775",
        liveloxUrl: "https://www.livelox.com/Events/Show/160807",
      },
      {
        id: 3,
        name: "Sprint Lauf 2",
        date: "28.06.2025",
        startTime: "2025-06-28T17:00:00",
        endTime: "2025-06-28T18:30:00",
        liveResultsUrl: "https://oresults.eu/events/1776",
        liveloxUrl: "https://www.livelox.com/Events/Show/160808",
      },
      ,
      {
        id: 4,
        name: "Mittel-OL",
        date: "29.06.2025",
        startTime: "2025-06-29T10:30:00",
        endTime: "2025-06-29T13:30:00",
        liveResultsUrl: "https://oresults.eu/events/1777",
        liveloxUrl: "https://www.livelox.com/Events/Show/160819",
      },
    ]
  }
} as const

export type Domain = keyof typeof domainConfigs
export type Competition = (typeof domainConfigs)[Domain]['competitions'][number]

// Helper function to get competitions for a specific domain
export function getCompetitionsForDomain(domain: string) {
  const config = domainConfigs[domain as Domain]
  return config?.competitions || []
}

// Helper function to get domain config
export function getDomainConfig(domain: string) {
  return domainConfigs[domain as Domain]
}

// Default competitions (fallback)
export const competitions = domainConfigs['results.ol-dm.de'].competitions
