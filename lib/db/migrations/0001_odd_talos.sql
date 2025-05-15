ALTER TABLE "message" ADD COLUMN "parts" json NOT NULL;--> statement-breakpoint
ALTER TABLE "message" ADD COLUMN "attachments" json NOT NULL;--> statement-breakpoint
ALTER TABLE "message" DROP COLUMN "content";