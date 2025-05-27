ALTER TABLE "Document" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "Document" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "SecurityReport" ALTER COLUMN "id" DROP DEFAULT;