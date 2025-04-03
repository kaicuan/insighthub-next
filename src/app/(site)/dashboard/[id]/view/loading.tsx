export default function DashboardViewSkeleton() {
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
          {/* Title & Badge */}
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-64 h-8 bg-muted rounded-lg" />
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted">
              <div className="w-4 h-4 bg-muted" />
              <div className="hidden sm:block w-16 h-4 bg-muted rounded" />
            </div>
          </div>

          {/* Description */}
          <div className="w-full md:w-2/3 h-4 bg-muted rounded-lg mx-auto md:mx-0" />

          {/* Author Info */}
          <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <div className="w-32 h-4 bg-muted rounded-lg" />
          </div>

          {/* Metadata */}
          <div className="flex gap-4 mt-4 items-center justify-center md:justify-start">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-muted" />
              <div className="w-16 h-4 bg-muted rounded-lg" />
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-muted" />
              <div className="w-24 h-4 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card p-4 rounded-lg border border-border h-fit">
            {/* Chart Header */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="w-48 h-6 bg-muted rounded-lg" />
              <div className="w-64 h-4 bg-muted rounded-lg" />
            </div>

            {/* Chart Placeholder */}
            <div className="h-64 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}