import { db } from "../dbclient-neon.ts";
import {
  permissionsTable,
  resourceTypesTable,
  roleTypesTable,
} from "../schema/permissions.ts";
import { eq } from "drizzle-orm";

async function seed() {
  const roles = await db.select().from(roleTypesTable).where(
    eq(roleTypesTable.role_type, "admin"),
  ).execute();

  if (roles.length > 0) {
    return;
  }

  await db.insert(roleTypesTable).values([
    {
      role_type: "admin",
      description: "Admin role",
    },
    {
      role_type: "user",
      description: "User role",
    },
  ]);

  await db.insert(resourceTypesTable).values([
    {
      resource_type: "user",
      description: "User resource",
    },
    {
      resource_type: "role_type",
      description: "Role type resource",
    },
  ]);
}

async function main() {
  try {
    await seed();
    console.log("Seeding completed");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

main();
