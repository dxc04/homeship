ALTER TABLE "sessions" ALTER COLUMN "session_token" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "data" jsonb NOT NULL;