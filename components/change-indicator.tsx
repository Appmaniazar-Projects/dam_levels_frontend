import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ChangeIndicatorProps {
  value: number | null
  label?: string
  className?: string
}

export function ChangeIndicator({ value, label, className }: ChangeIndicatorProps) {
  if (value === null || value === undefined) {
    return (
      <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
        <Minus className="size-3.5 text-muted-foreground" />
        <span className="font-medium tabular-nums text-muted-foreground">
          --%
        </span>
        {label && <span className="text-muted-foreground">{label}</span>}
      </span>
    )
  }

  const isPositive = value > 0
  const isNeutral = value === 0

  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      {isNeutral ? (
        <Minus className="size-3.5 text-muted-foreground" />
      ) : isPositive ? (
        <TrendingUp className="size-3.5 text-emerald-600" />
      ) : (
        <TrendingDown className="size-3.5 text-red-600" />
      )}
      <span
        className={cn(
          "font-medium tabular-nums",
          isNeutral && "text-muted-foreground",
          isPositive && "text-emerald-700",
          !isPositive && !isNeutral && "text-red-700"
        )}
      >
        {isPositive ? "+" : ""}
        {value.toFixed(1)}%
      </span>
      {label && <span className="text-muted-foreground">{label}</span>}
    </span>
  )
}
