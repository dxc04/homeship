import { integer, pgSchema, serial, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./users.ts";

export const permissionsSchema = pgSchema("permissions");

export const roleTypesTable = permissionsSchema.table("role_types", {
  id: serial("id").primaryKey(),
  role_type: varchar("role_type").notNull(),
  description: varchar("description"),
});

export const roleTypesRelations = relations(roleTypesTable, ({ many }) => ({
  roles: many(rolesTable),
}))

export const rolesTable = permissionsSchema.table("roles", {
  id: serial("id").primaryKey(),
  role_type_id: integer("role_type_id").references(
    () => roleTypesTable.id,
    { onDelete: "cascade" },
  ).notNull(),
  user_id: integer("user_id").references(
    () => usersTable.id,
    { onDelete: "cascade" },
  ),
});

export const rolesRelations = relations(rolesTable, ({ one }) => ({
  roleType: one(roleTypesTable, {
    fields: [rolesTable.role_type_id],
    references: [roleTypesTable.id],
    }),
  user: one(usersTable, {
        fields: [rolesTable.user_id],
        references: [usersTable.id],
    }),
}));    

export const resourceTypesTable = permissionsSchema.table("resource_types", {
  id: serial("id").primaryKey(),
  resource_type: varchar("resource_type")
    .notNull(), /** @example "user", "role_type" */
  description: varchar("description"),
});

export const resourcesTable = permissionsSchema.table("resources", {
  id: serial("id").primaryKey(),
  resource_type_id: integer("resource_type_id").references(
    () => resourceTypesTable.id,
    { onDelete: "cascade" },
  ).notNull(),
  resource_id: varchar("resource_id").notNull(),
});

export const resourcesRelations = relations(resourcesTable, ({ one }) => ({
  resourceType: one(resourceTypesTable),
}));

export const permissionsTable = permissionsSchema.table("permissions", {
  id: serial("id").primaryKey(),
  permission: varchar("permission").notNull(),
  resource_id: integer("resource_id").references(
    () => resourcesTable.id,
    { onDelete: "cascade" },
  ).notNull(),
});

export const permissionsRelations = relations(permissionsTable, ({ one }) => ({
  resource: one(resourcesTable),
}));
