import { LayoutGrid, List, BarChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardSummary } from '@/lib/definitions';
import GridDashboard from '@/components/workspace/grid-dashboard';
import ListDashboard from '@/components/workspace/list-dashboard';
import DrawerDialog from '@/components/workspace/create-dashboard-drawer-dialog';

export default function WorkspaceContent({ dashboards }: { dashboards?: DashboardSummary[] }) {
  return (
    <Tabs defaultValue="grid">
      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-8">
        {/* Create Dashboard */}
        <DrawerDialog />

        {/* View Toggle */}
          <TabsList>
            <TabsTrigger value="grid" title="Grid View">
              <LayoutGrid className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list" title="List View">
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
      </div>

      <TabsContent value="grid">
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(16rem,_1fr))] gap-6 items-stretch">
          {dashboards?.map((dashboard) => (
            <GridDashboard key={dashboard.id} dashboard={dashboard} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="list">
        <div className="space-y-2">
          {dashboards?.map((dashboard) => (
            <ListDashboard key={dashboard.id} dashboard={dashboard} />
          ))}
        </div>
      </TabsContent>

      {/* Empty State */}
      {dashboards?.length === 0 && (
        <div className="flex flex-col justify-center items-center text-center py-12 h-[50vh]">
          <BarChart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No dashboards yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first dashboard to get started!
          </p>
        </div>
      )}
    </Tabs>
  );
}