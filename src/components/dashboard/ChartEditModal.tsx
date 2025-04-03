'use client';

import { useState, useEffect } from 'react';
import {
  RiArrowDownSLine as ArrowDownIcon,
  RiSave2Fill as SaveIcon, 
} from '@remixicon/react';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { EditChart, EditChartConfig, Dataset } from '@/types/dashboard';
import { BarChart } from '@/components/BarChart';
import { LineChart } from '@/components/LineChart';

interface ChartEditModalProps {
  chart: EditChart;
  dataset: Dataset;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedChart: EditChart) => void;
}

export const ChartEditModal = ({ 
  chart: initialData,
  dataset,
  isOpen,
  onClose,
  onSave
}: ChartEditModalProps) => {
  const [formData, setFormData] = useState(initialData);
  const [previewData, setPreviewData] = useState(initialData.data);
  const [showAdvanced, setShowAdvanced] = useState(true);

  const numericColumns = dataset.columns.filter(col => 
    dataset.data.some(row => typeof row[col] === 'number')
  );

  useEffect(() => {
    setFormData(initialData);
    setPreviewData(initialData.data);
  }, [initialData]);

  const processChartData = (config: EditChartConfig) => {
    if (!config.x_axis || !config.y_axis) return [];

    const groupAndAggregate = (rows: any[], groupBy: string[], aggColumn: string) => {
      const groups = new Map<string, number[]>();
      rows.forEach(row => {
        const key = groupBy.map(col => row[col]).join('|');
        groups.has(key) ? groups.get(key)!.push(row[aggColumn]) : groups.set(key, [row[aggColumn]]);
      });
      
      return Array.from(groups.entries()).map(([key, values]) => ({
        ...Object.fromEntries(groupBy.map((col, i) => [col, key.split('|')[i]])),
        [aggColumn]: aggregate(values, config.aggregation)
      }));
    };

    const aggregate = (values: number[], method: string) => {
      switch (method) {
        case 'sum': return values.reduce((a, b) => a + b, 0);
        case 'average': return values.reduce((a, b) => a + b, 0) / values.length;
        case 'count': return values.length;
        default: return values[0];
      }
    };

    if (config.series) {
      return groupAndAggregate(dataset.data, [config.x_axis, config.series], config.y_axis)
        .reduce((acc: Record<string, any>[], row) => {
          const xVal = row[config.x_axis];
          const existing = acc.find(item => item[config.x_axis] === xVal);
          existing 
            ? existing[row[config.series!]] = row[config.y_axis]
            : acc.push({ [config.x_axis]: xVal, [row[config.series!]]: row[config.y_axis] });
          return acc;
        }, []);
    }

    return groupAndAggregate(dataset.data, [config.x_axis], config.y_axis);
  };

  const updateConfig = (field: keyof EditChartConfig, value: any) => {
    const newConfig = { ...formData.config, [field]: value };
    const processedData = processChartData(newConfig);
    
    setFormData(prev => ({ ...prev, config: newConfig, data: processedData }));
    setPreviewData(processedData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const inputClasses = "w-full px-3 py-2 border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary";
  const categories = formData.config.series
    ? Array.from(new Set(dataset.data.map(row => row[formData.config.series!])))
    : [formData.config.y_axis];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configure Chart" className="sm:max-w-4xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-1">
        
        {/* Configuration Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Chart Type
              </label>
              <select
                value={formData.config.type}
                onChange={(e) => updateConfig('type', e.target.value)}
                className={inputClasses}
              >
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                X-Axis
              </label>
              <select
                value={formData.config.x_axis}
                onChange={(e) => updateConfig('x_axis', e.target.value)}
                className={inputClasses}
              >
                <option value="">Select column</option>
                {dataset.columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Y-Axis
              </label>
              <select
                value={formData.config.y_axis}
                onChange={(e) => updateConfig('y_axis', e.target.value)}
                className={inputClasses}
              >
                <option value="">Select column</option>
                {numericColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                X-Axis Label
              </label>
              <input
                type="text"
                value={formData.config.x_axis_label}
                onChange={(e) => updateConfig('x_axis_label', e.target.value)}
                className={inputClasses}
                placeholder={formData.config.x_axis}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Y-Axis Label
              </label>
              <input
                type="text"
                value={formData.config.y_axis_label}
                onChange={(e) => updateConfig('y_axis_label', e.target.value)}
                className={inputClasses}
                placeholder={formData.config.y_axis}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
  <button
    type="button"
    onClick={() => setShowAdvanced(!showAdvanced)}
    className="w-full flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors border-b"
  >
    <span>Advanced Properties</span>
    <ArrowDownIcon className={`w-5 h-5 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
  </button>
  
  {showAdvanced && (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            Series Grouping
          </label>
          <select
            value={formData.config.series || ''}
            onChange={(e) => updateConfig('series', e.target.value || null)}
            className={inputClasses}
          >
            <option value="">None (Single Series)</option>
            {dataset.columns.filter(c => c !== formData.config.x_axis).map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-foreground">
            Aggregation
          </label>
          <select
            value={formData.config.aggregation}
            onChange={(e) => updateConfig('aggregation', e.target.value)}
            className={inputClasses}
          >
            <option value="none">None</option>
            <option value="sum">Sum</option>
            <option value="average">Average</option>
            <option value="count">Count</option>
          </select>
        </div>
      </div>

      {formData.config.type === 'bar' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Bar Style
            </label>
            <select
              value={formData.config.bar_type}
              onChange={(e) => updateConfig('bar_type', e.target.value)}
              className={inputClasses}
            >
              <option value="default">Default</option>
              <option value="stacked">Stacked</option>
              <option value="percent">Percent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Orientation
            </label>
            <select
              value={formData.config.layout}
              onChange={(e) => updateConfig('layout', e.target.value)}
              className={inputClasses}
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )}
</div>
        </div>

        {/* Preview Section */}
        <div className="border rounded-lg p-4 h-fit self-center sm:mb-5 bg-muted/5">
          {previewData.length > 0 ? (
            formData.config.type === 'bar' ? (
              <BarChart
                className="h-64"
                data={previewData}
                index={formData.config.x_axis}
                categories={categories}
                valueFormatter={(value: number) => new Intl.NumberFormat().format(value)}
                onValueChange={(v) => console.log(v)}
                xAxisLabel={formData.config.x_axis_label || formData.config.x_axis}
                yAxisLabel={formData.config.y_axis_label || formData.config.y_axis}
                layout={formData.config.layout as 'horizontal' | 'vertical'}
                type={formData.config.bar_type as any}
                legendPosition='left'
              />
            ) : (
              <LineChart
                className="h-64"
                data={previewData}
                index={formData.config.x_axis}
                categories={categories}
                valueFormatter={(value: number) => new Intl.NumberFormat().format(value)}
                onValueChange={(v) => console.log(v)}
                xAxisLabel={formData.config.x_axis_label || formData.config.x_axis}
                yAxisLabel={formData.config.y_axis_label || formData.config.y_axis}
                legendPosition='left'
              />
            )
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              {dataset.data.length === 0 ? 'No data available' : 'Invalid configuration'}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sm:col-span-2 flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button icon={<SaveIcon />} type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};