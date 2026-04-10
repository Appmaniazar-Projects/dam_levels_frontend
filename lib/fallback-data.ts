import type { DamData, DamHistory, DataInfo, ProvinceStatus, DataFreshness } from "./types"

// Simple, clean fallback data
export const fallbackDams: DamData[] = [
  {
    region: "Western Cape",
    dam: "Theewaterskloof Dam",
    level: 75.2,
    weekly_change: 2.1,
    yearly_change: 15.3,
    risk: "stable",
    photo_url: "https://images.unsplash.com/photo-1540206395-68808572332f?w=800&h=400&fit=crop",
    latitude: -34.0284,
    longitude: 19.3166,
    full_supply_capacity: 480,
    surface_area: 52,
    dam_type: "Earth Fill",
    year_completed: 1978,
    river: "Eerste River",
    description: "Theewaterskloof Dam is a vital water supply for Cape Town."
  },
  {
    region: "Gauteng", 
    dam: "Vaal Dam",
    level: 85.7,
    weekly_change: -0.5,
    yearly_change: 12.8,
    risk: "stable",
    photo_url: "https://images.unsplash.com/photo-1540206395-68808572332f?w=800&h=400&fit=crop",
    latitude: -26.8881,
    longitude: 28.1128,
    full_supply_capacity: 2600,
    surface_area: 320,
    dam_type: "Concrete Arch",
    year_completed: 1938,
    river: "Vaal River",
    description: "Vaal Dam is one of South Africa's largest dams."
  },
  {
    region: "Kwazulu-Natal",
    dam: "Albert Falls Dam", 
    level: 45.3,
    weekly_change: -3.2,
    yearly_change: -8.7,
    risk: "warning",
    photo_url: "https://images.unsplash.com/photo-1540206395-68808572332f?w=800&h=400&fit=crop",
    latitude: -29.3833,
    longitude: 30.7333,
    full_supply_capacity: 290,
    surface_area: 23,
    dam_type: "Earth Fill",
    year_completed: 1976,
    river: "Umgeni River",
    description: "Albert Falls Dam provides water to Durban and Pietermaritzburg."
  },
  {
    region: "Free State",
    dam: "Gariep Dam",
    level: 92.1,
    weekly_change: 1.8,
    yearly_change: 25.4,
    risk: "stable",
    photo_url: "https://images.unsplash.com/photo-1540206395-68808572332f?w=800&h=400&fit=crop",
    latitude: -30.6167,
    longitude: 25.4167,
    full_supply_capacity: 5400,
    surface_area: 374,
    dam_type: "Concrete Arch",
    year_completed: 1971,
    river: "Orange River",
    description: "Gariep Dam is South Africa's largest dam by volume."
  },
  {
    region: "Eastern Cape",
    dam: "Kouga Dam",
    level: 28.9,
    weekly_change: -5.1,
    yearly_change: -15.2,
    risk: "critical",
    photo_url: "https://images.unsplash.com/photo-1540206395-68808572332f?w=800&h=400&fit=crop",
    latitude: -33.8667,
    longitude: 24.7167,
    full_supply_capacity: 128,
    surface_area: 15,
    dam_type: "Earth Fill",
    year_completed: 1969,
    river: "Kouga River",
    description: "Kouga Dam supplies water to the Kouga region."
  }
]

export const fallbackDataInfo: DataInfo = {
  latest_update: new Date().toISOString(),
  total_dams: 218,  // Current total from API
  data_range: { 
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    end: new Date().toISOString() 
  },
  update_frequency: "Weekly",
  weekly_calculation: "Current week level - Previous week level",
  yearly_calculation: "Current year level - Previous year level",
  province_status: {
    "Western Cape": {
      updated: new Date().toISOString(),
      fresh_dams: 47,
      stale_dams: 0,
      total_dams: 47,
      status: "success"
    },
    "Eastern Cape": {
      updated: new Date().toISOString(),
      fresh_dams: 47,
      stale_dams: 0,
      total_dams: 47,
      status: "success"
    },
    "Free State": {
      updated: new Date().toISOString(),
      fresh_dams: 21,
      stale_dams: 0,
      total_dams: 21,
      status: "success"
    },
    "Gauteng": {
      updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      fresh_dams: 0,
      stale_dams: 5,
      total_dams: 5,
      status: "failed",
      failure_reason: "No dams scraped - DWS server issue"
    },
    "Kwazulu-Natal": {
      updated: new Date().toISOString(),
      fresh_dams: 13,
      stale_dams: 6,
      total_dams: 19,
      status: "partial",
      failure_reason: "Only 13/19 dams scraped"
    },
    "Limpopo": {
      updated: new Date().toISOString(),
      fresh_dams: 29,
      stale_dams: 0,
      total_dams: 29,
      status: "success"
    },
    "Mpumalanga": {
      updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      fresh_dams: 8,
      stale_dams: 15,
      total_dams: 23,
      status: "partial",
      failure_reason: "Only 8/23 dams scraped"
    },
    "North West": {
      updated: new Date().toISOString(),
      fresh_dams: 27,
      stale_dams: 1,
      total_dams: 28,
      status: "success"
    },
    "Northern Cape": {
      updated: new Date().toISOString(),
      fresh_dams: 4,
      stale_dams: 2,
      total_dams: 6,
      status: "success"
    }
  },
  data_freshness: {
    fresh_dams: 196,
    stale_dams: 24,
    old_dams: 0,
    historical_dams: 0,
    last_successful_scrape: new Date().toISOString()
  }
}

// Generate simple fallback history
export function generateFallbackHistory(damName: string): DamHistory[] {
  const history: DamHistory[] = []
  const baseLevel = Math.random() * 40 + 40
  
  for (let i = 12; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - (i * 7))
    
    const level = Math.max(0, Math.min(100, baseLevel + (Math.random() - 0.5) * 10))
    
    history.push({
      date: date.toISOString().split('T')[0],
      level: Math.round(level * 10) / 10
    })
  }
  
  return history
}
