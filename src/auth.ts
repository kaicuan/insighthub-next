// @/auth.ts

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from '@/auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getUserByEmail } from '@/lib/data';
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Credentials({
      id: "uqsso",
      name: "UQ SSO",
      credentials: {},
      async authorize(credentials, req) {
        const kvData = req.headers?.get("x-kvd-payload");
        if (!kvData) {
          throw new Error('UQ_AUTH_ERROR');
        }

        const payload = JSON.parse(kvData);
        
        if (
          payload.email.includes('__redacted__') ||
          payload.firstname.includes('__redacted__') ||
          payload.lastname.includes('__redacted__')
        ) {
          console.log(payload.email, payload.first_name, payload.last_name)
          throw new Error('MISSING_CONSENT');
        }

        return {
          id: payload.user,
          email: payload.email,
          first_name: payload.firstname,
          last_name: payload.lastname,
        };
      },
    }),
    Credentials({
      id: "insighthub",
      name: "InsightHub",
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUserByEmail(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password!.replace('bcrypt$', ''));
          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
});