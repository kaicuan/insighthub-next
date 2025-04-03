import { fetchEditDashboard } from '@/app/api/data';
import DashboardEditPage from '@/components/dashboard/DashboardEditPage';

export default async function Page() {
  const dashboard = await fetchEditDashboard();

  return <DashboardEditPage dashboard={dashboard} />;
}