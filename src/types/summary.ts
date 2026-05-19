export interface TravelSegment {
  type: "flight" | "train" | "transfer" | "layover" | "border" | "checkin" | "other";
  title: string;
  from?: string;
  to?: string;
  datetime?: string;
  notes?: string;
}

export interface TravelRisk {
  level: "low" | "medium" | "high";
  title: string;
  description: string;
}

export interface TravelSummary {
  title: string;
  segments: TravelSegment[];
  timingAssumptions: string[];
  risks: TravelRisk[];
  missingInfo: string[];
  generatedAt: number;
}
