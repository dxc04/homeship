import { eq } from "drizzle-orm";
import { usersTable as users, User } from "../schema/users.ts";
import { db, lower } from "../dbclient.ts";
import {
  genSaltSync,
  hashSync,
} from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

export async function insert(userObj: Pick<User, "email" | "password">) {
  return await db.insert(users).values(userObj).returning();
}

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()));

  return user;
}

export async function hashPassword(password: string) {
  return await hashSync(password, genSaltSync(12));
}