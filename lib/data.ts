// Domain-specific competition data
export const domainConfigs = {
  "results.ol-dm.de": {
    name: "DM Sprint 2026 in Bad Harzburg",
    competitions: [
      {
        id: 1,
        name: "DM Sprint Qualifikation",
        date: "23.05.2026",
        startTime: "2026-05-23T12:00:00",
        endTime: "2026-05-23T18:00:00",
        liveResultsUrl: "https://oresults.eu/events/3188/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189036/DM-Sprint-2026-Qualifikation",
      },
      {
        id: 2,
        name: "DM Sprint Finale",
        date: "24.05.2026",
        startTime: "2026-05-24T09:00:00",
        endTime: "2026-05-24T15:00:00",
        liveResultsUrl: "https://oresults.eu/events/3189/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189038/DM-Sprint-2026-Finale",
      },
      {
        id: 3,
        name: "DM K.O.-Sprint Halbfinale",
        date: "24.05.2026",
        startTime: "2026-05-24T16:00:00",
        endTime: "2026-05-24T19:00:00",
        liveResultsUrl: "https://oresults.eu/events/3190/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189463/DM-KO-Sprint-Halbfinale",
      },
      {
        id: 4,
        name: "DM K.O.-Sprint Finale",
        date: "24.05.2026",
        startTime: "2026-05-24T19:15:00",
        endTime: "2026-05-24T21:30:00",
        liveResultsUrl: "https://oresults.eu/events/3257/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189464/DM-KO-Sprint-Finale",
      },
      {
        id: 5,
        name: "DM Sprintstaffel",
        date: "25.05.2026",
        startTime: "2026-05-25T09:00:00",
        endTime: "2026-05-25T15:00:00",
        liveResultsUrl: "https://oresults.eu/events/3191/results",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/189041/DM-Sprintstaffel-2026",
      },
    ],
  },
  "results.hamburg-ol.de": {
    name: "Hamburg-OL 2025",
    competitions: [
      {
        id: 1,
        name: "Prolog",
        date: "28.07.2025",
        startTime: "2025-06-27T16:00:00",
        endTime: "2025-06-27T20:00:00",
        liveResultsUrl: "https://oresults.eu/events/1778",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/160818/Hamburg-OL-2025-Prolog",
      },
      {
        id: 2,
        name: "Hamburg-Sprint Lauf 1",
        date: "28.06.2025",
        startTime: "2025-06-28T13:00:00",
        endTime: "2025-06-28T16:00:00",
        liveResultsUrl: "https://oresults.eu/events/1775",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/160807/Hamburg-OL-2025-Sprint-1-Lauf",
      },
      {
        id: 3,
        name: "Hamburg-Sprint Lauf 2",
        date: "28.06.2025",
        startTime: "2025-06-28T17:00:00",
        endTime: "2025-06-28T20:00:00",
        liveResultsUrl: "https://oresults.eu/events/1776",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/160808/Hamburg-OL-2025-Sprint-2-Lauf",
      },
      {
        id: 4,
        name: "Mitteldistanz",
        date: "29.06.2025",
        startTime: "2025-06-29T10:30:00",
        endTime: "2025-06-29T13:30:00",
        liveResultsUrl: "https://oresults.eu/events/1777",
        liveloxUrl:
          "https://www.livelox.com/Events/Show/160819/Hamburg-OL-2025-Mitteldistanz",
      },
    ],
  },
} as const;

export type Domain = keyof typeof domainConfigs;
export type Competition = NonNullable<
  (typeof domainConfigs)[Domain]["competitions"][number]
>;

// Helper function to get competitions for a specific domain
export function getCompetitionsForDomain(domain: string) {
  const config = domainConfigs[domain as Domain];
  return config?.competitions || [];
}

// Helper function to get domain config
export function getDomainConfig(domain: string) {
  return domainConfigs[domain as Domain];
}

// Default competitions (fallback)
export const competitions = domainConfigs["results.ol-dm.de"].competitions;
