  import { getDashboardView } from '@/lib/data/dashboard';
  import { notFound } from 'next/navigation';
  import { Button } from '@/components/ui/button';
  import { ShareDrawerDialog } from '@/components/share-drawer-dialog';
  import { ChartColumn, ChevronLeft, MessageSquare, RefreshCw, Share2, SquarePen, ThumbsUp } from 'lucide-react';
  import { auth } from '@/auth';
  import Link from 'next/link';
  import { Avatar, AvatarFallback } from '@/components/ui/avatar';
  import ImageWithFallback from '@/components/ui/image-with-fallback';
  import { VisibilityBadge } from '@/components/visibility-badge';
  import { formatDistanceToNowStrict } from 'date-fns';
  import { Suspense } from 'react';
  import Chart from '@/components/dashboard/chart';
  import CommentSheet from '@/components/dashboard/comment-sheet';
import LikeButtonFetcher from '@/components/dashboard/like-button-fetcher';

  export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const session = await auth();
    const userId = session?.user?.id;

    const dashboard = await getDashboardView(id);
    if (!dashboard) {
      notFound();
    }
    
    const isAuthor = String(userId) === String(dashboard.author.id);

    return (
      <div className="max-w-7xl pb-10 mx-auto px-4 xs:px-6 sm:px-10 lg:px-24">
        {/* Navigation Section */}
        <div className="flex justify-between items-center mt-4 md:mb-4 border-border">
          <Link href="/workspace" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors hover:underline">
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:block">Back to Workspace</span>
          </Link>

          <div className="flex gap-2">
            <ShareDrawerDialog
              dashboardId={dashboard.id}
              dashboardTitle={dashboard.title}
              dashboardIsPublic={dashboard.is_public}
              isAuthor={isAuthor}
            >
              <Button variant="ghost">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </ShareDrawerDialog>
            
            {isAuthor && (
              <Link href={`/dashboard/${dashboard.id}/edit`}>
                <Button>
                  <SquarePen className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="bg-background mb-8 px-6 py-4 border-b">
            {/* Hero Section */}
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

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4">
                <div className="flex w-full gap-4 items-center flex-wrap justify-center md:justify-start">
                  <span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                    <ChartColumn className="w-4 h-4" />
                    {dashboard.charts.length} chart{dashboard.charts.length > 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                    <RefreshCw className="w-4 h-4" />
                    {formatDistanceToNowStrict(new Date(dashboard.updated_at))} ago
                  </span>
                </div>

                <div className="flex w-full md:w-auto justify-center md:justify-start text-muted-foreground">
                  <Suspense fallback={
                    <Button variant="ghost" disabled>
                      <ThumbsUp className="h-4 w-4"/>
                      <span className="h-4 w-4 rounded bg-gray-300 animate-pulse" />
                    </Button>
                  }>
                    <LikeButtonFetcher dashboardId={dashboard.id} />
                  </Suspense>
                  
                  <Suspense fallback={
                    <Button variant="ghost" disabled>
                      <MessageSquare className="h-4 w-4 animate-pulse" />
                      <span className="h-4 w-4 rounded bg-gray-300 animate-pulse" />
                    </Button>
                  }>
                    <CommentSheet id={dashboard.id} />
                  </Suspense>
                </div>
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
                  <h3 className="font-semibold">{chart.title || 'Untitled chart'}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {chart.description}
                  </p>
                </div>
              </div>

              <Chart data={chart.data} config={chart.config} />
            </div>
          ))}
        </div>
      </div>
    )
  }