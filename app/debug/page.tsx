"use client"

import { useEffect, useState } from "react"

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState("Loading...")
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log("🔍 Testing API connection...")
    console.log("🌐 API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL)
    
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/dams/latest`)
      .then(response => {
        console.log("✅ Response status:", response.status)
        setApiStatus(`Connected (${response.status})`)
        return response.json()
      })
      .then(data => {
        console.log("📊 Data received:", data.length, "dams")
        setData(data)
      })
      .catch(err => {
        console.error("❌ API Error:", err)
        setError(err.message)
        setApiStatus("Failed")
      })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Debug Page</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">API Status:</h2>
          <p className={apiStatus.includes("Connected") ? "text-green-600" : "text-red-600"}>
            {apiStatus}
          </p>
        </div>

        <div>
          <h2 className="font-semibold">Environment:</h2>
          <p>{process.env.NEXT_PUBLIC_API_BASE_URL}</p>
        </div>

        {error && (
          <div>
            <h2 className="font-semibold text-red-600">Error:</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {data && (
          <div>
            <h2 className="font-semibold">Data Sample:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(data.slice(0, 2), null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
