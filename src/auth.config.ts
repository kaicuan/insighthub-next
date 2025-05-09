// @/auth.config.ts

import type { NextAuthConfig } from 'next-auth';
import { getUser, getUserByProvAccID } from '@/lib/data';
import sql from '@/lib/db';
 
const basePath = process.env.BASE_PATH ?? ''

export const authConfig = {
  basePath: `${basePath}/api/auth`,
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnWorkspace = nextUrl.pathname.startsWith('/workspace');

      if (isOnWorkspace) return isLoggedIn;
      
      const sitePages = ['/signin', '/signup', '/register'];
      if (isLoggedIn && sitePages.includes(nextUrl.pathname)) {
        return Response.redirect(new URL(basePath + '/workspace', nextUrl));
      }

      return true;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'insighthub') return true;
      try {
        const existingUser = await getUserByProvAccID(
          account?.providerAccountId || user.id, account?.provider!
        );
        if (!existingUser) {
          await sql`
            INSERT INTO api_user 
              (first_name, last_name, email, password, provider, provideraccountid, profile_image, is_superuser, is_staff, is_active, date_joined)
            VALUES 
              (${profile?.given_name || user.first_name || ''}, 
               ${profile?.family_name || user.last_name || ''}, 
               ${profile?.email! || user.email || ''}, 
               ${account?.provider!},
               ${account?.provider!},
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
      if (account?.provider === 'google') {
      }
      return true;
    },
    async jwt({ token, user, account}) {
      if (account?.provider === 'google') {
        const appuser = await getUserByProvAccID(account.providerAccountId!, 'google');
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