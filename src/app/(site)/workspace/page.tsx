import { fetchViewDashboardList } from '@/app/api/data';
import WorkspacePage from '@/components/workspace/WorkspacePage';

export default async function Page() {
  const dashboards = await fetchViewDashboardList();

  return <WorkspacePage dashboards={dashboards} />;
}