// @lib/data.ts

import { User } from "next-auth";
import sql from "@/lib/db";
import { DashboardSummary } from "@/lib/definitions";

export async function getUserById(id:string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`
      SELECT id, email, first_name, last_name, profile_image, provider
      FROM api_user
      WHERE id=${id}`
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getUserByEmail(email: string, provider: string = "insighthub"): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`
      SELECT *
      FROM api_user
      WHERE email=${email}
        AND provider=${provider}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getUserByProvAccID(providerAccountId: string, provider: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`
      SELECT *
      FROM api_user
      WHERE provideraccountid=${providerAccountId}
        AND provider=${provider}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getWorkspaceContent(id:string): Promise<DashboardSummary[] | undefined> {
  try {
    const workspaceContent = await sql<DashboardSummary[]>`
      SELECT 
        db.id,
        dt.filename AS dataset,
        db.title,
        db.is_public,
        db.preview_image,
        db.updated_at,
        COUNT(c.id) AS chart_count
      FROM api_dashboard db
      JOIN api_dataset dt ON db.dataset_id = dt.id
      LEFT JOIN api_chart c ON db.id = c.dashboard_id
      WHERE db.user_id = ${id}
      GROUP BY 
        db.id, 
        dt.filename, 
        db.title, 
        db.is_public, 
        db.preview_image,
        db.updated_at
      ORDER BY db.created_at DESC;
    `;
    return workspaceContent;
  } catch (error) {
    console.error('Failed to fetch workspace:', error);
    throw new Error('Failed to fetch workspace.');
  }
}