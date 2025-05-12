import Link from "next/link"
import {
  ChartColumn,
  FileChartColumn,
  RefreshCw
} from "lucide-react"
import { formatDistanceToNowStrict } from "date-fns"
import type { DashboardSummary } from "@/types/dashboard"
import CardDropdown from "@/components/workspace/card-dropdown"
import ImageWithFallback from "@/components/ui/image-with-fallback"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { VisibilityBadge } from "@/components/visibility-badge"

export default function GridDashboard({ dashboard }: { dashboard: DashboardSummary }) {
  return (
    <div className="flex flex-col group relative overflow-hidden rounded-lg border bg-card transition-all hover:border-primary hover:shadow-sm">
      {/* Dropdownn Menu */}
      <div className="absolute right-3 top-3 z-10 transition-opacity">
        <CardDropdown dashboard={dashboard} />
      </div>

      <Link href={`/dashboard/${dashboard.id}/view`} className="flex flex-col h-full">
        {/* Preview Area */}
        <AspectRatio ratio={16 / 9} className="overflow-hidden">
          <ImageWithFallback
            src={dashboard.preview_image || "/dashboard-preview.png"}
            alt={`Preview of ${dashboard.title}`}
            fill={true}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            fallback={"/dashboard-preview.png"}
          />
        </AspectRatio>

        {/* Card Content */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          {/* Title and Visibility */}
          <div className="flex items-center gap-2 max-w-full mb-1">
            <h3 className="font-medium two-line-truncate break-words">
              <VisibilityBadge isPublic={dashboard.is_public} className="inline-flex" />
              &nbsp;{dashboard.title}
            </h3>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1 truncate max-w-[16rem]">
              <FileChartColumn className="h-3 w-3 flex-shrink-0" />
              <span className="truncate" title={dashboard.dataset}>
                {dashboard.dataset}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <ChartColumn className="h-3 w-3 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {dashboard.chart_count} chart{dashboard.chart_count > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3 flex-shrink-0" />
              <span className="whitespace-nowrap">
                {formatDistanceToNowStrict(new Date(dashboard.updated_at))} ago
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
