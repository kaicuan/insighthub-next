import { 
  Share2,
  Trash2,
  MoreVertical,
  SquarePen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DashboardSummary } from '@/lib/definitions';
import {ShareDrawerDialog} from '@/components/share-drawer-dialog';
import DeleteDialog from '@/components/workspace/delete-dialog';
import Link from 'next/link';

export default function CardDropdown({ dashboard }: { dashboard:DashboardSummary }) {
  if (!dashboard) {
    return null;
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <ShareDrawerDialog
          dashboardId={dashboard.id}
          dashboardTitle={dashboard.title}
          dashboardIsPublic={dashboard.is_public}
          isAuthor={false}
        >
          <DropdownMenuItem className="cursor-pointer">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </DropdownMenuItem>
        </ShareDrawerDialog>
        <Link href={`/dashboard/${dashboard.id}/edit`}>
          <DropdownMenuItem className="cursor-pointer">
            <SquarePen className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </Link>
        <DeleteDialog
          dashboardId={dashboard.id}
          dashboardTitle={dashboard.title}
        >
          <DropdownMenuItem className="cursor-pointer text-destructive">
            <Trash2 className="text-destructive mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}