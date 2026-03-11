import { cn } from "@/lib/utils"
import type { RiskLevel } from "@/lib/types"

const riskBarColor: Record<RiskLevel, string> = {
  critical: "bg-red-500",
  warning: "bg-orange-500",
  stable: "bg-blue-500",
  full: "bg-emerald-500",
}

interface LevelGaugeProps {
  level: number | null
  risk: RiskLevel
  className?: string
  lastRecordedDate?: string
  showLastRecorded?: boolean
}

export function LevelGauge({ level, risk, className, lastRecordedDate, showLastRecorded = false }: LevelGaugeProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return null
      }
      return date.toLocaleDateString("en-ZA", {
        month: "short",
        day: "numeric"
      })
    } catch {
      return null
    }
  }

  if (level === null || level === undefined) {
    const formattedDate = lastRecordedDate ? formatDate(lastRecordedDate) : null
    
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight text-muted-foreground tabular-nums">
            --
          </span>
          <span className="text-lg font-medium text-muted-foreground">%</span>
        </div>
        {showLastRecorded && formattedDate && (
          <div className="text-xs text-muted-foreground">
            Last recorded: {formattedDate}
          </div>
        )}
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 ease-out bg-gray-300" style={{ width: "0%" }} />
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
          {level.toFixed(1)}
        </span>
        <span className="text-lg font-medium text-muted-foreground">%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", riskBarColor[risk])}
          style={{ width: `${Math.min(level, 100)}%` }}
        />
      </div>
    </div>
  )
}
