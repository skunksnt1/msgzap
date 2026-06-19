import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";

// Tabelas originais do sistema de autenticação
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified"),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  isAdmin: boolean("isAdmin").default(false),
  planId: text("planId").references(() => plan.id),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Enums para a aplicação de disparos WhatsApp
export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "scheduled",
  "in_progress",
  "completed",
  "paused",
  "cancelled",
]);

export const messageStatusEnum = pgEnum("message_status", [
  "pending",
  "sent",
  "delivered",
  "read",
  "failed",
]);

export const instanceStatusEnum = pgEnum("instance_status", [
  "disconnected",
  "connecting",
  "connected",
  "authenticated",
  "error",
]);

// Novas tabelas para a aplicação de disparos WhatsApp
export const plan = pgTable("plan", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // em centavos
  messageLimit: integer("messageLimit").notNull(),
  instanceLimit: integer("instanceLimit").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  isActive: boolean("isActive").default(true),
});

export const whatsappInstance = pgTable("whatsapp_instance", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  status: instanceStatusEnum("status").default("disconnected"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  instanceKey: text("instanceKey"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  lastConnection: timestamp("lastConnection"),
  config: json("config"),
});

export const contactList = pgTable("contact_list", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  contactCount: integer("contactCount").default(0),
});

export const contact = pgTable("contact", {
  id: text("id").primaryKey(),
  phone: text("phone").notNull(),
  name: text("name"),
  listId: text("listId")
    .notNull()
    .references(() => contactList.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  metadata: json("metadata"),
});

export const campaign = pgTable("campaign", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  message: text("message").notNull(),
  status: campaignStatusEnum("status").default("draft"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  instanceId: text("instanceId")
    .notNull()
    .references(() => whatsappInstance.id, { onDelete: "cascade" }),
  listId: text("listId")
    .notNull()
    .references(() => contactList.id, { onDelete: "cascade" }),
  scheduledFor: timestamp("scheduledFor"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  messageVariations: json("messageVariations").default([]),
  sendingSpeed: integer("sendingSpeed").default(10), // mensagens por minuto
  completedAt: timestamp("completedAt"),
  totalContacts: integer("totalContacts").default(0),
  sentCount: integer("sentCount").default(0),
  deliveredCount: integer("deliveredCount").default(0),
  readCount: integer("readCount").default(0),
  failedCount: integer("failedCount").default(0),
});

export const message = pgTable("message", {
  id: text("id").primaryKey(),
  campaignId: text("campaignId")
    .notNull()
    .references(() => campaign.id, { onDelete: "cascade" }),
  contactId: text("contactId")
    .notNull()
    .references(() => contact.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  status: messageStatusEnum("status").default("pending"),
  sentAt: timestamp("sentAt"),
  deliveredAt: timestamp("deliveredAt"),
  readAt: timestamp("readAt"),
  failedAt: timestamp("failedAt"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});
