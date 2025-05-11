export interface Author {
    first_name: string;
    last_name: string;
    profile_image: string | null;
}

export interface Dataset {
    filename: string;
    columns: string[];
    data: Record<string, any>[];
}

export interface DashboardSummary {
    id: string;
    dataset: string;
    title: string;
    is_public: boolean;
    preview_image: string;
    updated_at: string;
    chart_count: number;
}

interface ChartConfig {
    type: string;
    index: string;
    x_axis_label: string;
    start_end_only: boolean;
    categories: string[];
    y_axis_label: string;
    bar_type?: string;
    layout?: string;
}

export interface EditChartConfig extends ChartConfig {
    x_axis: string;
    y_axis: string;
    series: string | null;
    aggregation: string;
}

export interface Chart {
    id: string;
    title: string;
    description: string;
    data: Record<string, number | string>[];
    config: ChartConfig;
}

export interface EditChart {
    id: string;
    title: string;
    description: string;
    data: Record<string, number | string>[];
    config: EditChartConfig;
}

interface BaseDashboard {
    id: string;
    title: string;
    description: string;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface ViewDashboard extends BaseDashboard {
    user: Author;
    charts: Chart[];
}

export interface EditDashboard extends BaseDashboard {
    dataset: Dataset;
    charts: EditChart[];
}