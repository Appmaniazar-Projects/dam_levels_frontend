export type RiskLevel = "critical" | "warning" | "stable"

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
}

export interface DamHistory {
  date: string
  level: number | null
}
