// @/components/navbar/navbar.tsx
import { auth } from '@/auth';
import Brand from '@/components/Brand';
import UserMenu from '@/components/navbar/user-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4 sm:space-x-0">
            <Brand />
          </div>
          {user ? (
            <UserMenu />
          ) : (
            <Link href={"/signin"}>
              <Button>
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}