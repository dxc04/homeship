import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const hoa = pgTable("associations", {
  id: serial("id").primaryKey(),
  name: text("name"),
  address: text("address"),
  icon: text("icon"),
  email: text(),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
