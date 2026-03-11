import type { DamData, DamHistory } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

if (typeof window !== "undefined") {
  console.log("🌊 Dam Levels API Base URL:", API_BASE_URL || "(not configured)")
}

export async function fetchLatestDams(): Promise<DamData[]> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.")
  }

  const res = await fetch(`${API_BASE_URL}/dams/latest`)
  if (!res.ok) {
    throw new Error(`Failed to fetch dam data: ${res.statusText}`)
  }
  const data = await res.json()
  // Handle Supabase response format that wraps data in a value array
  return data.value || data
}

export async function fetchDamHistory(damName: string): Promise<DamHistory[]> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.")
  }

  const res = await fetch(`${API_BASE_URL}/dams/history/${encodeURIComponent(damName)}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch history for ${damName}: ${res.statusText}`)
  }
  const data = await res.json()
  // Handle Supabase response format that wraps data in a value array
  return data.value || data
}

export async function fetchAllDamsHistory(): Promise<Record<string, DamHistory[]>> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.")
  }

  const res = await fetch(`${API_BASE_URL}/dams/history`)
  if (!res.ok) {
    throw new Error(`Failed to fetch all dams history: ${res.statusText}`)
  }
  return res.json()
}

export async function fetchDataInfo(): Promise<{
  latest_update: string
  total_dams: number
  data_range: { start: string; end: string }
  update_frequency: string
  weekly_calculation: string
  yearly_calculation: string
}> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.")
  }

  const res = await fetch(`${API_BASE_URL}/dams/info`)
  if (!res.ok) {
    throw new Error(`Failed to fetch data info: ${res.statusText}`)
  }
  const data = await res.json()
  // Handle Supabase response format that wraps data in a value array
  return data.value?.[0] || data
}

export async function fetchDamPrediction(damName: string): Promise<{
  dam: string
  predictions: Array<{
    date: string
    week_ahead: number
    predicted_level: number
    confidence: string
  }>
  model_type: string
  data_points_used: number
  note: string
}> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.")
  }

  const res = await fetch(`${API_BASE_URL}/dams/predict/${encodeURIComponent(damName)}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch prediction for ${damName}: ${res.statusText}`)
  }
  return res.json()
}

export async function fetchDamDetails(damName: string): Promise<DamData> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.")
  }

  const res = await fetch(`${API_BASE_URL}/dams/details/${encodeURIComponent(damName)}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch details for ${damName}: ${res.statusText}`)
  }
  const data = await res.json()
  // Handle Supabase response format that wraps data in a value array
  return data.value?.[0] || data
}

export async function fetchAllDamPredictions(): Promise<{
  predictions: Record<string, Array<{
    date: string
    predicted_level: number
  }>>
  model_type: string
  note: string
}> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.")
  }

  const res = await fetch(`${API_BASE_URL}/dams/predict`)
  if (!res.ok) {
    throw new Error(`Failed to fetch all predictions: ${res.statusText}`)
  }
  return res.json()
}
