'use client';

import {
  RiLockLine as LockIcon,
  RiGlobalLine as PublicIcon,
  RiShareLine as ShareIcon,
  RiBarChartFill as ChartIcon,
  RiRefreshLine as UpdateIcon,
  RiArrowLeftSLine as ArrowBackIcon,
  RiEditLine as EditIcon
} from '@remixicon/react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { ViewDashboard } from '@/types/dashboard';
import Button from '@/components/Button';
import ShareModal from '@/components/ShareModal';
import { useState } from 'react';
import { BarChart } from '@/components/BarChart';
import { LineChart } from '@/components/LineChart';

interface DashboardPageProps {
  dashboard: ViewDashboard;
}

export default function DashboardPage({ dashboard }: DashboardPageProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [is_public, setIsPublic] = useState(dashboard.is_public);
  
  return (
    <div className="max-w-7xl pb-10 mx-auto px-4 xs:px-6 sm:px-10 lg:px-24">
      {/* Navigation Section */}
      <div className="flex justify-between items-center mt-4 md:mb-4 border-border">
        <Link href="/workspace" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors hover:underline">
          <ArrowBackIcon className="w-5 h-5" />
          <span className="hidden sm:block">Back to Workspaces</span>
        </Link>

        <div className='flex gap-2'>
          <Button
            icon={<ShareIcon />}
            variant="ghost"
            onClick={() => setShowShareModal(true)}
          >
            Share
          </Button>
          <Link href={`/dashboard/${dashboard.id}/edit`}>
            <Button
              icon={<EditIcon />}
              variant="ghost"
            >
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-card mb-8 px-6 py-4 border-b">
          <div className="text-center md:text-left">
            {/* Dashboard Title */}
            <h1 className="text-2xl sm:text-3xl font-bold lg:max-w-4/5 mb-2">
            {dashboard.title}&nbsp;
              <span 
                className={`inline-flex px-2 py-1 text-xs font-normal rounded-full flex items-center gap-1 
                  ${dashboard.is_public 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted text-muted-foreground'}`}>
                {dashboard.is_public ? (
                    <PublicIcon className="w-4 h-4 text-primary" />
                ) : (
                    <LockIcon className="w-4 h-4" />
                )}
                <span className="hidden sm:block">
                    {dashboard.is_public ? 'Public' : 'Private'}
                </span>
              </span>
            </h1>
            {/* Dashbord Description */}
            <p className="text-muted-foreground">
              {dashboard.description}
            </p>
            {/* Author */}
            <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
            {dashboard.user.profile_image ? (
              <Image
                src={dashboard.user.profile_image}
                alt={`${dashboard.user.first_name} ${dashboard.user.last_name}`}
                width={32}
                height={32}
                className="rounded-full border border-border object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-secondary-foreground font-medium">
                  {dashboard.user.first_name[0]}{dashboard.user.last_name[0]}
                </span>
              </div>
            )}
              <span className="text-sm text-muted-foreground">
                {dashboard.user.first_name} {dashboard.user.last_name}
              </span>
            </div>
            {/* Metada */}
            <div className="flex gap-4 mt-4 items-center justify-center md:justify-start">
              <span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                <ChartIcon className="w-4 h-4" />
                {dashboard.charts.length} chart{dashboard.charts.length > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                <UpdateIcon className="w-4 h-4" />
                {formatDistanceToNow(new Date(dashboard.updated_at))} ago
              </span>
            </div>
          </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dashboard.charts.map((chart) => (
          <div 
            key={chart.id}
            className="bg-card p-4 rounded-lg border border-border hover:border-primary 
                      transition-transform hover:scale-[1.01] h-fit"
          >
            {/* Chart Header */}
            <div className="flex flex-col gap-2 mb-4 mx-2 text-justify">
              <div>
                <h3 className="font-semibold">{chart.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {chart.description || 'No description'}
                </p>
              </div>
            </div>

            {/* Chart */}
            {chart.config.type === 'bar' ? (
              <BarChart
                className="h-64"
                data={chart.data}
                index={chart.config.index}
                categories={chart.config.categories}
                valueFormatter={(number: number) =>
                  `$${Intl.NumberFormat("us").format(number).toString()}`
                }
                startEndOnly={chart.config.start_end_only}
                onValueChange={(v) => console.log(v)}
                xAxisLabel={chart.config.x_axis_label}
                yAxisLabel={chart.config.y_axis_label}
                legendPosition='left'
              />
            ) : (
              <LineChart
                className="h-64"
                data={chart.data}
                index={chart.config.index}
                categories={chart.config.categories}
                valueFormatter={(number: number) =>
                  `$${Intl.NumberFormat("us").format(number).toString()}`
                }
                startEndOnly={chart.config.start_end_only}
                onValueChange={(v) => console.log(v)}
                xAxisLabel={chart.config.x_axis_label}
                yAxisLabel={chart.config.y_axis_label}
                legendPosition='left'
              />
            )}
          </div>
        ))}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        dashboardId={dashboard.id}
        is_public={is_public}
        onTogglePublic={(value) => {
          setIsPublic(value);
          // TODO: Add API call to update public status
        }}
        />
    </div>
  );
}