'use client'

import { useState } from 'react';
import {
  RiAddLine as PlusIcon,
  RiBarChartFill as ChartIcon,
  RiLayoutGridFill as GridViewIcon,
  RiListUnordered as ListViewIcon
} from '@remixicon/react';
import Button from '@/components/Button';
import GridDashboardCard from '@/components/workspace/GridDashboardCard';
import ListDashboardCard from '@/components/workspace/ListDashboardCard';
import CreateDashboardModal from '@/components/workspace/CreateDashboardModal';
import { DashboardSummary } from '@/types/dashboard';

export default function WorkspacePage({ dashboards }: { dashboards: DashboardSummary[] }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);

  const handleCreate = (title: string, file: File) => {
    console.log('Creating:', title, file);
  };

  return (
    <div className="px-6 sm:px-10 sm:py-2 lg:px-14 lg:py-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 mt-4">
        <div>
          <h1 className="text-2xl font-bold">My Workspaces</h1>
          <p className="text-muted-foreground">
            {dashboards.length} dashboards
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-8">
        {/* Create Dashboard */}
        <Button type="submit" icon={<PlusIcon />} variant="primary" onClick={() => setShowModal(true)}>
            New Dashboard
        </Button>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg hover:bg-muted transition-colors 
              ${viewMode === 'grid' ? 'bg-muted' : ''}`}
            title="Grid View"
          >
            <GridViewIcon className="w-5 h-5 text-muted-foreground" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg hover:bg-muted transition-colors 
                        ${viewMode === 'list' ? 'bg-muted' : ''}`}
            title="List View"
          >
            <ListViewIcon className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Dashboard List/Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6"
        >
          {dashboards.map((dashboard) => (
            <GridDashboardCard key={dashboard.id} dashboard={dashboard} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {dashboards.map((dashboard) => (
            <ListDashboardCard key={dashboard.id} dashboard={dashboard} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {dashboards.length === 0 && (
        <div className="text-center py-12">
          <ChartIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No dashboards found</h3>
          <p className="text-muted-foreground mb-6">
            Create your first dashboard to get started
          </p>
        </div>
      )}

      {/* Create Dashboard Modal */}
      <CreateDashboardModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}