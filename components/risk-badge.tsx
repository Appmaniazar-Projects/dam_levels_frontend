import { cn } from "@/lib/utils"
import type { RiskLevel } from "@/lib/types"

const riskConfig: Record<string, { label: string; className: string }> = {
  critical: {
    label: "Critical",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  warning: {
    label: "Warning",
    className: "bg-orange-100 text-orange-800 border-orange-200",
  },
  stable: {
    label: "Stable",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
}

export function RiskBadge({ risk, className }: { risk: RiskLevel; className?: string }) {
  const config = riskConfig[risk] || riskConfig.stable // Fallback for undefined risk
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase",
        config?.className,
        className
      )}
    >
      {config?.label || 'Unknown'}
    </span>
  )
}
