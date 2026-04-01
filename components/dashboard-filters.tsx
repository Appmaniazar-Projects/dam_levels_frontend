"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"

interface DashboardFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  province: string
  onProvinceChange: (value: string) => void
  sortBy: string
  onSortByChange: (value: string) => void
  provinces: string[]
}

export function DashboardFilters({
  search,
  onSearchChange,
  province,
  onProvinceChange,
  sortBy,
  onSortByChange,
  provinces,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          id="dam-search"
          name="dam-search"
          placeholder="Search dams..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search dams by name"
        />
      </div>
      <Select value={province} onValueChange={onProvinceChange}>
        <SelectTrigger className="w-full sm:w-48" aria-label="Filter by province">
          <SelectValue placeholder="All Provinces" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Provinces</SelectItem>
          {provinces.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortByChange}>
        <SelectTrigger className="w-full sm:w-48" aria-label="Sort dams">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="risk">Sort by Risk</SelectItem>
          <SelectItem value="level-asc">Level: Critical to Stable</SelectItem>
          <SelectItem value="level-desc">Level: Stable to Critical</SelectItem>
          <SelectItem value="weekly-change">Weekly Change</SelectItem>
          <SelectItem value="name">Name A-Z</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
