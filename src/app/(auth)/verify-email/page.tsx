import { Suspense } from 'react';
import VerifyEmailPage from '@/components/auth/VerifyEmail'

export default function Page() {
  return (
    <Suspense>
      <VerifyEmailPage />
    </Suspense>
  );
}