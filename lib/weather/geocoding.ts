import type { GeocodedLocation } from "@/types/weather";

interface OpenMeteoGeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
  country_code?: string;
  admin1?: string;
}

interface OpenMeteoGeocodingResponse {
  results?: OpenMeteoGeocodingResult[];
}

export class LocationNotFoundError extends Error {}
export class GeocodingServiceError extends Error {}
export class AmbiguousLocationError extends Error {
  constructor(public readonly options: string[]) {
    super("Location is ambiguous");
  }
}

function normalizeName(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
}

function displayName(item: OpenMeteoGeocodingResult): string {
  return [item.name, item.admin1, item.country].filter(Boolean).join(", ");
}

async function search(query: string, language: "th" | "en"): Promise<OpenMeteoGeocodingResult[]> {
  const params = new URLSearchParams({
    name: query,
    count: "5",
    language,
    format: "json",
  });

  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`, {
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!response.ok) throw new GeocodingServiceError(`Open-Meteo geocoding returned ${response.status}`);
    const data = (await response.json()) as OpenMeteoGeocodingResponse;
    return data.results ?? [];
  } catch (error) {
    if (error instanceof GeocodingServiceError) throw error;
    throw new GeocodingServiceError(error instanceof Error ? error.message : "Open-Meteo geocoding unavailable");
  }
}

export async function geocodeLocation(query: string): Promise<GeocodedLocation> {
  let results = await search(query, "th");
  if (results.length === 0) results = await search(query, "en");
  if (results.length === 0) throw new LocationNotFoundError(query);

  const first = results[0];
  const sameNamed = results.filter((item) => normalizeName(item.name) === normalizeName(first.name));
  const distinctCountries = new Set(sameNamed.map((item) => item.country_code ?? item.country ?? ""));
  const queryHasQualifier = query.includes(",");

  if (!queryHasQualifier && sameNamed.length > 1 && distinctCountries.size > 1) {
    throw new AmbiguousLocationError(sameNamed.slice(0, 3).map(displayName));
  }

  return {
    query,
    name: first.name,
    admin1: first.admin1,
    country: first.country ?? "Unknown",
    countryCode: first.country_code,
    latitude: first.latitude,
    longitude: first.longitude,
    timezone: first.timezone,
  };
}
