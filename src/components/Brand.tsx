import { auth } from '@/auth';
import Link from 'next/link';

export default async function Brand() {
  const session = await auth();
  const user = session?.user;

  return (
    <Link href={user ? "/workspace" : "/"}>
      <div className="flex items-center">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-bold">IH</span>
        </div>
        <span className="ml-2 text-lg font-semibold">
          InsightHub
        </span>
      </div>
    </Link>
  );
}