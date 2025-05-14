// @/components/auth/social-signin-button.tsx
"use client"

import GoogleLogo from '@/assets/icons/google_logo'
import UQLogo from '@/assets/icons/uq_logo';
import { Button } from '@/components/ui/button';
import { signIn } from '@/auth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { googleauth } from '@/lib/actions';

export default function SocialSigninButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl')
  const callbackUrlParam = callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""

  return (
    <div className="space-y-4">
      <form action={googleauth}>
        <Button variant="default" className="w-full bg-[#3B78DC] hover:bg-[#3B78DC]/90 text-white">
          <GoogleLogo />
          Continue with Google
        </Button>
      </form>
      <Link href={"api/auth/uq-callback" + callbackUrlParam} prefetch={false}>
        <Button type="submit" variant="default" className="w-full bg-[#51247a] hover:bg-[#51247a]/90 text-white">
          <UQLogo />
          Continue with UQ SSO
        </Button>
      </Link>
    </div>
  );
}