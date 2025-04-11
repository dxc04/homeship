import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  first_name: text("first_name"),
  last_name: text("last_name"),
  email: text().notNull(),
  password: text(),
  email_verified: timestamp(),
  image: text(),
  is_admin: boolean("is_admin").default(false),
  is_active: boolean("is_active").default(true),

  phone_number: text("phone_number"),
  created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(table.email),
}));

export const usersRelations = relations(usersTable, ({ one }) => ({
  account: one(accountsTable),
}));

export const accountsTable = pgTable("accounts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(
    () => usersTable.id,
    { onDelete: "cascade" },
  ).notNull(),
  type: text("type"),
  provider: text("provider"),
  provider_account_id: text("provider_account_id"),
  refresh_token: text("refresh_token"),
  refresh_token_expires_in: integer("refresh_token_expires_in"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (table) => ({
  provider_provider_account_id_unique: uniqueIndex(
    "provider_provider_account_id_unique",
  ).on(table.provider_account_id),
  user_id_idx: index("account_user_id_idx").on(table.user_id),
}));

export const accountRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.user_id],
    references: [usersTable.id],
  }),
}));

export const sessionsTable = pgTable("sessions", {
  id: varchar("id").primaryKey(),
  user_id: integer("user_id").references(
    () => usersTable.id,
    { onDelete: "cascade" },
  ),
  data: jsonb("data"),
  session_token: text("session_token"),
}, (table) => ({
  user_id_idx: index("session_user_id_idx").on(table.user_id),
}));

export type User = InferSelectModel<typeof usersTable>;
export type Session = InferSelectModel<typeof sessionsTable>;
