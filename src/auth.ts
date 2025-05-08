// @/auth.ts

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from '@/auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getUser } from '@/lib/data';
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password.replace('bcrypt$', ''));
          if (passwordsMatch) return user;
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});