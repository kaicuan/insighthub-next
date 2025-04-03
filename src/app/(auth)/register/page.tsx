'use client'

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiArrowLeftSLine as BackArrow} from '@remixicon/react'
import Button from '@/components/Button';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const emailParam = searchParams.get('email')?.toString()
    if (emailParam) {
      setEmail(emailParam)
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real implementation, validate email format here
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  };  

  return (
    <div className="min-h-screen flex pt-28 justify-center bg-background">
      <div className="w-full max-w-sm items-center p-6 space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/signup" className="text-primary hover:opacity-80">
            <BackArrow className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-bold">Create Your Account</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">First Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-transparent border 
                          rounded-lg focus:outline-none focus:ring-2 
                          focus:ring-ring"
                placeholder="John"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Last Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 bg-transparent border 
                          rounded-lg focus:outline-none focus:ring-2 
                          focus:ring-ring"
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Email (Prefilled) */}
          <div>
            <label className="text-sm font-medium mb-2 block">Email</label>
            <input
              type="email"
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border 
                          rounded-lg focus:outline-none focus:ring-2 
                          focus:ring-ring"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Fields */}
          <div className="space-y-4">
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
            <div>
              <label className="text-sm font-medium mb-2 block">Re-enter Password</label>
              <input
                type="password"
                required
                className="w-full px-3 py-2 bg-transparent border 
                          rounded-lg focus:outline-none focus:ring-2 
                          focus:ring-ring"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" variant="primary" className="w-full">
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}