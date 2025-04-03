'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import GoogleLogo from '@/assets/icons/google_logo'
import UQLogo from '@/assets/icons/uq_logo';
import Button from '@/components/Button';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/register?email=${encodeURIComponent(email)}`);
  };  
  
  return (
    <div className="min-h-screen flex pt-28 justify-center bg-background">
      <div className="w-full max-w-sm items-center p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Let&apos;s get you started with InsightHub
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

        {/* Email Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border 
                        rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
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