import Link from "next/link"
import { Droplets } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-foreground transition-colors hover:text-primary"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Droplets className="size-4.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight tracking-tight">
              SA Dam Levels
            </span>
            <span className="text-[10px] leading-tight text-muted-foreground">
              Water Awareness Dashboard
            </span>
          </div>
        </Link>
      </div>
    </header>
  )
}
