// @/lib/actions.ts
'use server'

import { auth, signIn } from "@/auth";
import { getUserByEmail, getUserById } from "@/lib/data";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from 'bcrypt';
import sql from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';
import Papa from 'papaparse';
import { revalidatePath } from "next/cache";


export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('insighthub', formData);
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
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { errors: { email: ['This email is already registered'] } };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await sql`
      INSERT INTO api_user
        (first_name,last_name,email,password,provider,is_superuser,is_staff,is_active,date_joined)
      VALUES (${firstName},${lastName},${email},${hashedPassword},'insighthub',false,false,true,now()
      )
    `;

  } catch (error) {
    console.error('Registration failed:', error);
    return { message: 'Registration failed. Please try again.' };
  }
  
  redirect('/signin');
}

export async function createDashboard(
  prevState: { message?: string; errors?: Record<string, string[]> } | undefined,
  formData: FormData,
) {
  // Auth validation
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "User not authenticated" };
  }
  const user = await getUserById(session.user.id);
  if (!user) {
    return { message: "User not found" };
  }

  // Form validation
  const schema = z.object({
    title: z.string()
      .min(1, 'Title is required')
      .max(51, 'Title must be less than 50 characters'),
    file: z.instanceof(File, { message: 'CSV file is required' })
      .refine(file => file.size > 0, 'File cannot be empty')
      .refine(file => file.size < 5 * 1024 * 1024, 'File must be less than 5MB')
      .refine(file => file.name.endsWith('.csv'), 'Invalid file type'),
  });
  const parsed = schema.safeParse({
    title: formData.get('title'),
    file: formData.get('file'),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }
  const { title, file } = parsed.data;

  let dashboardId = '';
  try {
    // Parse CSV file
    const csvText = await file.text();
    const { data, meta } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (!meta.fields || meta.fields.length === 0) {
      return { message: 'CSV file must contain headers' };
    }

    const datasetId = uuidv4();
    dashboardId = uuidv4();
    await sql.begin(async sql => {
      // Insert dataset
      await sql`
        INSERT INTO api_dataset 
          (id, filename, columns, data, uploaded_at)
        VALUES 
          (${datasetId}, ${file.name}, ${meta.fields!}, ${JSON.stringify(data)}, NOW())
      `;
  
      // Insert dashboard
      await sql`
        INSERT INTO api_dashboard
          (id, user_id, dataset_id, title, is_public, created_at, updated_at)
        VALUES
          (${dashboardId}, ${user.id}, ${datasetId}, ${title}, FALSE, NOW(), NOW())
      `;
    });

  } catch (error) {
    console.error('Creation failed:', error);
    return { message: 'Failed to create dashboard. Please try again.' };
  }
  
  redirect(`/dashboard/${dashboardId}/edit`);
}

export async function updateDashboardPublic(
  prevState: any,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "User not authenticated" };
  }
  const user = await getUserById(session.user.id);
  if (!user) {
    return { message: "User not found" };
  }

  const schema = z.object({
    id: z.string().min(1, 'Dashboard ID is required'),
    isPublic: z.enum(['true', 'false']),
  });
  const parsed = schema.safeParse({
    id: formData.get('id'),
    isPublic: formData.get('isPublic'),
  });
  if (!parsed.success) {
    return { message: 'Invalid input', errors: parsed.error.flatten() };
  }
  const { id, isPublic } = parsed.data;

  const dashboard = await sql`
    SELECT user_id FROM api_dashboard WHERE id = ${id}
  `;
  if (!dashboard.length) {
    return { message: "Dashboard not found" };
  }
  if (dashboard[0].user_id !== user.id) {
    return { message: "Unauthorized: You do not own this dashboard" };
  }

  try {
    await sql`
      UPDATE api_dashboard
      SET is_public = ${isPublic==="true"}
      WHERE id = ${id}
    `
  } catch (error) {
    console.error('Update failed:', error)
    return { message: 'Database error. Failed to update dashboard visibility' }
  }

  revalidatePath('/workspace')
}

export async function deleteDashboard(
  prevState: any,
  formData: FormData,
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "User not authenticated" };
  }
  const user = await getUserById(session.user.id);
  if (!user) {
    return { message: "User not found" };
  }

  const schema = z.object({
    id: z.string().min(1, 'Dashboard ID is required'),
  });
  const parsed = schema.safeParse({
    id: formData.get('id'),
  });
  if (!parsed.success) {
    return { message: 'Invalid input', errors: parsed.error.flatten() };
  }
  const { id } = parsed.data;

  const dashboard = await sql`
    SELECT user_id FROM api_dashboard WHERE id = ${id}
  `;
  if (!dashboard.length) {
    return { message: "Dashboard not found" };
  }
  if (dashboard[0].user_id !== user.id) {
    return { message: "Unauthorized: You do not own this dashboard" };
  }

  try {
    await sql`
      DELETE FROM api_dashboard
      WHERE id = ${id}
    `
  } catch (error) {
    console.error('Update failed:', error)
    return { message: 'Database error. Failed to delete dashboard' }
  }

  revalidatePath('/workspace')
}