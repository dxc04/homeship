DROP INDEX IF EXISTS "provider_provider_account_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "emailUniqueIndex";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_admin" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "is_active" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "provider_provider_account_id_unique" ON "accounts" USING btree ("provider_account_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailUniqueIndex" ON "users" USING btree ("email");