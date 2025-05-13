// @/app/(auth)/register/page.tsx

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import RegisterForm from '@/components/auth/register-form';

export default async function RegisterPage(props: {
  searchParams?: Promise<{
      email?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email || '';

  return (
    <div className="min-h-screen flex md:pt-[10vh] justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/signup" className="text-primary hover:opacity-80">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-bold">Create Your Account</h1>
        </div>

        <RegisterForm email={email} />
      </div>
    </div>
  );
}
