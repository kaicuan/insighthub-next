import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SocialSigninButton from '@/components/auth/social-signin-button';
import { Suspense } from 'react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex md:pt-[10vh] pt-10 justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 p-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground">
            Let&apos;s get you started with <b>InsightHub</b>
          </p>
        </div>

        {/* Social Sign-in Buttons */}
        <Suspense>
          <SocialSigninButton />
        </Suspense>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-4 text-muted-foreground">
              Or
            </span>
          </div>
        </div>

        {/* Email Form */}
        <form action="register" method="get" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="bg-transparent"
            />
          </div>
          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>

        {/* Footer Links */}
        <div className="text-sm text-muted-foreground text-center">
          <p>
            Already have an account?{' '}
            <Link href="/signin" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}