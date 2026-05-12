
import { fetchSystemDams, fetchAllSystems } from "@/lib/api-systems"
import type { WaterSupplySystem }           from "@/lib/api-systems"
import { SystemDashboard }                  from "@/components/system-dashboard"
import { notFound }                         from "next/navigation"

interface Props {
  params: { system: string }
}

// Temporarily disable static generation until API is deployed
// export async function generateStaticParams() {
//   const systems: WaterSupplySystem[] = await fetchAllSystems()
//   return systems.map((s: WaterSupplySystem) => ({
//     system: s.system_code.toLowerCase(),
//   }))
// }

export async function generateMetadata({ params }: Props) {
  // Temporarily disable metadata generation until API is deployed
  // const systems: WaterSupplySystem[] = await fetchAllSystems()
  // const system = systems.find(
  //   (s: WaterSupplySystem) => s.system_code.toLowerCase() === params.system.toLowerCase()
  // )
  // if (!system) return {}
  return {
    title:       `${params.system.toUpperCase()} Water Supply | Dam Levels`,
    description: `Live dam levels for water supply system.`,
  }
}

export default async function CityPage({ params }: Props) {
  const code = params.system.toUpperCase()

  const [systems, dams] = await Promise.all([
    fetchAllSystems(),
    fetchSystemDams(code),
  ])

  const system = systems.find((s: WaterSupplySystem) => s.system_code === code)
  if (!system) notFound()

  // After notFound() TypeScript still considers system possibly undefined.
  // The non-null assertion below is safe because notFound() throws.
  return <SystemDashboard system={system!} dams={dams} />
}
