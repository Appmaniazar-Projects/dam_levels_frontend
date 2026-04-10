"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RiskBadge } from "@/components/risk-badge"
import { DataStatusBadge } from "@/components/data-status-badge"
import { ChangeIndicator } from "@/components/change-indicator"
import { LevelGauge } from "@/components/level-gauge"
import { MapPin } from "lucide-react"
import type { DamData } from "@/lib/types"

interface DamCardProps {
  dam: DamData
}

export function DamCard({ dam }: DamCardProps) {
  // Handle undefined dam data
  if (!dam) {
    return (
      <Card className="opacity-50">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            Loading dam data...
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Link href={`/dams/${encodeURIComponent(dam.dam)}`} className="group block">
      <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/30 group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <CardTitle className="text-base font-semibold text-foreground truncate">
                {dam.dam || 'Unknown Dam'}
              </CardTitle>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                <span className="text-xs truncate">{dam.region || 'Unknown Region'}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <RiskBadge risk={dam.risk} />
              <DataStatusBadge status={dam.data_status} lastSeen={dam.last_seen} compact />
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <LevelGauge level={dam.level} risk={dam.risk} />
          <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
            <ChangeIndicator value={dam.weekly_change} label="week" />
            <ChangeIndicator value={dam.yearly_change} label="year" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
