CREATE TABLE IF NOT EXISTS "PlanningStep" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"chatId" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"nextStep" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "PlanningStep_id_pk" PRIMARY KEY("id")
);
