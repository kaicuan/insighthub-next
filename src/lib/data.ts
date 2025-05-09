import { User } from "next-auth";
import sql from "@/lib/db";

export async function getUser(email: string, provider: string = "insighthub"): Promise<User | undefined> {
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