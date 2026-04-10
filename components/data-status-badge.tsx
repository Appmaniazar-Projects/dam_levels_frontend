"use client"

import type { DataStatus } from "@/lib/types"

interface DataStatusBadgeProps {
  status?: DataStatus
  lastSeen?: string
  compact?: boolean
}

export function DataStatusBadge({ status, lastSeen, compact = false }: DataStatusBadgeProps) {
  if (!status || status === 'fresh') {
    return null // Don't show badge for fresh data
  }

  const getStatusConfig = (status: DataStatus) => {
    switch (status) {
      case 'stale':
        return {
          icon: '🟡',
          label: 'Stale',
          description: 'Data from 1-4 weeks ago',
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
        }
      case 'old':
        return {
          icon: '🔴',
          label: 'Old',
          description: 'Data from 4+ weeks ago',
          className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }
      case 'historical':
        return {
          icon: '⚪',
          label: 'Historical',
          description: 'No recent data available',
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }
      default:
        return {
          icon: '❓',
          label: 'Unknown',
          description: 'Data status unknown',
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
        }
    }
  }

  const config = getStatusConfig(status)

  if (compact) {
    return (
      <div 
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}
        title={`${config.label}: ${config.description}${lastSeen ? ` (Last seen: ${new Date(lastSeen).toLocaleDateString()})` : ''}`}
      >
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </div>
    )
  }

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${config.className}`}
      title={`${config.label}: ${config.description}${lastSeen ? ` (Last seen: ${new Date(lastSeen).toLocaleDateString()})` : ''}`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
      {lastSeen && (
        <span className="opacity-75">
          ({new Date(lastSeen).toLocaleDateString()})
        </span>
      )}
    </div>
  )
}
