// @/lib/actions.ts
'use server'

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from 'bcrypt';
import sql from "@/lib/db";


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function register(
  prevState: { message?: string; errors?: Record<string, string[]> } | undefined,
  formData: FormData,
) {
  const schema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, email, password } = parsed.data;

  try {
    const existingUser = await sql`SELECT * FROM api_user WHERE email = ${email}`;
    if (existingUser.length > 0) {
      return { errors: { email: ['This email is already registered'] } };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await sql`
      INSERT INTO api_user (first_name,last_name,email,password,is_superuser,is_staff,is_active,date_joined)
      VALUES (${firstName},${lastName},${email},${hashedPassword},false,false,true,now()
      )
    `;

    redirect('/signin');
  } catch (error) {
    console.error('Registration failed:', error);
    return { message: 'Registration failed. Please try again.' };
  }
}