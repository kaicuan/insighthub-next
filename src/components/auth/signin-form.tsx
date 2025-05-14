'use client';

import { useActionState, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authenticate } from '@/lib/actions';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export default function SigninForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || basePath + '/workspace';
  const [email, setEmail] = useState('');
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="bg-transparent"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="bg-transparent"
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
        aria-disabled={isPending}
      >
        {isPending ? (
          <span className="animate-pulse">Signing in...</span>
        ) : (
          <>
            Sign In
          </>
        )}
      </Button>
    </form>
  );
}