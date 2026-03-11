"use client"

import { useEffect, useState, useCallback, useRef } from "react"

interface CacheEntry<T> {
  data: T
  timestamp: number
  source: string
}

interface UseResilientDataOptions<T> {
  fallbackData?: T
  cacheKey?: string
  cacheDuration?: number
}

export function useResilientData<T>(
  fetcher: () => Promise<T>,
  options: UseResilientDataOptions<T> = {}
) {
  const {
    fallbackData,
    cacheKey = "default",
    cacheDuration = 5 * 60 * 1000 // 5 minutes
  } = options

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [dataSource, setDataSource] = useState<"api" | "cache" | "fallback" | null>(null)

  // Get cached data
  const getCachedData = useCallback((): CacheEntry<T> | null => {
    try {
      const cached = localStorage.getItem(`cache_${cacheKey}`)
      if (cached) {
        const parsed = JSON.parse(cached) as CacheEntry<T>
        if (Date.now() - parsed.timestamp < cacheDuration) {
          return parsed
        }
      }
    } catch (error) {
      console.warn("Cache read error:", error)
    }
    return null
  }, [cacheKey, cacheDuration])

  // Set cached data
  const setCachedData = useCallback((data: T, source: string) => {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        source
      }
      localStorage.setItem(`cache_${cacheKey}`, JSON.stringify(entry))
    } catch (error) {
      console.warn("Cache write error:", error)
    }
  }, [cacheKey])

  // Use a ref for the fetcher to prevent infinite loops if an inline function is passed
  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  // Fetch data with fallback
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Try fresh API data
      const freshData = await fetcherRef.current()
      setData(freshData)
      setDataSource("api")
      setCachedData(freshData, "api")

    } catch (fetchError) {
      console.warn("API failed, trying cache:", fetchError)

      // Try cached data
      const cached = getCachedData()
      if (cached) {
        setData(cached.data)
        setDataSource("cache")
        setError(fetchError as Error)

      } else if (fallbackData) {
        // Use fallback data
        setData(fallbackData)
        setDataSource("fallback")
        setError(fetchError as Error)

      } else {
        // No fallback available
        setError(fetchError as Error)
        setData(null)
        setDataSource(null)
      }
    } finally {
      setIsLoading(false)
    }
  }, [getCachedData, setCachedData, fallbackData])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Manual retry
  const retry = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    dataSource,
    isUsingFallback: dataSource !== "api",
    retry
  }
}
