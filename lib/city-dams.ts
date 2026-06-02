// City water supply systems configuration
// Maps city codes to their dam lists and metadata

export interface CitySystem {
  label: string
  dams: string[]
}

export function normalizeDamName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

export function matchesCitySystem(damName: string, cityCode: string): boolean {
  const names = CITY_SYSTEMS[cityCode]?.dams ?? []
  const normalizedDam = normalizeDamName(damName)

  return names.some((name) => normalizeDamName(name) === normalizedDam)
}

export const CITY_SYSTEMS: Record<string, CitySystem> = {
  ct: {
    label: "Cape Town",
    dams: [
      "Berg River Dam", "Steenbras-Upper Dam", "Steenbras-Lower Dam",
      "Theewaterskloof Dam", "Voelvlei Dam", "Wemmershoek Dam"
    ]
  },
  al: {
    label: "Gqeberha", 
    dams: [
      "Impofu Dam", "Kouga Dam", "Loerie Dam", "Groendal Dam",
      "Churchill Dam", "Kromme Dam"
    ]
  },
  um: {
    label: "Durban",
    dams: [
      "Midmar Dam", "Nagle Dam", "Inanda Dam", "Hazelmere Dam",
      "Albert Falls Dam", "Spring Grove Dam"
    ]
  }
}

export const CITY_CODES = Object.keys(CITY_SYSTEMS)

export const CITY_OPTIONS = CITY_CODES.map((code) => ({
  value: code,
  label: CITY_SYSTEMS[code as keyof typeof CITY_SYSTEMS].label,
}))
