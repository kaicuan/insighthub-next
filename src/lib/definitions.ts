
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    first_name?: string;
    last_name?: string;
    password?: string;
    profile_image?: string;
  }
};

export interface Author {
  id: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  created_at: string;
}

export interface Dataset {
  filename: string;
  columns: string[];
  data: Record<string, any>[];
}

export interface ChartConfig {
  type: string;
  index: string;
  x_axis_label: string;
  start_end_only: boolean;
  categories: string[];
  y_axis_label: string;
  bar_type?: string;
  layout?: string;

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

export interface DashboardSummary {
  id: string;
  dataset: string;
  title: string;
  is_public: boolean;
  preview_image: string;
  updated_at: string;
  chart_count: number;
};

export interface Dashboard {
  id: string;
  title: string;
  description: string;
  is_public: boolean;
  updated_at: string;
  author: Author;
  charts: Chart[];
}

export interface EditDashboard extends Dashboard {
  dataset: Dataset;
}