import { Dashboard } from "@/lib/definitions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BarChart } from "@/components/BarChart";
import { LineChart } from "@/components/LineChart";
import { formatDistanceToNowStrict } from "date-fns";
import { ChartColumn, RefreshCw } from "lucide-react";
import { Suspense } from "react";
import ImageWithFallback from "@/components/ui/image-with-fallback";
import { VisibilityBadge } from "@/components/visibility-badge";

export default function DashboardViewContent({ dashboard }:{ dashboard:Dashboard }) {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-background mb-8 px-6 py-4 border-b">
          <div className="text-center md:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold lg:max-w-4/5 mb-2">
              {dashboard.title}&nbsp;
              <VisibilityBadge 
                isPublic={dashboard.is_public} 
                className="inline-flex align-middle" 
              />
            </h1>
            
            <p className="text-muted-foreground">
              {dashboard.description}
            </p>
            
            <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
              {/* Avatar */}
              <Avatar >
                {dashboard.author?.profile_image ? (
                  <Suspense fallback={<AvatarFallback className='rounded-lg'>{dashboard.author?.first_name?.charAt(0)}</AvatarFallback>}>
                    <ImageWithFallback
                      src={
                        dashboard.author?.profile_image?.startsWith('http')
                          ? dashboard.author.profile_image
                          : `/${dashboard.author?.profile_image}`
                      }
                      alt={`Profile image of ${dashboard.author?.first_name}`}
                      fill={true}
                    />
                  </Suspense>
                ) : (
                  <AvatarFallback className='rounded-lg'>{dashboard.author?.first_name?.charAt(0)}</AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {dashboard.author.first_name} {dashboard.author.last_name}
              </span>
            </div>

            <div className="flex gap-4 mt-4 items-center justify-center md:justify-start">
              <span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                <ChartColumn className="w-4 h-4" />
                {dashboard.charts.length} chart{dashboard.charts.length > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                <RefreshCw className="w-4 h-4" />
                {formatDistanceToNowStrict(new Date(dashboard.updated_at))} ago
              </span>
            </div>
          </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboard.charts.map((chart) => (
          <div 
            key={chart.id}
            className="bg-card p-4 rounded-lg border border-border hover:border-primary 
                      transition-transform hover:scale-[1.01] h-fit"
          >
            <div className="flex flex-col gap-2 mb-4 mx-2 text-justify">
              <div>
                <h3 className="font-semibold">{chart.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {chart.description || 'No description'}
                </p>
              </div>
            </div>

            {chart.config.type === 'bar' ? (
              <BarChart
                className="h-64"
                data={chart.data}
                index={chart.config.index}
                categories={chart.config.categories}
                startEndOnly={chart.config.start_end_only}
                xAxisLabel={chart.config.x_axis_label}
                yAxisLabel={chart.config.y_axis_label}
                legendPosition='left'
              />
            ) : (
              <LineChart
                className="h-64"
                data={chart.data}
                index={chart.config.index}
                categories={chart.config.categories}
                startEndOnly={chart.config.start_end_only}
                xAxisLabel={chart.config.x_axis_label}
                yAxisLabel={chart.config.y_axis_label}
                legendPosition='left'
              />
            )}
          </div>
        ))}
      </div>
    </>
  )
}