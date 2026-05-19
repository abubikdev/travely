import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Journey, TravelDocument } from "@/types/journey";
import type { TravelGuideSchema } from "@/schemas/guide";

interface TravelPalDB extends DBSchema {
  journeys: {
    key: string;
    value: Journey;
    indexes: { "by-updated": number };
  };
  documents: {
    key: string;
    value: TravelDocument;
    indexes: { "by-journey": string };
  };
  guides: {
    key: string;
    value: { journeyId: string; guide: TravelGuideSchema; updatedAt: number };
  };
}

const DB_NAME = "travelpal";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<TravelPalDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<TravelPalDB>> {
  if (!dbPromise) {
    dbPromise = openDB<TravelPalDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const journeys = db.createObjectStore("journeys", { keyPath: "id" });
        journeys.createIndex("by-updated", "updatedAt");

        const documents = db.createObjectStore("documents", { keyPath: "id" });
        documents.createIndex("by-journey", "journeyId");

        db.createObjectStore("guides", { keyPath: "journeyId" });
      },
    });
  }
  return dbPromise;
}

export async function saveJourney(journey: Journey): Promise<void> {
  const db = await getDB();
  await db.put("journeys", journey);
}

export async function getJourney(id: string): Promise<Journey | undefined> {
  const db = await getDB();
  return db.get("journeys", id);
}

export async function getAllJourneys(): Promise<Journey[]> {
  const db = await getDB();
  return db.getAllFromIndex("journeys", "by-updated");
}

export async function saveDocument(doc: TravelDocument): Promise<void> {
  const db = await getDB();
  await db.put("documents", doc);
}

export async function getDocumentsByJourney(
  journeyId: string
): Promise<TravelDocument[]> {
  const db = await getDB();
  return db.getAllFromIndex("documents", "by-journey", journeyId);
}

export async function saveGuide(
  journeyId: string,
  guide: TravelGuideSchema
): Promise<void> {
  const db = await getDB();
  await db.put("guides", { journeyId, guide, updatedAt: Date.now() });
}

export async function getGuide(
  journeyId: string
): Promise<TravelGuideSchema | undefined> {
  const db = await getDB();
  const record = await db.get("guides", journeyId);
  return record?.guide;
}
