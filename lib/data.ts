// Competition data with time windows
export const competitions = [
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
    startTime: "2025-03-25T11:00:00",
    endTime: "2025-03-35T14:00:00",
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
] as const

export type Competition = (typeof competitions)[number]