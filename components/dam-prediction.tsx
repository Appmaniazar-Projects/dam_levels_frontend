"use client"

import { useState } from "react"
import useSWR from "swr"
import { fetchDamPrediction } from "@/lib/api"
import { TrendingUp, AlertTriangle, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PredictionProps {
  damName: string
}

export function DamPrediction({ damName }: PredictionProps) {
  const [showPrediction, setShowPrediction] = useState(false)
  const { data: prediction, error, isLoading } = useSWR(
    showPrediction ? `prediction-${damName}` : null,
    () => fetchDamPrediction(damName)
  )

  if (!showPrediction) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPrediction(true)}
        className="w-full"
      >
        <Brain className="size-4 mr-2" />
        Show 4-Week Prediction
      </Button>
    )
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertTriangle className="size-4" />
          <span className="text-sm font-medium">Prediction unavailable</span>
        </div>
        <p className="text-xs text-yellow-700 mt-1">
          {error.message || "Insufficient historical data"}
        </p>
      </div>
    )
  }

  if (isLoading || !prediction) {
    return (
      <div className="animate-pulse">
        <div className="h-20 bg-muted rounded-lg"></div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-800">
          <Brain className="size-4" />
          <span className="text-sm font-medium">4-Week Prediction</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPrediction(false)}
          className="text-blue-600 hover:text-blue-800"
        >
          Hide
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {prediction.predictions.map((pred, index) => (
          <div key={index} className="bg-white rounded p-2 border border-blue-100">
            <div className="text-xs text-muted-foreground">
              Week {pred.week_ahead}
            </div>
            <div className="font-semibold text-blue-900">
              {pred.predicted_level}%
            </div>
            <div className="text-xs text-blue-700">
              {new Date(pred.date).toLocaleDateString("en-ZA", {
                month: "short",
                day: "numeric"
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-blue-700 border-t border-blue-200 pt-2">
        <p><strong>Model:</strong> {prediction.model_type}</p>
        <p><strong>Data points:</strong> {prediction.data_points_used}</p>
        <p><strong>Confidence:</strong> {prediction.predictions[0]?.confidence}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {prediction.note}
        </p>
      </div>
    </div>
  )
}
