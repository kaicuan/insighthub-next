import Link from 'next/link';
import Image from 'next/image';
import {
  RiBarChartFill as ChartIcon,
  RiFileChartFill as DatasetIcon,
  RiGlobalLine as PublicIcon,
  RiLockLine as PrivateIcon
} from '@remixicon/react';
import CardDropdown from '@/components/workspace/CardDropdown';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { DashboardSummary } from '@/types/dashboard';

interface GridDashboardCardProps {
  dashboard: DashboardSummary
}

export default function GridDashboardCard({ dashboard }: GridDashboardCardProps) {
  return (
    <Link href={`/dashboard/1/view`}>
      <div className="bg-card border rounded-lg p-4 hover:border-primary 
                    transition-transform hover:scale-[1.01]">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1 w-full overflow-hidden">
            {/* Title + Visibility Badge */}
            <div className="flex items-center gap-2 flex-nowrap">
              <h3 
                className="font-semibold truncate max-w-[140px] sm:max-w-[180px]"
                title={dashboard.title}
              >
                {dashboard.title}
              </h3>
              <span 
                className={`px-2 py-1 text-xs rounded-full flex-shrink-0 
                          ${dashboard.is_public 
                            ? 'bg-primary/20 text-primary' 
                            : 'bg-muted text-muted-foreground'}`}
                title={dashboard.is_public ? 'Public Dashboard' : 'Private Dashboard'}
              >
                {dashboard.is_public ? (
                  <PublicIcon className="w-4 h-4" />
                ) : (
                  <PrivateIcon className="w-4 h-4" />
                )}
              </span>
            </div>

            {/* Dataset Filename */}
            <div className="flex items-center gap-1 text-muted-foreground truncate">
              <DatasetIcon className="w-4 h-4 flex-shrink-0" />
              <span 
                className="truncate" 
                title={dashboard.dataset}
              >
                {dashboard.dataset}
              </span>
            </div>
          </div>

          <CardDropdown dashboardId={dashboard.id} />
        </div>

        {/* Preview Area */}
        <div className="relative mb-4 h-40 bg-muted rounded-lg overflow-hidden">
          <Image
            src={`/insighthub${dashboard.preview_image}`}
            alt={`Preview of ${dashboard.title}`}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>

        {/* Metadata */}
        <div className="flex justify-between text-muted-foreground">
          <div className="flex max-w-2/5 items-center gap-1 truncate">
            <ChartIcon className="w-4 h-4 shrink-0" />
            <span className="text-sm">{dashboard.chart_count} chart(s)</span>
          </div>
          <div className="flex max-w-3/5 items-center text-xs truncate">
            Updated {formatDistanceToNow(new Date(dashboard.updated_at))} ago
          </div>
        </div>
      </div>
    </Link>
  );
}