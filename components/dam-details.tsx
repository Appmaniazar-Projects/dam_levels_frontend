"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RiskBadge } from "@/components/risk-badge"
import { ChangeIndicator } from "@/components/change-indicator"
import { LevelGauge } from "@/components/level-gauge"
import { MapPin, Camera, Calendar, Droplets, Ruler, Info } from "lucide-react"
import type { DamData } from "@/lib/types"

interface DamDetailsProps {
  dam: DamData
}

export function DamDetails({ dam }: DamDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Main Dam Card */}
      <Card className="transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1 min-w-0">
              <CardTitle className="text-base font-semibold text-foreground truncate">
                {dam.dam}
              </CardTitle>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                <span className="text-xs truncate">{dam.region}</span>
              </div>
            </div>
            <RiskBadge risk={dam.risk} />
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

      {/* Dam Photo */}
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Camera className="size-4" />
            <CardTitle>Photo</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {dam.photo_url ? (
            <img 
              src={dam.photo_url} 
              alt={`${dam.dam} - ${dam.region}`}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.jpg'
              }}
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Camera className="size-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Photo not available for this dam</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="size-4" />
            <CardTitle>Technical Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Check if any technical details exist */}
          {dam.river || dam.full_supply_capacity || dam.surface_area || dam.dam_type || dam.year_completed || dam.purpose ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dam.river && (
                  <div className="flex items-center gap-2">
                    <Droplets className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">River</div>
                      <div className="text-sm text-muted-foreground">{dam.river}</div>
                    </div>
                  </div>
                )}
                
                {dam.full_supply_capacity && (
                  <div className="flex items-center gap-2">
                    <Droplets className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Full Supply Capacity</div>
                      <div className="text-sm text-muted-foreground">
                        {dam.full_supply_capacity.toLocaleString()} million m³
                      </div>
                    </div>
                  </div>
                )}
                
                {dam.surface_area && (
                  <div className="flex items-center gap-2">
                    <Ruler className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Surface Area</div>
                      <div className="text-sm text-muted-foreground">
                        {dam.surface_area} km²
                      </div>
                    </div>
                  </div>
                )}
                
                {dam.dam_type && (
                  <div className="flex items-center gap-2">
                    <Info className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Dam Type</div>
                      <div className="text-sm text-muted-foreground">{dam.dam_type}</div>
                    </div>
                  </div>
                )}
                
                {dam.year_completed && (
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Year Completed</div>
                      <div className="text-sm text-muted-foreground">{dam.year_completed}</div>
                    </div>
                  </div>
                )}
              </div>
              
              {dam.purpose && (
                <div className="border-t border-border pt-3">
                  <div className="text-sm font-medium mb-1">Purpose</div>
                  <div className="text-sm text-muted-foreground">{dam.purpose}</div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Info className="size-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Technical details not available for this dam yet.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location */}
      {dam.latitude && dam.longitude && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <CardTitle>Location</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <div className="font-medium mb-1">GPS Coordinates</div>
              <div className="text-muted-foreground">
                {dam.latitude.toFixed(4)}°N, {dam.longitude.toFixed(4)}°W
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${dam.latitude},${dam.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View on Google Maps →
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      {dam.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {dam.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
