import { AlertTriangle, TrendingDown, Droplets, ShieldCheck } from "lucide-react"
import type { DamData } from "@/lib/types"

interface SummaryStatsProps {
  dams: DamData[]
  filtered?: DamData[]
}

export function SummaryStats({ dams, filtered }: SummaryStatsProps) {
  // Use filtered data if provided, otherwise use all dams
  const dataToShow = filtered || dams
  const total = dataToShow.length
  const criticalCount = dataToShow.filter((d) => d.risk === "critical").length
  const decliningCount = dataToShow.filter((d) => (d.weekly_change ?? 0) < 0).length
  const stableCount = dataToShow.filter((d) => d.risk === "stable").length
  const avgLevel = total > 0 ? dataToShow.reduce((sum, d) => sum + (d.level ?? 0), 0) / total : 0

  const stats = [
    {
      label: "Average Level",
      value: `${avgLevel.toFixed(1)}%`,
      icon: Droplets,
      iconClass: "text-primary",
      bgClass: "bg-primary/10",
    },
    {
      label: "Dams at Risk",
      value: criticalCount.toString(),
      icon: AlertTriangle,
      iconClass: "text-red-600",
      bgClass: "bg-red-50",
    },
    {
      label: "Declining",
      value: decliningCount.toString(),
      icon: TrendingDown,
      iconClass: "text-orange-600",
      bgClass: "bg-orange-50",
    },
    {
      label: "Stable",
      value: stableCount.toString(),
      icon: ShieldCheck,
      iconClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
        >
          <div className={`flex size-10 items-center justify-center rounded-lg ${stat.bgClass}`}>
            <stat.icon className={`size-5 ${stat.iconClass}`} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-foreground tabular-nums">
              {stat.value}
            </span>
            <span className="text-xs text-muted-foreground">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
