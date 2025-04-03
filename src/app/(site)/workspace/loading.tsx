export default function WorkspaceSkeleton() {
  return (
    <div className="px-6 sm:px-10 lg:px-14 pt-4">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6 mt-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-32 h-10 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
          <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Dashboard Grid/List Skeleton */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-card border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-6 w-32 bg-muted rounded-lg animate-pulse" />
              <div className="h-6 w-6 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="h-40 bg-muted rounded-lg animate-pulse" />
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-muted rounded-lg animate-pulse" />
              <div className="h-4 w-20 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}