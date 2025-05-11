import { fetchViewDashboardList } from '@/app/api/data';
import { auth } from '@/auth';
import WorkspaceContent from '@/components/workspace/workspace-content';
import { getWorkspaceContent } from '@/lib/data';

export default async function Page() {
  const session = await auth()
  const userId =  session?.user?.id
  const dashboards = await getWorkspaceContent(userId!);

  return (
    <div className="px-6 pb-10 sm:px-10 sm:pt-2 lg:px-14 lg:pt-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 mt-4">
        <div>
          <h1 className="text-2xl font-bold">Your Workspace</h1>
          <p className="text-muted-foreground">
            {dashboards?.length} dashboards
          </p>
        </div>
      </div>
      <WorkspaceContent dashboards={dashboards} />
    </div>
  )
}