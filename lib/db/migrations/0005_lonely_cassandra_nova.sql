ALTER TABLE "SecurityReport" DROP CONSTRAINT "SecurityReport_document_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SecurityReport" ADD CONSTRAINT "SecurityReport_documentId_documentCreatedAt_Document_id_createdAt_fk" FOREIGN KEY ("documentId","documentCreatedAt") REFERENCES "public"."Document"("id","createdAt") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
