// City water supply systems configuration
// Maps city codes to their dam lists and metadata

export interface CitySystem {
  label: string
  dams: string[]
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
