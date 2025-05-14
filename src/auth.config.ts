// @/auth.config.ts

import type { NextAuthConfig } from 'next-auth';
import { getUserByProvAccID } from '@/lib/data';
import sql from '@/lib/db';
 
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export const authConfig = {
  basePath: `${basePath}/api/auth`,
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnWorkspace = nextUrl.pathname.startsWith('/workspace');
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isEditPath = nextUrl.pathname.endsWith('/edit')

      if (isOnWorkspace || (isOnDashboard && isEditPath)) return isLoggedIn;
      
      const sitePages = ['/signin', '/signup', '/register'];
      if (isLoggedIn && sitePages.includes(nextUrl.pathname)) {
        const callbackUrl = nextUrl.searchParams.get('callbackUrl');
        return Response.redirect(
          new URL(callbackUrl || basePath + '/workspace', nextUrl)
        );
      }

      return true;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'insighthub') return true;
      else if (account?.provider) {
        try {
          const existingUser = await getUserByProvAccID(
            account?.providerAccountId || user.id, account?.provider
          );
          if (!existingUser) {
            await sql`
              INSERT INTO api_user 
                (first_name, last_name, email, password, provider, provideraccountid, profile_image, is_superuser, is_staff, is_active, date_joined)
              VALUES 
                (${profile?.given_name || user.first_name || ''}, 
                 ${profile?.family_name || user.last_name || ''}, 
                 ${profile?.email || user.email || ''}, 
                 ${account?.provider},
                 ${account?.provider},
                 ${account?.providerAccountId || user.id || ''},
                 ${profile?.picture || ''},
                 false, false, true, NOW())
            `;
          }
          return true;
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      return false
    },
    async jwt({ token, user, account}) {
      if (account?.provider && account?.provider != 'insighthub') {
        const appuser = await getUserByProvAccID(account.providerAccountId, account.provider);
        token.userId = appuser!.id;
      } else if (user) {
          token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user = { id: token.userId } as any;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;