export type RiskLevel = "critical" | "warning" | "stable"
export type DataStatus = "fresh" | "stale" | "old" | "historical"

export interface DamData {
  region: string
  dam: string
  level: number | null
  weekly_change: number | null
  yearly_change: number | null
  risk: RiskLevel
  photo_url?: string
  latitude?: number
  longitude?: number
  full_supply_capacity?: number
  surface_area?: number
  dam_type?: string
  year_completed?: number
  river?: string
  purpose?: string
  description?: string
  last_seen?: string
  data_status?: DataStatus
  timestamp?: string
}

export interface DamHistory {
  date: string
  level: number | null
}

export interface ProvinceStatus {
  [province: string]: {
    updated: string | null
    fresh_dams: number
    stale_dams: number
    total_dams: number
    status: "success" | "failed" | "partial" | "unknown"
    failure_reason?: string
  }
}

export interface DataFreshness {
  fresh_dams: number
  stale_dams: number
  old_dams: number
  historical_dams: number
  last_successful_scrape: string
}

export interface DataInfo {
  latest_update: string
  total_dams: number
  data_range?: { start: string; end: string }
  update_frequency: string
  weekly_calculation: string
  yearly_calculation?: string
  province_status?: ProvinceStatus
  data_freshness?: DataFreshness
}
