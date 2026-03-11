"use client"

export default function TestEnvPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Test</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">API Base URL:</h2>
          <p className="text-blue-600">{apiUrl || "NOT SET!"}</p>
        </div>
        
        <div>
          <h2 className="font-semibold">Test API Call:</h2>
          <button 
            onClick={() => {
              console.log("Making API call to:", apiUrl)
              fetch(`${apiUrl}/dams/latest`)
                .then(res => res.json())
                .then(data => console.log("API Response:", data))
                .catch(err => console.error("API Error:", err))
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Test API Call
          </button>
        </div>
      </div>
    </div>
  )
}
