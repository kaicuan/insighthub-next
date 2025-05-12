'use client';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChevronDown, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Chart, ChartConfig, Dataset } from '@/lib/definitions';
import ChartRenderer from '@/components/dashboard/chart';

export const ChartEditDrawerDialog = ({
  chart: initialData,
  dataset,
  onSave,
  children,
}: {
  chart: Chart;
  dataset: Dataset;
  onSave: (updatedChart: Chart) => void;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = useState(initialData);
  const [previewData, setPreviewData] = useState(initialData.data);
  const [showAdvanced, setShowAdvanced] = useState(true);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const inputClasses = 'w-full px-3 py-2 border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary';

  useEffect(() => {
    setFormData(initialData);
    setPreviewData(initialData.data);
  }, [initialData]);

  const numericColumns = dataset.columns.filter((col) =>
    dataset.data.some((row) => typeof row[col] === 'number')
  );

  const processChartData = (config: ChartConfig) => {
    if (!config.x_axis || !config.y_axis) return { data: [], index: '', categories: [] };

    const aggregate = (values: number[]) => {
      switch (config.aggregation) {
        case 'sum':     return values.reduce((a, b) => a + b, 0);
        case 'average': return values.reduce((a, b) => a + b, 0) / values.length;
        case 'count':   return values.length;
        default:        return values[0];
      }
    };

    const raw = (() => {
      const map = new Map<string, number[]>();
      const keyCols = config.series ? [config.x_axis, config.series] : [config.x_axis];
      dataset.data.forEach(row => {
        const key = keyCols.map(c => row[c]).join('|');
        const arr = map.get(key) ?? [];
        arr.push(row[config.y_axis]);
        map.set(key, arr);
      });
      return Array.from(map.entries()).map(([key, vals]) => {
        const cells = key.split('|');
        const base: any = { [config.x_axis]: cells[0] };
        if (config.series) base[cells[1]] = aggregate(vals);
        else              base[config.y_axis] = aggregate(vals);
        return base;
      });
    })();

    const data = config.series
      ? raw.reduce((acc: any[], row) => {
          const x = row[config.x_axis];
          let bucket = acc.find(d => d[config.x_axis] === x);
          if (!bucket) { bucket = { [config.x_axis]: x }; acc.push(bucket); }
          bucket[ Object.keys(row).filter(k => k !== config.x_axis)[0] ] =
            row[ Object.keys(row).filter(k => k !== config.x_axis)[0] ];
          return acc;
        }, [])
      : raw;

    const index = config.x_axis;
    const categories = data.length > 0
      ? Object.keys(data[0]).filter(k => k !== index)
      : [];
    return { data, index, categories };
  };

  const updateConfig = (field: keyof ChartConfig, value: any) => {
    const newConfig = { ...formData.config, [field]: value };
    const { data, index, categories } = processChartData(newConfig);
    setFormData(prev => ({
      ...prev,
      config: { ...newConfig, index, categories },
      data,
    }));
    setPreviewData(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setOpen(false);
  };

  const renderFormContent = () => (
    <>
      <div className="space-y-4">
        {/* Configuration Section */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Chart Type
            </label>
            <Select
              value={formData.config.type}
              onValueChange={(value) => updateConfig('type', value)}
            >
              <SelectTrigger className={inputClasses}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* X-Axis and Y-Axis Selects */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              X-Axis
            </label>
            <Select
              value={formData.config.x_axis}
              onValueChange={(value) => updateConfig('x_axis', value)}
            >
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {dataset.columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Y-Axis
            </label>
            <Select
              value={formData.config.y_axis}
              onValueChange={(value) => updateConfig('y_axis', value)}
            >
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Axis Labels */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              X-Axis Label
            </label>
            <Input
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
            <Input
              value={formData.config.y_axis_label}
              onChange={(e) => updateConfig('y_axis_label', e.target.value)}
              className={inputClasses}
              placeholder={formData.config.y_axis}
            />
          </div>
        </div>

        {/* Advanced Section Toggle */}
        <div className="sm:col-span-2">
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger className="w-full flex items-center justify-between py-2 text-sm font-medium text-foreground hover:text-primary transition-colors border-b">
              <span>Advanced Properties</span>
              <ChevronDown
                className={`w-5 h-5 transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">
                      Series Grouping
                    </label>
                    <Select
                      value={formData.config.series || ''}
                      onValueChange={(value) => updateConfig('series', value === 'none' ? null : value)}
                    >
                      <SelectTrigger className={inputClasses}>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {dataset.columns
                          .filter((c) => 
                            c !== formData.config.x_axis && 
                            c !== formData.config.y_axis
                          )
                          .map((col) => (
                            <SelectItem key={col} value={col}>
                              {col}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-foreground">
                      Aggregation
                    </label>
                    <Select
                      value={formData.config.aggregation}
                      onValueChange={(value) => updateConfig('aggregation', value)}
                    >
                      <SelectTrigger className={inputClasses}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sum">Sum</SelectItem>
                        <SelectItem value="average">Average</SelectItem>
                        <SelectItem value="count">Count</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.config.type === 'bar' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">
                        Bar Style
                      </label>
                      <Select
                        value={formData.config.bar_type}
                        onValueChange={(value) => updateConfig('bar_type', value)}
                      >
                        <SelectTrigger className={inputClasses}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="stacked">Stacked</SelectItem>
                          <SelectItem value="percent">Percent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-foreground">
                        Orientation
                      </label>
                      <Select
                        value={formData.config.layout}
                        onValueChange={(value) => updateConfig('layout', value)}
                      >
                        <SelectTrigger className={inputClasses}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="horizontal">Horizontal</SelectItem>
                          <SelectItem value="vertical">Vertical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      {/* Chart Preview */}
      <div className="bg-card border rounded-lg p-4 h-fit self-center sm:mb-5">
        <ChartRenderer data={previewData} config={formData.config} />
      </div>

      {/* Action Buttons */}
      <div className="sm:col-span-2 flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Configure Chart</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-1">
            {renderFormContent()}
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="pb-10 h-[80%] fixed inset-x-0 bottom-0 z-50 rounded-t-xl">
        <div className="mx-auto w-full max-w-4xl flex flex-col h-full">
          <DrawerHeader className="text-left">
            <DrawerTitle>Configure Chart</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
              {renderFormContent()}
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};