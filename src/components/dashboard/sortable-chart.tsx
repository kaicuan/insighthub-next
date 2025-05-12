'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditDashboard } from '@/lib/definitions'
import EditableField from '@/components/dashboard/editable-field';
import { Button } from '@/components/ui/button';
import { ChartColumn, GripVertical, SquarePen, X } from 'lucide-react';
import { ChartEditDrawerDialog } from '@/components/dashboard/chart-edit-drawer-dialog';
import Chart from '@/components/dashboard/chart';

interface SortableChartProps {
  chart: EditDashboard['charts'][0];
  dataset: EditDashboard['dataset'];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onChartUpdate: (updatedChart: EditDashboard['charts'][0]) => void;
  onDelete: () => void;
}

export const SortableChart = ({ 
  chart,
  dataset,
  onTitleChange,
  onDescriptionChange,
  onChartUpdate,
  onDelete,
}: SortableChartProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chart.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEmptyChart = chart.data.length === 0;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="bg-card p-4 rounded-lg border border-border relative group hover:border-primary hover:scale-[1.01] transition-colors h-fit"
      >
        {/* Delete */}
        <Button
          title="Delete chart"
          variant="destructive"
          className="absolute -top-2 -right-2 p-1.5 rounded-full transition-colors z-10 w-6 h-6"
          onClick={() => onDelete()}
        >
          <X className="h-4 w-4" />
        </Button>
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          aria-label="Drag to move"
          title="Drag to move"
          className="absolute bottom-2 right-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Chart Header */}
        <div className="flex flex-col gap-2 mb-4 mr-6 ml-2 text-justify">
          <EditableField
            value={chart.title}
            placeholder="Untitled Chart"
            className="font-semibold px-1 -mx-1"
            onBlur={onTitleChange}
            onChange={onTitleChange}
            ariaLabel="Chart title"
          />
          
          <EditableField
            value={chart.description}
            placeholder="Add chart description..."
            className="text-xs text-muted-foreground px-1 -mx-1"
            onBlur={onDescriptionChange}
            onChange={onDescriptionChange}
            ariaLabel="Chart description"
          />
        </div>

        {/* Chart Visualization */}
        <div className="relative">
          {isEmptyChart ? (
            <ChartEditDrawerDialog
              chart={chart}
              dataset={dataset}
              onSave={onChartUpdate}
            >
              <div className="h-64 flex flex-col items-center justify-center bg-muted/20 rounded-lg cursor-pointer gap-2">
                <ChartColumn className="w-8 h-8 text-muted-foreground" />
                <span className="text-muted-foreground text-sm text-center">
                  Click to configure chart
                </span>
              </div>
            </ChartEditDrawerDialog>
          ) : (
            <>
              <ChartEditDrawerDialog
                chart={chart}
                dataset={dataset}
                onSave={onChartUpdate}
              >
                <Button
                  title="Edit chart"
                  variant="ghost"
                  className="absolute top-0 right-0 p-1.5 rounded-full hover:bg-accent transition-colors z-10"
                >
                  <SquarePen className="h-4 w-4" />
                </Button>
              </ChartEditDrawerDialog>
              <Chart data={chart.data} config={chart.config} />
            </>
          )}
        </div>
      </div>
    </>
  );
};