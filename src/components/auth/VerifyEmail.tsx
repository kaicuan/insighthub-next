'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { RiArrowLeftSLine as BackArrow} from '@remixicon/react'
import Button from '@/components/Button';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    const emailParam = searchParams.get('email') || '';
    setEmail(decodeURIComponent(emailParam));
    
    // Redirect if no email provided
    if (!emailParam) router.push('/signup');
  }, [searchParams, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add verification logic here
    console.log('Verify code:', code);
    router.push('/workspace'); // Temporary redirect
  };

  return (
    <div className="min-h-screen flex md:pt-[10vh] justify-center bg-background">
      <div className="w-full max-w-sm p-6 space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/register" className="text-primary hover:opacity-80">
            <BackArrow className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
        </div>

        {/* Email Display */}
        <div className="bg-card p-4 rounded-lg text-center space-y-2">
          <p className="text-muted-foreground">
            We've sent a verification code to:
          </p>
          <p className="font-medium text-foreground">{email}</p>
        </div>

        {/* Verification Code Input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              6-Digit Verification Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border 
                        rounded-lg focus:outline-none focus:ring-2 
                        focus:ring-ring text-center"
              placeholder="••••••"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={code.length !== 6}
          >
            Verify Account
          </Button>
        </form>

        {/* Resend Code */}
        <div className="text-center text-muted-foreground text-sm flex justify-center items-center space-x-2">
          <p>Didn't receive the code?</p>
          <button className="text-primary hover:underline">
            Resend code
          </button>
        </div>
      </div>
    </div>
  );
}