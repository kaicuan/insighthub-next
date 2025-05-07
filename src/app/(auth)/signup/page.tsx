import Link from 'next/link';
import GoogleLogo from '@/assets/icons/google_logo'
import UQLogo from '@/assets/icons/uq_logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex md:pt-[10vh] pt-10 justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 p-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-sm text-muted-foreground">
            Let&apos;s get you started with InsightHub
          </p>
        </div>

        {/* Social Sign-in Buttons */}
        <div className="space-y-4">
          <Button variant="default" className="w-full bg-[#3B78DC] hover:bg-[#3B78DC]/90 text-white">
            <GoogleLogo />
            Continue with Google
          </Button>
          <Button variant="default" className="w-full bg-[#51247a] hover:bg-[#51247a]/90 text-white">
            <UQLogo />
            Continue with UQ SSO
          </Button>
        </div>

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