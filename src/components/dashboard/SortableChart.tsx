'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  RiBarChartFill as BarChartIcon,
  RiCloseLine as CloseIcon,
  RiDraggable as DragIndicatorIcon,
  RiEditLine as EditIcon
} from '@remixicon/react';
import { BarChart } from '@/components/BarChart';
import { LineChart } from '@/components/LineChart';
import { EditDashboard } from '@/types/dashboard';
import EditableField from '@/components/dashboard/EditableField';
import { ChartEditModal } from '@/components/dashboard/ChartEditModal';
import Button from '@/components/Button';

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
          icon={<CloseIcon />}
          variant="destructive"
          className="absolute -top-2 -right-2 p-1.5 rounded-full transition-colors z-10 w-6 h-6"
          onClick={() => onDelete()}
        />
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          aria-label="Drag to move"
          title="Drag to move"
          className="absolute bottom-2 right-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors"
        >
          <DragIndicatorIcon className="w-5 h-5" />
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
            <div 
              className="h-64 flex flex-col items-center justify-center bg-muted/20 rounded-lg 
                       cursor-pointer gap-2"
              onClick={() => setShowEditModal(true)}
            >
              <BarChartIcon className="!w-8 !h-8 text-muted-foreground" />
              <span className="text-muted-foreground text-sm text-center">
                Click to configure chart
              </span>
            </div>
          ) : (
            <>
              <Button
                title="Edit chart"
                icon={<EditIcon />}
                variant="ghost"
                className="absolute top-0 right-0 p-1.5 rounded-full hover:bg-accent transition-colors z-10"
                onClick={() => setShowEditModal(true)}
              />
              {chart.config.type === 'bar' ? (
                <BarChart
                className="h-64"
                data={chart.data}
                index={chart.config.index}
                categories={chart.config.categories}
                valueFormatter={(value: number) => new Intl.NumberFormat().format(value)}
                onValueChange={(v) => console.log(v)}
                xAxisLabel={chart.config.x_axis_label}
                yAxisLabel={chart.config.y_axis_label}
                layout={chart.config.layout as 'horizontal' | 'vertical'}
                type={chart.config.bar_type as any}
                legendPosition='left'
              />
              ) : (
                <LineChart
                className="h-64"
                data={chart.data}
                index={chart.config.index}
                categories={chart.config.categories}
                valueFormatter={(value: number) => new Intl.NumberFormat().format(value)}
                onValueChange={(v) => console.log(v)}
                xAxisLabel={chart.config.x_axis_label}
                yAxisLabel={chart.config.y_axis_label}
                legendPosition='left'
              />
              )}
            </>
          )}
        </div>
      </div>

      <ChartEditModal
        chart={chart}
        dataset={dataset}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={onChartUpdate}
      />
    </>
  );
};