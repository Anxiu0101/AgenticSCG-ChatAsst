ALTER TABLE "SecurityReport" DROP CONSTRAINT "SecurityReport_documentId_Document_id_fk";
--> statement-breakpoint
ALTER TABLE "SecurityReport" DROP CONSTRAINT "SecurityReport_documentCreatedAt_Document_createdAt_fk";
--> statement-breakpoint
ALTER TABLE "SecurityReport" DROP CONSTRAINT "SecurityReport_documentId_documentCreatedAt_Document_id_createdAt_fk";
--> statement-breakpoint
ALTER TABLE "SecurityReport" ALTER COLUMN "documentId" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "SecurityReport" ALTER COLUMN "documentCreatedAt" DROP DEFAULT;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SecurityReport" ADD CONSTRAINT "SecurityReport_document_fk" FOREIGN KEY ("documentId","documentCreatedAt") REFERENCES "public"."Document"("id","createdAt") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
