import { ChartConfig } from "@/lib/definitions";
import { BarChart } from "@/components/BarChart";
import { LineChart } from "@/components/LineChart";

export default function Chart({
  data,
  config,
} : {
  data: any[];
  config: ChartConfig;
}) {
  return data.length > 0 ? (
    config.type === 'bar' ? (
      <BarChart
        className="h-64"
        data={data}
        index={config.index}
        categories={config.categories}
        xAxisLabel={config.x_axis_label || config.index}
        yAxisLabel={config.y_axis_label}
        layout={config.layout as 'horizontal' | 'vertical'}
        type={config.bar_type as any}
        legendPosition="left"
      />
    ) : (
      <LineChart
        className="h-64"
        data={data}
        index={config.index}
        categories={config.categories}
        xAxisLabel={config.x_axis_label || config.index}
        yAxisLabel={config.y_axis_label}
        legendPosition="left"
      />
    )
  ) : (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      No data available
    </div>
  );  
}