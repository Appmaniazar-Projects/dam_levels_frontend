"use client"

import { useMemo } from "react"
import { DamCard } from "@/components/dam-card"
import { RiskBadge } from "@/components/risk-badge"
import { Droplets, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"
import type { WaterSupplySystem, SystemDam } from "@/lib/api-systems"

interface Props {
  system: WaterSupplySystem
  dams: SystemDam[]
}

// Overall system level → risk label
function systemRisk(avgLevel: number, minLevel: number) {
  if (minLevel < 30) return "critical"
  if (avgLevel < 60) return "warning"
  return "stable"
}

function LevelBar({ level, risk }: { level: number; risk: string }) {
  const color =
    risk === "critical"
      ? "bg-red-500"
      : risk === "warning"
      ? "bg-amber-400"
      : "bg-teal-500"

  return (
    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${Math.min(level, 100)}%` }}
      />
    </div>
  )
}

export function SystemDashboard({ system, dams }: Props) {
  const risk = systemRisk(system.avg_level, system.min_level)

  const sorted = useMemo(
    () => [...dams].sort((a, b) => (a.level ?? 100) - (b.level ?? 100)),
    [dams]
  )

  const riskIcon =
    risk === "critical" ? (
      <AlertTriangle className="size-5 text-destructive" />
    ) : risk === "warning" ? (
      <AlertTriangle className="size-5 text-amber-500" />
    ) : (
      <CheckCircle className="size-5 text-teal-600" />
    )

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Droplets className="size-5 text-blue-500" />
          <h1 className="text-2xl font-semibold text-foreground">
            {system.city} Water Supply
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {system.system_name} system · {system.total_dams} dams
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">Combined storage</span>
            <span className="text-4xl font-semibold tabular-nums text-foreground">
              {system.avg_level.toFixed(1)}
              <span className="text-xl font-normal text-muted-foreground">%</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {riskIcon}
            <RiskBadge risk={risk as any} />
          </div>
        </div>

        <LevelBar level={system.avg_level} risk={risk} />

        {/* Breakdown pills */}
        <div className="flex flex-wrap gap-2 pt-1 text-sm">
          {system.critical_dams > 0 && (
            <span className="rounded-full bg-red-50 px-3 py-1 text-red-800 dark:bg-red-950 dark:text-red-200">
              {system.critical_dams} critical
            </span>
          )}
          {system.warning_dams > 0 && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-800 dark:bg-amber-950 dark:text-amber-200">
              {system.warning_dams} warning
            </span>
          )}
          {system.stable_dams > 0 && (
            <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
              {system.stable_dams} stable
            </span>
          )}
          <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
            lowest: {system.min_level.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Lowest dam callout — shown when any dam is below 30% */}
      {sorted[0] && sorted[0].level !== null && sorted[0].level < 30 && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <TrendingDown className="size-4 shrink-0 text-destructive mt-0.5" />
          <div className="text-sm">
            <span className="font-medium text-foreground">{sorted[0].dam}</span>
            <span className="text-muted-foreground">
              {" "}is at {sorted[0].level?.toFixed(1)}% — the lowest dam in this system.
            </span>
          </div>
        </div>
      )}

      {/* Dam grid — sorted lowest first so critical dams are prominent */}
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Dams in this system
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((dam) => (
            <DamCard key={`${dam.dam}-${dam.region}`} dam={dam} />
          ))}
        </div>
      </div>

    </div>
  )
}
