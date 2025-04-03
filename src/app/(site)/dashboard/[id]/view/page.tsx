import { fetchViewDashboard } from '@/app/api/data';
import DashboardViewPage from '@/components/dashboard/DashboardViewPage';

export default async function Page() {
  const dashboard = await fetchViewDashboard();

  return <DashboardViewPage dashboard={dashboard} />;
}