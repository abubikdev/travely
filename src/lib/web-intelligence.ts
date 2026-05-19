/**
 * Free web data layer — architecture for future integrations.
 * Currently returns structured placeholders; extend with APIs as needed.
 */

export interface AirportInfo {
  code: string;
  name: string;
  terminals?: string[];
  transitNotes?: string;
}

export interface TransitInfo {
  city: string;
  apps: string[];
  notes: string[];
}

export async function fetchAirportInfo(code: string): Promise<AirportInfo | null> {
  // Future: integrate aviationstack, openflights, or airport static datasets
  const known: Record<string, AirportInfo> = {
    ZRH: {
      code: "ZRH",
      name: "Zurich Airport",
      terminals: ["A", "B", "E"],
      transitNotes: "Airport train to Zurich HB every 10 min; allow 10 min walk to platform.",
    },
    JFK: {
      code: "JFK",
      name: "John F. Kennedy International",
      terminals: ["1", "4", "5", "7", "8"],
      transitNotes: "AirTrain connects terminals; allow 15–25 min inter-terminal.",
    },
  };
  return known[code.toUpperCase()] ?? null;
}

export async function fetchTransitRecommendations(
  city: string
): Promise<TransitInfo | null> {
  const known: Record<string, TransitInfo> = {
    zurich: {
      city: "Zurich",
      apps: ["SBB Mobile", "ZVV"],
      notes: ["Buy tickets in SBB app before boarding regional trains."],
    },
    tokyo: {
      city: "Tokyo",
      apps: ["Google Maps", "Japan Transit Planner"],
      notes: ["IC cards (Suica/PASMO) work across most transit."],
    },
  };
  return known[city.toLowerCase()] ?? null;
}

export function buildWebContextForPrompt(codes: string[], cities: string[]): string {
  const parts: string[] = [];
  for (const code of codes) {
    const info = { ZRH: "Zurich", JFK: "JFK" }[code];
    if (info) parts.push(`Airport ${code}: static reference data available.`);
  }
  for (const city of cities) {
    parts.push(`City ${city}: check local transit apps before arrival.`);
  }
  return parts.length ? `Web intelligence hints:\n${parts.join("\n")}` : "";
}
