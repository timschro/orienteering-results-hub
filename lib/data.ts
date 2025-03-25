// Competition data with time windows
export const competitions = [
  {
    id: 1,
    name: "Frühlings-Waldlauf",
    date: "15.04.2025",
    startTime: "2025-04-15T08:00:00",
    endTime: "2025-04-15T16:00:00",
    liveResultsUrl: "https://oresults.eu/events/spring-forest-2025",
    liveloxUrl: "https://livelox.com/events/spring-forest-2025",
  },
  {
    id: 2,
    name: "Sommer-Hochland-Challenge",
    date: "22.06.2025",
    startTime: "2025-06-22T09:00:00",
    endTime: "2025-06-22T17:00:00",
    liveResultsUrl: "https://oresults.eu/events/highland-challenge-2025",
    liveloxUrl: "https://livelox.com/events/highland-challenge-2025",
  },
  {
    id: 3,
    name: "Herbst-Trail-Meisterschaften",
    date: "10.09.2025",
    startTime: "2025-09-10T08:30:00",
    endTime: "2025-09-10T15:30:00",
    liveResultsUrl: "https://oresults.eu/events/trail-masters-2025",
    liveloxUrl: "https://livelox.com/events/trail-masters-2025",
  },
  {
    id: 4,
    name: "Winter-Navigations-Cup",
    date: "05.12.2025",
    startTime: "2025-12-05T10:00:00",
    endTime: "2025-12-05T16:00:00",
    liveResultsUrl: "https://oresults.eu/events/navigation-cup-2025",
    liveloxUrl: "https://livelox.com/events/navigation-cup-2025",
  },
] as const

export type Competition = (typeof competitions)[number]