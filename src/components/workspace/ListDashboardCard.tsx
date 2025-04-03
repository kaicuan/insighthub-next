import Link from 'next/link';
import {
  RiBarChartFill as ChartIcon,
  RiGlobalLine as PublicIcon,
  RiLockLine as PrivateIcon,
  RiFileChartFill as DatasetIcon
} from '@remixicon/react';
import CardDropdown from '@/components/workspace/CardDropdown';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { DashboardSummary } from '@/types/dashboard';

interface ListDashboardCardProps {
  dashboard: DashboardSummary
}

export default function ListDashboardCard({ dashboard }: ListDashboardCardProps) {
  return (
    <Link 
      href={`/dashboard/1/view`}
      className="grid grid-cols-[1fr_auto] gap-4 p-4 bg-card border
                    rounded-lg hover:border-primary transition-transform hover:scale-[1.01]"
    >
      {/* Content Column */}
      <div className="space-y-1 overflow-hidden self-center">
        {/* Dashboard Name */}
        <div className="flex items-center gap-2">
          <h3 
            className="font-semibold truncate max-w-[200px] sm:max-w-3/5"
            title={dashboard.title}
          >
            {dashboard.title}
          </h3>
          <span 
            className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 
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
            <span className="hidden sm:block">
              {dashboard.is_public ? 'Public' : 'Private'}
            </span>
          </span>
        </div>

        {/* Metadata */}
        <div className="flex flex-col sm:flex-row sm:gap-4 text-muted-foreground">
          {/* Dataset Filename */}
          <div className="flex items-center gap-1 max-w-[200px] sm:max-w-2/5 truncate">
            <DatasetIcon className="w-4 h-4 shrink-0" />
            <span 
              className="truncate" 
              title={dashboard.dataset}
            >
              {dashboard.dataset}
            </span>
          </div>

          {/* Chart Count */}
          <div className="flex items-center gap-1 sm:max-w-1/5 truncate">
            <ChartIcon className="w-4 h-4 shrink-0" />
            {dashboard.chart_count} chart(s)
          </div>

          {/* Last Updated */}
          <div className="flex items-center gap-1 sm:max-w-2/5 truncate">
            Updated {formatDistanceToNow(new Date(dashboard.updated_at))} ago
          </div>
        </div>
      </div>

      {/* Actions Column */}
      <div className="flex flex-col sm:flex-row gap-2 items-center">
        <CardDropdown dashboardId={dashboard.id} />
      </div>
    </Link>
  );
}