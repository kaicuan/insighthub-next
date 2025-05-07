// @/auth.config.ts

import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnWorkspace = nextUrl.pathname.startsWith('/workspace');
      if (isOnWorkspace) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/insighthub/workspace', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;