"use client"

import { useState, useEffect } from "react"

export default function SimpleTestPage() {
  const [apiUrl, setApiUrl] = useState("")
  const [apiStatus, setApiStatus] = useState("Loading...")
  const [apiData, setApiData] = useState(null)

  useEffect(() => {
    // Check environment variable
    const url = process.env.NEXT_PUBLIC_API_BASE_URL
    setApiUrl(url || "NOT SET")

    // Test API connection
    if (url) {
      fetch(`${url}/dams/latest`)
        .then(res => {
          setApiStatus(`Connected (${res.status})`)
          return res.json()
        })
        .then(data => {
          setApiData(`Found ${data.length} dams`)
        })
        .catch(err => {
          setApiStatus(`Error: ${err.message}`)
          setApiData(null)
        })
    } else {
      setApiStatus("No API URL configured")
    }
  }, [])

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold text-blue-900">Environment Variable:</h2>
          <p className="text-blue-700 font-mono">{apiUrl}</p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h2 className="font-semibold text-green-900">API Status:</h2>
          <p className="text-green-700">{apiStatus}</p>
        </div>

        {apiData && (
          <div className="p-4 bg-purple-50 rounded-lg">
            <h2 className="font-semibold text-purple-900">Data Received:</h2>
            <p className="text-purple-700">{apiData}</p>
          </div>
        )}

        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold text-gray-900">Next Steps:</h2>
          <ul className="text-gray-700 list-disc list-inside space-y-1">
            <li>If API URL is "NOT SET", environment variable is not working</li>
            <li>If API Status shows an error, check if backend is running</li>
            <li>If everything looks good, try the main dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
