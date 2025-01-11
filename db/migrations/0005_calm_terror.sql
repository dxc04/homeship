ALTER TABLE "sessions" RENAME COLUMN "expires" TO "expire";--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "delete" timestamp;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "accessed" timestamp;