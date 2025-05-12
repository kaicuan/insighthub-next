'use client';

import { useState, useRef, useId, useEffect, useActionState } from 'react';
import{ Button } from '@/components/ui/button';
import EditableField from '@/components/dashboard/editable-field';
import { SortableChart } from '@/components/dashboard/sortable-chart';
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
import { EditDashboard } from '@/lib/definitions';
import { Plus, SaveAll } from 'lucide-react';
import CancelDialog from '@/components/dashboard/cancel-dialog';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { updateDashboard } from '@/lib/actions';

export default function DashboardEditPage({ dashboard }: { dashboard: EditDashboard }) {
  const [state, formAction, isPending] = useActionState(updateDashboard, null);
  const [dashboardState, setDashboardState] = useState<EditDashboard>(dashboard);
  const [deletedCharts, setDeletedCharts] = useState<string[]>([])
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (state?.message) {
      toast.error(state.message)
    }
  }, [state])

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
    setDeletedCharts(prev => [...prev, chartId]);
  };

  const handleSubmit = (formData: FormData) => {
    formData.append('id', dashboard.id);
    formData.append('title', dashboardState.title);
    formData.append('description', dashboardState.description || '');
    formData.append('charts', JSON.stringify(dashboardState.charts));
    formData.append('deletedCharts', JSON.stringify(deletedCharts));
    return formAction(formData);
  };

  const handleAddNewChart = () => {
    const newChart = {
      id: uuidv4(),
      title: '',
      description: '',
      data: [],
      config: {
        type: 'bar',
        x_axis: '',
        y_axis: '',
        series: null,
        aggregation: 'sum',
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
      <div className="flex justify-end items-center mt-4 md:mb-4 border-border">
        <div className='flex gap-2'>
          <CancelDialog dashboardId={dashboard.id}>
            <Button variant="ghost">
              Cancel
            </Button>
          </CancelDialog>
          <form action={handleSubmit}>
            <Button 
              type="submit" 
              disabled={isPending}
              aria-disabled={isPending}
            >
              <SaveAll className="h-4 w-4" />
              {isPending ? (
                <span className="animate-pulse">Saving ...</span>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </div>
      </div>

      <div className="bg-background mb-8 px-6 py-4 border-b">
        {/* Hero Section */}
        <div className="text-center md:text-left">
          {state?.errors?.title && (
            <p className="text-red-500 text-sm">{state.errors.title[0]}</p>
          )}
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
        
        <div className="p-6 flex flex-col items-center justify-center space-y-3">
          <div
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            onClick={handleAddNewChart}
          >
            <Plus className="w-8 h-8" />
          </div>
          <p className="text-muted-foreground group-hover:text-primary transition-colors text-center">
            Add New Chart
          </p>
        </div>
      </div>
    </div>
  );
}