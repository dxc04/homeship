import { eq } from "drizzle-orm";
import { User, usersTable as users } from "../schema/users.ts";
import { db, lower } from "../dbclient.ts";
import {
  genSaltSync,
  hashSync,
} from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

/**
 * Inserts a new user into the database.
 * @param {Pick<User, "email" | "password">} userObj - An object containing the email and password of the user to create.
 * @returns {Promise<User>} - A promise that resolves to the newly created user.
 */
export async function insert(userObj: Pick<User, "email" | "password">) {
  return await db.insert(users).values(userObj).returning();
}

/**
 * Updates a user in the database.
 * @param {User} userObj - An object containing the properties of the user to update.
 * @returns {Promise<User>} - A promise that resolves to the updated user.
 */
export async function update(userObj: User) {
  return await db.update(users)
    .set(userObj)
    .where(eq(lower(users.email), userObj.email.toLowerCase()))
    .returning();
}

/**
 * Retrieves a user by email address.
 * @param {string} email - The email address of the user to retrieve.
 * @returns {Promise<User | null>} - A promise that resolves to the user if found, or null if the user does not exist.
 */
export async function findUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(lower(users.email), email.toLowerCase()));

  return user;
}

export async function findByUserId(id: number) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id));

  return user;
}

export async function hashPassword(password: string) {
  return await hashSync(password, genSaltSync(12));
}
