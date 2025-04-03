'use client';

import { useState, useRef, useId } from 'react';
import Link from 'next/link';
import { 
  RiArrowLeftSLine as ArrowBackIcon, 
  RiSave2Fill as SaveIcon, 
  RiAddLine as AddIcon 
} from '@remixicon/react';
import { EditDashboard } from '@/types/dashboard';
import Button from '@/components/Button';
import EditableField from '@/components/dashboard/EditableField';
import { SortableChart } from '@/components/dashboard/SortableChart';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

interface DashboardEditPageProps {
  dashboard: EditDashboard;
}

export default function DashboardEditPage({ dashboard }: DashboardEditPageProps) {
  const [dashboardState, setDashboardState] = useState<EditDashboard>(dashboard);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setDashboardState((prev) => {
        const oldIndex = prev.charts.findIndex((c) => c.id === active.id);
        const newIndex = prev.charts.findIndex((c) => c.id === over?.id);
        return {
          ...prev,
          charts: arrayMove(prev.charts, oldIndex, newIndex),
        };
      });
    }
  };

  const handleFieldChange = (field: keyof EditDashboard) => (value: string) => {
    setDashboardState((prev) => ({ ...prev, [field]: value }));
  };

  const handleChartFieldUpdate = (chartId: string, field: 'title' | 'description') => 
    (value: string) => {
      setDashboardState(prev => ({
        ...prev,
        charts: prev.charts.map(chart => 
          chart.id === chartId ? { ...chart, [field]: value } : chart
        )
      }));
    };
  
  const handleFullChartUpdate = (chartId: string) => 
    (updatedChart: EditDashboard['charts'][0]) => {
      setDashboardState(prev => ({
        ...prev,
        charts: prev.charts.map(chart => 
          chart.id === chartId ? updatedChart : chart
        )
      }));
    };

  const handleDeleteChart = (chartId: string) => {
    setDashboardState(prev => ({
      ...prev,
      charts: prev.charts.filter(chart => chart.id !== chartId)
    }));
  };

  const handleSave = () => {
    if (!dashboardState.title.trim()) return alert("Title cannot be empty");
    console.log('Saving:', dashboardState);
  };

  const handleAddNewChart = () => {
    const newChart = {
      id: Date.now().toString(),
      title: '',
      description: '',
      data: [],
      config: {
        type: 'bar',
        x_axis: '',
        y_axis: '',
        series: null,
        aggregation: 'none',
        index: '',
        x_axis_label: '',
        start_end_only: false,
        categories: [],
        y_axis_label: '',
        bar_type: 'default',
        layout: 'horizontal'
      }
    };
    
    setDashboardState(prev => ({
      ...prev,
      charts: [...prev.charts, newChart]
    }));
  };

  return (
    <div className="max-w-7xl pb-10 mx-auto px-4 xs:px-6 sm:px-10 lg:px-24">
      {/* Navigation Section */}
      <div className="flex justify-between items-center mt-4 md:mb-4 border-border">
        <Link href="/workspace" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors hover:underline">
          <ArrowBackIcon className="w-5 h-5" />
          <span className="hidden sm:block">Back to Workspaces</span>
        </Link>

        <div className='flex gap-2'>
          <Link href={`/dashboard/${dashboard.id}/view`}>
            <Button
              variant="ghost"
            >
              Cancel
            </Button>
          </Link>
          <Button
            icon={<SaveIcon />}
            variant="primary"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Editable Hero Section */}
      <div className="bg-card mb-8 px-6 py-4 border-b">
        <div className="text-center md:text-left">
          <EditableField
            ref={titleRef}
            value={dashboardState.title}
            placeholder="Untitled Dashboard"
            className="text-2xl sm:text-3xl font-bold lg:max-w-4/5 px-1 -mx-1 mb-2"
            onBlur={handleFieldChange('title')}
            onChange={handleFieldChange('title')}
            onEnter={() => descriptionRef.current?.focus()}
            ariaLabel="Dashboard title"
          />

          <EditableField
            ref={descriptionRef}
            value={dashboardState.description}
            placeholder="Add dashboard description..."
            className="text-muted-foreground px-1 -mx-1 min-h-[28px]"
            onBlur={handleFieldChange('description')}
            onChange={handleFieldChange('description')}
            ariaLabel="Dashboard description"
          />
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DndContext
          id={dndId}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={dashboardState.charts.map((c) => c.id)}
            strategy={rectSortingStrategy}
          >
            {dashboardState.charts.map((chart) => (
              <SortableChart 
                key={chart.id}
                chart={chart}
                dataset={dashboard.dataset}
                onTitleChange={handleChartFieldUpdate(chart.id, 'title')}
                onDescriptionChange={handleChartFieldUpdate(chart.id, 'description')}
                onChartUpdate={handleFullChartUpdate(chart.id)}
                onDelete={() => handleDeleteChart(chart.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
        
        {/* New Chart Button - Circular Design */}
        <div className="bg-card p-6 flex flex-col items-center justify-center 
                    group space-y-3">
          <div
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center
                        group-hover:bg-primary/20 transition-colors"
            onClick={handleAddNewChart}
          >
            <AddIcon className="!w-8 !h-8 text-primary group-hover:text-primary-dark" />
          </div>
          <p className="text-muted-foreground group-hover:text-primary transition-colors text-center">
            Add New Chart
          </p>
        </div>
      </div>
    </div>
  );
}