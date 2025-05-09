// @/components/auth/social-signin-button.tsx

import GoogleLogo from '@/assets/icons/google_logo'
import UQLogo from '@/assets/icons/uq_logo';
import { Button } from '@/components/ui/button';
import { signIn } from '@/auth';
import { redirect } from 'next/navigation';

export default function SocialSigninButton() {

  return (
    <div className="space-y-4">
      <form
        action={async () => {
          "use server"
          await signIn("google")
        }}
      >
        <Button variant="default" className="w-full bg-[#3B78DC] hover:bg-[#3B78DC]/90 text-white">
          <GoogleLogo />
          Continue with Google
        </Button>
      </form>
      <form
        action={async () => {
          "use server";
          redirect("/api/auth/uq-callback");
        }}
      >
        <Button variant="default" className="w-full bg-[#51247a] hover:bg-[#51247a]/90 text-white">
          <UQLogo />
          Continue with UQ SSO
        </Button>
      </form>
    </div>
  );
}