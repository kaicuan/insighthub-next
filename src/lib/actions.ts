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

  let id = '';
  try {
    // Parse CSV file
    const csvText = await file.text();
    const { data, meta } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    if (!meta.fields || meta.fields.length === 0) {
      return {
        errors: { file: ['CSV file must contain headers'] }
      };
    }

    const datasetId = uuidv4();
    id = uuidv4();
    await sql.begin(async sql => {
      // Insert dataset
      await sql`
        INSERT INTO api_dataset 
          (id, filename, columns, data, uploaded_at)
        VALUES 
          (${datasetId}, ${file.name}, ${meta.fields!}, ${data}, NOW())
      `;
  
      // Insert dashboard
      await sql`
        INSERT INTO api_dashboard
          (id, user_id, dataset_id, title, is_public, created_at, updated_at)
        VALUES
          (${id}, ${user.id}, ${datasetId}, ${title}, FALSE, NOW(), NOW())
      `;
    });

  } catch (error) {
    console.error('Creation failed:', error);
    return { message: 'Failed to create dashboard. Please try again.' };
  }
  
  redirect(`/dashboard/${id}/edit`);
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
    return { message: 'Invalid input', errors: parsed.error.flatten().fieldErrors };
  }
  const { id, isPublic } = parsed.data;
  
  try {
    // Verify dashboard ownership
    const dashboard = await sql`
      SELECT user_id FROM api_dashboard WHERE id = ${id}
    `;
    if (!dashboard.length) {
      return { message: "Dashboard not found" };
    }
    if (dashboard[0].user_id !== user.id) {
      return { message: "Unauthorized: You do not own this dashboard" };
    }

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

export async function updateDashboard(
  prevState: any,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "User not authenticated" };
  }
  const user = await getUserById(session.user.id);
  if (!user) {
    return { message: "User not found" };
  }
  
  const chartConfigSchema = z.object({
    type: z.enum(['bar', 'line']),
    index: z.string(),
    x_axis_label: z.string(),
    start_end_only: z.boolean(),
    categories: z.array(z.string()),
    y_axis_label: z.string(),
    bar_type: z.enum(['default', 'stacked', 'percent']).nullable().optional(),
    layout: z.enum(['horizontal', 'vertical']).nullable().optional(),
    x_axis: z.string(),
    y_axis: z.string(),
    series: z.string().nullable(),
    aggregation: z.enum(['sum', 'average', 'count']),
  });
  const chartSchema = z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string(),
    data: z.array(z.any()),
    config: chartConfigSchema,
  });
  const schema = z.object({
    id: z.string().uuid(),
    title: z.string()
      .min(1, 'Title is required')
      .max(51, 'Title must be less than 50 characters'),
    description: z.string(),
    charts: z.array(chartSchema),
    deletedCharts: z.array(z.string().uuid()),
  });
  const parsed = schema.safeParse({
    id: formData.get('id'),
    title: formData.get('title'),
    description: formData.get('description'),
    charts: JSON.parse(formData.get('charts') as string),
    deletedCharts: JSON.parse(formData.get('deletedCharts') as string),
  });
  if (!parsed.success) {
    return { message: 'Invalid input', errors: parsed.error.flatten().fieldErrors };
  }
  const { id, title, description, charts, deletedCharts } = parsed.data;


  try {
    // Verify dashboard ownership
    const dashboard = await sql`
      SELECT user_id FROM api_dashboard WHERE id = ${id}
    `;
    if (!dashboard.length) {
      return { message: "Dashboard not found" };
    }
    if (dashboard[0].user_id !== user.id) {
      return { message: "Unauthorized: You do not own this dashboard" };
    }

    await sql.begin(async sql => {
      // Update dashboard metadata
      await sql`
        UPDATE api_dashboard
        SET 
          title = ${title},
          description = ${description},
          updated_at = NOW()
        WHERE id = ${id}
      `;
      
      // Delete removed charts
      if (deletedCharts?.length > 0) {
        await sql`
          DELETE FROM api_chart 
          WHERE id = ANY(${deletedCharts}::uuid[])
            AND dashboard_id = ${id}
        `;
      }

      // Insert/Update Chart
      if (charts.length > 0) {
        await sql`
          INSERT INTO api_chart ${sql(
            charts.map((chart: any, index: number) => ({
              id: chart.id,
              dashboard_id: id,
              title: chart.title,
              description: chart.description,
              data: chart.data,
              config: chart.config,
              "order": index + 1 
            }))
          )}
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            data = EXCLUDED.data,
            config = EXCLUDED.config,
            "order" = EXCLUDED.order
        `;
      }
    })

  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database error. Failed to update dashboard' };
  }

  revalidatePath(`/dashboard/${id}/view`);
  redirect(`/dashboard/${id}/view`);
}

export async function toggleLike(
  prevState: { message?: string; errors?: Record<string, string[]> } | undefined,
  formData: FormData,
){
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "User not authenticated" };
  }
  const user = await getUserById(session.user.id);
  if (!user) {
    return { message: "User not found" };
  }

  const schema = z.object({
    dashboardId: z.string().uuid(),
    hasLiked: z.boolean()
  });
  const parsed = schema.safeParse({
    dashboardId: formData.get('dashboardId'),
    hasLiked: Boolean(formData.get('hasLiked')),
  });
  if (!parsed.success) {
    console.log(parsed.error)
    return { message:"Invalid input", "errors": parsed.error.flatten().fieldErrors };
  }
  const { dashboardId, hasLiked } = parsed.data;

  try {
    if (hasLiked) {
      const id = uuidv4();
      await sql`
        INSERT INTO api_like (id, user_id, dashboard_id, created_at)
        VALUES (${id}, ${user.id}, ${dashboardId}, NOW())
        ON CONFLICT DO NOTHING;
      `
    } else {
      await sql`
        DELETE FROM api_like
        WHERE user_id = ${user.id} AND dashboard_id = ${dashboardId}
      `
    }
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database error. Failed to update like' };
  }

  revalidatePath(`/dashboard/${dashboardId}/view`)
  return { success: true }
}

export async function createComment(
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
    dashboardId: z.string().uuid(),
    content: z.string()
      .min(1, 'Comment is required')
      .max(501, 'Comment must be less than 500 characters'),
  });
  const parsed = schema.safeParse({
    dashboardId: formData.get('dashboardId'),
    content: formData.get('content'),
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }
  const { dashboardId, content } = parsed.data;

  try {
    const id = uuidv4();
    await sql`
      INSERT INTO api_comment
        (id, user_id, dashboard_id, content, created_at)
      VALUES 
        (${id}, ${user.id}, ${dashboardId}, ${content}, NOW())
    `;
  } catch (error) {
    console.error('Creation failed:', error);
    return { message: 'Failed to create dashboard. Please try again.' };
  }
  
  revalidatePath(`/dashboard/${dashboardId}/view`)
  return { success: true }
}