// @/components/UserMenu.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LogOut,
  ChevronsUpDown,
  SunMoon,
  ChevronRight
} from 'lucide-react';
import { auth, signOut } from '@/auth';
import { getUserById } from '@/lib/data';
import { Suspense } from 'react';
import ThemeToggle from '@/components/theme-toggle';
import ImageWithFallback from '@/components/ui/image-with-fallback';

export default async function UserMenu() {
  let user;
  const session = await auth();
  const userId = session?.user?.id;
  if (userId) {
    user = await getUserById(userId!)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className='focus:outline-none'>
        <div className='flex items-center space-x-2 p-2 rounded-full max-w-54 hover:bg-muted transition-colors'>
          {/* Avatar */}
          <Avatar className='flex-shrink-0'>
            {user?.profile_image ? (
              <Suspense fallback={<AvatarFallback className='rounded-lg'>{user?.first_name?.charAt(0)}</AvatarFallback>}>
                <ImageWithFallback
                  src={
                    user.profile_image.startsWith('http')
                      ? user.profile_image
                      : `/${user.profile_image}`
                  }
                  alt={`Profile image of ${user?.first_name}`}
                  fill={true}
                />
              </Suspense>
            ) : (
              <AvatarFallback className='rounded-lg'>{user?.first_name?.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <span className='hidden md:block flex-1 min-w-0 font-semibold truncate'>
            {user?.first_name} {user?.last_name?.charAt(0)}{user?.last_name ? '.' : ''}
          </span>
          <ChevronsUpDown className='flex-shrink-0 w-4 h-4 transition-transform' />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='w-56 rounded-lg'
        side='bottom'
        align='end'
        sideOffset={4}
      >
        <DropdownMenuLabel className='p-0 font-normal'>
          <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
            <Avatar className='h-8 w-8 rounded-lg'>
              {user?.profile_image ? (
                <Suspense fallback={<AvatarFallback className='rounded-lg'>{user?.first_name?.charAt(0)}</AvatarFallback>}>
                  <ImageWithFallback
                    src={
                      user.profile_image.startsWith('http')
                        ? user.profile_image
                        : `/${user.profile_image}`
                    }
                    alt={`Profile image of ${user?.first_name}`}
                    fill={true}
                  />
                </Suspense>
              ) : (
                <AvatarFallback className='rounded-lg'>{user?.first_name?.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div className='flex-1 overflow-hidden'>
              <span className='truncate font-semibold block'>
                {user?.first_name} {user?.last_name}
              </span>
              <span className='truncate text-xs block'>
                {user?.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem >
            <SunMoon />
            <span>Theme</span>
            <DropdownMenuShortcut>
              <ThemeToggle />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator className='px-1 mx-1'/>
          <form
            action={async () => {
              "use server"
              await signOut();
            }}
          >
            <button type='submit' className='w-full'>
              <DropdownMenuItem>
                <LogOut className='text-destructive' />
                <span className='text-destructive'>Sign Out</span>
                <DropdownMenuShortcut>
                  <ChevronRight className='text-destructive'/>
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}