
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

export type DashboardSummary = {
  id: string;
  dataset: string;
  title: string;
  is_public: boolean;
  preview_image: string;
  updated_at: string;
  chart_count: number;
};