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
      if (isOnWorkspace) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/insighthub/workspace', nextUrl));
      }
      return true;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const existingUser = await getUserByProvAccID(account.providerAccountId!, 'google');
          if (!existingUser) {
            await sql`
              INSERT INTO api_user 
                (first_name, last_name, email, password, provider, provideraccountid, profile_image, is_superuser, is_staff, is_active, date_joined)
              VALUES 
                (${profile?.given_name || ''}, 
                 ${profile?.family_name || ''}, 
                 ${profile?.email! || ''}, 
                 'google',
                 'google',
                 ${account?.providerAccountId || ''},
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