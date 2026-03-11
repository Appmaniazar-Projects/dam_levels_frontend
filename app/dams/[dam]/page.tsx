import { DamDetailContent } from "@/components/dam-detail-content"

export async function generateMetadata({ params }: { params: Promise<{ dam: string }> }) {
  const { dam } = await params
  const damName = decodeURIComponent(dam)
  return {
    title: `${damName} - SA Dam Levels`,
    description: `Current water level, risk status, and historical trends for ${damName} dam.`,
  }
}

export default function DamDetailPage({ params }: { params: Promise<{ dam: string }> }) {
  return <DamDetailContent params={params} />
}
