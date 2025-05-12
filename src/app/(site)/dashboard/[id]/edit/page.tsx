import { getDashboardEdit } from '@/lib/data/dashboard';
import DashboardEditPage from '@/components/dashboard/dashbboard-edit';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  // const dashboard = await fetchEditDashboard();
  const dashboard = await getDashboardEdit(id)
  if (!dashboard) {
    notFound();
  }

  return <DashboardEditPage dashboard={dashboard} />;
}