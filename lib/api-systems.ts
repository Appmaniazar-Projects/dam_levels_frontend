// ─── SAVE THIS FILE AS: lib/api-systems.ts ──────────────────────────────────
// Place it in the same folder as your existing lib/api.ts
// (e.g. Dam_Levels_frontend/lib/api-systems.ts)
// ─────────────────────────────────────────────────────────────────────────────

import type { DamData } from "@/lib/types"

// ---------------------------------------------------------------------------
// Types — exported so page.tsx and system-dashboard.tsx can import them
// ---------------------------------------------------------------------------

export interface WaterSupplySystem {
  system_code:   string
  system_name:   string
  city:          string
  total_dams:    number
  avg_level:     number
  min_level:     number
  critical_dams: number
  warning_dams:  number
  stable_dams:   number
}

export interface SystemDam extends DamData {
  system_name: string
  city:        string
}

// ---------------------------------------------------------------------------
// API config — reads from your existing env vars
// ---------------------------------------------------------------------------

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

function apiHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
  }
}

// ---------------------------------------------------------------------------
// Fetch functions
// ---------------------------------------------------------------------------

/** Returns summary stats for every active water supply system (one row per city). */
export async function fetchAllSystems(): Promise<WaterSupplySystem[]> {
  const res = await fetch(
    `${API_BASE_URL}/systems`,
    {
      method:  "GET",
      headers: apiHeaders(),
      next:    { revalidate: 3600 }, // revalidate every hour — data is weekly
    }
  )
  if (!res.ok) throw new Error(`fetchAllSystems: HTTP ${res.status}`)
  return res.json() as Promise<WaterSupplySystem[]>
}

/** Returns all dams that belong to a given supply system, with latest levels. */
export async function fetchSystemDams(systemCode: string): Promise<SystemDam[]> {
  const res = await fetch(
    `${API_BASE_URL}/systems/${systemCode}`,
    {
      method:  "GET",
      headers: apiHeaders(),
      next:    { revalidate: 3600 },
    }
  )
  if (!res.ok) throw new Error(`fetchSystemDams(${systemCode}): HTTP ${res.status}`)
  return res.json() as Promise<SystemDam[]>
}