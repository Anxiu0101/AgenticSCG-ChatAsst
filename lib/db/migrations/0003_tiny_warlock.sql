CREATE TABLE IF NOT EXISTS "SecurityReport" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"documentId" uuid DEFAULT gen_random_uuid() NOT NULL,
	"documentCreatedAt" timestamp DEFAULT now() NOT NULL,
	"targetLang" text DEFAULT 'python' NOT NULL,
	"scannerTool" text DEFAULT 'bandit' NOT NULL,
	"content" jsonb NOT NULL,
	"vulnCount" integer DEFAULT 0 NOT NULL,
	"userId" uuid NOT NULL,
	CONSTRAINT "SecurityReport_id_createdAt_pk" PRIMARY KEY("id","createdAt")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SecurityReport" ADD CONSTRAINT "SecurityReport_documentId_Document_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."Document"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SecurityReport" ADD CONSTRAINT "SecurityReport_documentCreatedAt_Document_createdAt_fk" FOREIGN KEY ("documentCreatedAt") REFERENCES "public"."Document"("createdAt") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SecurityReport" ADD CONSTRAINT "SecurityReport_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "SecurityReport" ADD CONSTRAINT "SecurityReport_documentId_documentCreatedAt_Document_id_createdAt_fk" FOREIGN KEY ("documentId","documentCreatedAt") REFERENCES "public"."Document"("id","createdAt") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
