// @/app/consent-required/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function ConsentPage() {
  return (
    <div className="min-h-screen flex md:pt-[10vh] pt-10 justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 p-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Consent Required</h1>
          <p className="text-sm text-muted-foreground">
            To continue with <b>UQ SSO</b>, we need your consent
          </p>
        </div>
        
        {/* <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
        </div> */}

        {/* Consent Text */}
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            InsightHub requires access to the following information:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>UQ username</li>
            <li>Your full name</li>
            <li>Your e-mail address</li>
          </ul>
          <Image
            src={basePath + "/required-consent.png"}
            alt="Consent Requirements"
            width={2194}
            height={1095}
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            priority
          />
          <p className="pt-4">
            Click the button below to go back to the consent screen.
          </p>
        </div>

        {/* Consent Button */}
        <Button asChild className="w-full">
          <Link href="https://api.uqcloud.net/auth/consent/https://infs3202-83beb4f1.uqcloud.net/insighthub/api/auth/uq-callback">
            Grant Consent
          </Link>
        </Button>

        {/* Footer Links */}
        <div className="text-sm text-muted-foreground text-center">
          <p>
            Changed your mind?{' '}
            <Link 
              href="/signin" 
              className="text-primary font-medium hover:underline"
            >
              Return to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}