import { auth } from "@/auth";
import { notFound } from "next/navigation";
import sql from "@/lib/db";
import { EditDashboard, Dashboard, Comment } from "@/lib/definitions";

export async function getDashboardView(id:string): Promise<Dashboard | undefined> {
  let dashboard;
  try {
    dashboard = await sql<Dashboard[]>`
      SELECT
        db.id,
        db.title,
        db.description,
        db.is_public,
        db.updated_at,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'profile_image', u.profile_image
        ) AS author,
        COALESCE(
          json_agg(
            json_build_object(
              'id', c.id,
              'title', c.title,
              'description', c.description,
              'data', c.data,
              'config', c.config,
              'order', c.order
            ) ORDER BY c.order
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) AS charts
      FROM api_dashboard db
      JOIN api_user u ON db.user_id = u.id
      LEFT JOIN api_chart c ON db.id = c.dashboard_id
      WHERE db.id = ${id}
      GROUP BY
        db.id,
        u.id,
        u.first_name,
        u.last_name,
        u.profile_image;
    `;

  } catch (error) {
    console.error('Failed to fetch dashboard:', error);
    throw new Error('Failed to fetch dashboard.');
  }

  const session = await auth();
  const isPrivate = !dashboard[0].is_public;
  const isUnauthenticated = !session?.user?.id;
  const isNotAuthor = session?.user?.id !== dashboard[0].author.id.toString();

  if (isPrivate && (isUnauthenticated || isNotAuthor)) {
    notFound();
  }

  return dashboard[0];
}

export async function getLikeData(dashboardId: string) {
  const session = await auth()
  const userId = session?.user?.id

  let result;

  if (userId) {
    result = await sql`
      SELECT 
        COUNT(*) AS like_count,
        EXISTS (
          SELECT 1
          FROM api_like
          WHERE dashboard_id = ${dashboardId}
          AND user_id = ${userId}
        ) AS has_liked
      FROM api_like
      WHERE dashboard_id = ${dashboardId}
    `;
  } else {
    result = await sql`
      SELECT 
        COUNT(*) AS like_count,
        FALSE AS has_liked
      FROM api_like
      WHERE dashboard_id = ${dashboardId}
    `;
  }

  return {
    likeCount: parseInt(result[0]?.like_count || "0", 10),
    hasLiked: Boolean(result[0]?.has_liked)
  }
}

export async function getDashboardComment(id: string): Promise<Comment[] | undefined> {
  try {
    const comments = await sql<Comment[]>`
      SELECT
        c.id,
        c.content,
        c.created_at,
        json_build_object(
          'id', u.id,
          'first_name', u.first_name,
          'last_name', u.last_name,
          'profile_image', u.profile_image
        ) AS author
      FROM api_comment c
      JOIN api_user u ON c.user_id = u.id
      WHERE c.dashboard_id = ${id}
      ORDER BY c.created_at ASC;
    `;
    return comments;
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    throw new Error('Failed to fetch comments.');
  }
}

export async function getDashboardEdit(id:string): Promise<EditDashboard | undefined> {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }
  
  let dashboard;
  try {
    dashboard = await sql<EditDashboard[]>`
      SELECT
        db.id,
        db.title,
        db.description,
        db.is_public,
        db.updated_at,
        json_build_object(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'profile_image', u.profile_image
        ) AS author,
        json_build_object(
            'filename', ds.filename,
            'columns', ds.columns,
            'data', ds.data
        ) AS dataset,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', c.id,
                    'title', c.title,
                    'description', c.description,
                    'data', c.data,
                    'config', c.config,
                    'order', c.order
                ) ORDER BY c.order
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'::json
        ) AS charts
    FROM api_dashboard db
    JOIN api_user u ON db.user_id = u.id
    JOIN api_dataset ds ON db.dataset_id = ds.id
    LEFT JOIN api_chart c ON db.id = c.dashboard_id
    WHERE db.id = ${id}
    GROUP BY
        db.id,
        u.id,
        u.first_name,
        u.last_name,
        u.profile_image,
        ds.filename,
        ds.columns,
        ds.data;
    `;

  } catch (error) {
    console.error('Failed to fetch dashboard:', error);
    throw new Error('Failed to fetch dashboard.');
  }

  const isNotAuthor = session?.user?.id !== dashboard[0].author.id.toString();
  if (isNotAuthor) {
    notFound();
  }

  return dashboard[0];
}