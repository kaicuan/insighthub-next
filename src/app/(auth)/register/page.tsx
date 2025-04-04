import { Suspense } from 'react';
import RegisterPage from '@/components/auth/RegisterPage'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
}