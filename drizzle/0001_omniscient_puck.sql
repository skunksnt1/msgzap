CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'scheduled', 'in_progress', 'completed', 'paused', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."instance_status" AS ENUM('disconnected', 'connecting', 'connected', 'authenticated', 'error');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('pending', 'sent', 'delivered', 'read', 'failed');--> statement-breakpoint
CREATE TABLE "campaign" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"message" text NOT NULL,
	"status" "campaign_status" DEFAULT 'draft',
	"userId" text NOT NULL,
	"instanceId" text NOT NULL,
	"listId" text NOT NULL,
	"scheduledFor" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"messageVariations" json DEFAULT '[]'::json,
	"sendingSpeed" integer DEFAULT 10,
	"completedAt" timestamp,
	"totalContacts" integer DEFAULT 0,
	"sentCount" integer DEFAULT 0,
	"deliveredCount" integer DEFAULT 0,
	"readCount" integer DEFAULT 0,
	"failedCount" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "contact" (
	"id" text PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"name" text,
	"listId" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"metadata" json
);
--> statement-breakpoint
CREATE TABLE "contact_list" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"contactCount" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" text PRIMARY KEY NOT NULL,
	"campaignId" text NOT NULL,
	"contactId" text NOT NULL,
	"content" text NOT NULL,
	"status" "message_status" DEFAULT 'pending',
	"sentAt" timestamp,
	"deliveredAt" timestamp,
	"readAt" timestamp,
	"failedAt" timestamp,
	"errorMessage" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"messageLimit" integer NOT NULL,
	"instanceLimit" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"isActive" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "whatsapp_instance" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"status" "instance_status" DEFAULT 'disconnected',
	"userId" text NOT NULL,
	"instanceKey" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastConnection" timestamp,
	"config" json
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "isAdmin" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "planId" text;--> statement-breakpoint
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_instanceId_whatsapp_instance_id_fk" FOREIGN KEY ("instanceId") REFERENCES "public"."whatsapp_instance"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_listId_contact_list_id_fk" FOREIGN KEY ("listId") REFERENCES "public"."contact_list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact" ADD CONSTRAINT "contact_listId_contact_list_id_fk" FOREIGN KEY ("listId") REFERENCES "public"."contact_list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact" ADD CONSTRAINT "contact_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contact_list" ADD CONSTRAINT "contact_list_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_campaignId_campaign_id_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."campaign"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_contactId_contact_id_fk" FOREIGN KEY ("contactId") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_instance" ADD CONSTRAINT "whatsapp_instance_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_planId_plan_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."plan"("id") ON DELETE no action ON UPDATE no action;