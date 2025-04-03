export default function DashboardEditSkeleton() {
  return (
    <div className="max-w-7xl pb-10 mx-auto px-4 xs:px-6 sm:px-10 lg:px-24 animate-pulse">
      {/* Navigation Skeleton */}
      <div className="flex justify-between items-center mt-4 md:mb-4 border-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-muted rounded-full" />
          <div className="hidden sm:block w-32 h-6 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="bg-card mb-8 px-6 py-4 border-b">
        <div className="text-center md:text-left space-y-4">
          {/* Title */}
          <div className="w-64 h-8 bg-muted rounded-lg mx-auto md:mx-0" />
          {/* Description */}
          <div className="w-full md:w-2/3 h-4 bg-muted rounded-lg mx-auto md:mx-0" />
        </div>
      </div>

      {/* Chart Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Existing Chart Placeholders */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card p-4 rounded-lg border border-border space-y-4">
            {/* Chart Header */}
            <div className="space-y-2">
              <div className="w-48 h-6 bg-muted rounded-lg" />
              <div className="w-64 h-4 bg-muted rounded-lg" />
            </div>
            {/* Chart Area */}
            <div className="h-64 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}