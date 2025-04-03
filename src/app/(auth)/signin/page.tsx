import Link from 'next/link';
import GoogleLogo from '@/assets/icons/google_logo'
import UQLogo from '@/assets/icons/uq_logo';
import Button from '@/components/Button';

export default function SigninPage() {
  return (
    <div className="min-h-screen flex pt-28 justify-center bg-background">
      <div className="w-full max-w-sm items-center p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to continue to InsightHub
          </p>
        </div>

        {/* Social Signin Buttons */}
        <div className="space-y-4">
          <Button variant="primary" icon={<GoogleLogo />} className="w-full bg-[#3B78DC] hover:bg-[#3B78DC]/90 !text-white">
            Continue with Google
          </Button>
          <Button variant="primary" icon={<UQLogo />} className="w-full bg-[#51247a] hover:bg-[#51247a]/90 !text-white">
            Continue with UQ SSO
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-4 text-muted-foreground">
              Or
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 bg-transparent border 
                        rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 bg-transparent border 
                        rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-ring"
              placeholder="••••••••"
            />
          </div>

          <Link href="/workspace">
            <Button type="submit" variant="primary" className="w-full">
              Sign in
            </Button>
          </Link>
        </form>

        {/* Footer Links */}
        <div className="text-sm text-muted-foreground text-center space-y-2">
          <p>
            <Link href="/forgot-password" className="hover:text-primary">
              Forgot password?
            </Link>
          </p>
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}