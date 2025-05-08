import { User } from "@/lib/definitions";
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