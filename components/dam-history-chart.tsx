"use client"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import type { DamHistory, RiskLevel } from "@/lib/types"
import { format, parseISO } from "date-fns"

const riskChartColor: Record<RiskLevel, { stroke: string; fill: string }> = {
  critical: { stroke: "#dc2626", fill: "#fecaca" },
  warning: { stroke: "#ea580c", fill: "#fed7aa" },
  stable: { stroke: "#2563eb", fill: "#bfdbfe" },
  full: { stroke: "#059669", fill: "#a7f3d0" },
}

interface DamHistoryChartProps {
  data: DamHistory[]
  risk: RiskLevel
}

export function DamHistoryChart({ data, risk }: DamHistoryChartProps) {
  const colors = riskChartColor[risk]

  const formattedData = data.map((d) => ({
    ...d,
    dateLabel: format(parseISO(d.date), "d MMM"),
  }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={formattedData}
          margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
        >
          <defs>
            <linearGradient id={`fill-${risk}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.fill} stopOpacity={0.6} />
              <stop offset="100%" stopColor={colors.fill} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="oklch(0.91 0.01 230)"
          />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 11, fill: "oklch(0.50 0.02 240)" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "oklch(0.50 0.02 240)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val: number) => `${val}%`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const point = payload[0]
              return (
                <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(point.payload.date), "d MMM yyyy")}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {(point.value as number).toFixed(1)}%
                  </p>
                </div>
              )
            }}
          />
          <Area
            type="monotone"
            dataKey="level"
            stroke={colors.stroke}
            strokeWidth={2}
            fill={`url(#fill-${risk})`}
            dot={false}
            activeDot={{
              r: 5,
              fill: colors.stroke,
              stroke: "oklch(1 0 0)",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
