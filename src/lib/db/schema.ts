import type { ModelMessage } from "@tanstack/ai";
import { defineRelations, sql } from "drizzle-orm";
import { jsonb, pgEnum, pgTable, text, unique, uuid, timestamp } from "drizzle-orm/pg-core";

import { ProviderTypes, ReasoningEfforts } from "../schema";
import { user as userTable } from "./auth-schema";

export const apiKeyTable = pgTable(
  "api_key",
  {
    id: uuid()
      .notNull()
      .default(sql`uuidv7()`)
      .primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),

    name: text().notNull(),
    value: text().notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [unique().on(table.userId, table.name)],
);

export const providerType = pgEnum("provider_type", ProviderTypes);
export const providerTable = pgTable(
  "provider",
  {
    id: uuid()
      .notNull()
      .default(sql`uuidv7()`)
      .primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),

    name: text().notNull(),
    type: providerType().notNull().default("chat_completions"),
    apiKeyId: uuid("api_key_id").references(() => apiKeyTable.id, { onDelete: "set null" }),
    baseUrl: text("base_url"),
  },
  (table) => [unique().on(table.userId, table.name)],
);

export const reasoningEffort = pgEnum("reasoning_effort", ReasoningEfforts);
export const modelTable = pgTable(
  "model",
  {
    id: uuid()
      .notNull()
      .default(sql`uuidv7()`)
      .primaryKey(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => providerTable.id, { onDelete: "cascade" }),

    identifier: text().notNull(),
    reasoningEffort: reasoningEffort("reasoning_effort").notNull().default("none"),
  },
  (table) => [unique().on(table.providerId, table.identifier, table.reasoningEffort)],
);

export const settingsTable = pgTable("settings", {
  id: uuid()
    .notNull()
    .default(sql`uuidv7()`)
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => userTable.id, { onDelete: "cascade" }),

  defaultModel: uuid("default_model").references(() => modelTable.id),
  smolModel: uuid("smol_model").references(() => modelTable.id),
});

export const conversationTable = pgTable("conversation", {
  id: uuid()
    .notNull()
    .default(sql`uuidv7()`)
    .primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => userTable.id, { onDelete: "cascade" }),

  messages: jsonb().notNull().default([]).$type<Array<ModelMessage>>(),
});

export default defineRelations(
  { userTable, apiKeyTable, providerTable, modelTable, settingsTable, conversationTable },
  (r) => ({
    userTable: {
      providers: r.many.providerTable({
        from: r.userTable.id,
        to: r.providerTable.userId,
      }),
      apiKeys: r.many.apiKeyTable({
        from: r.userTable.id,
        to: r.apiKeyTable.userId,
      }),
      settings: r.one.settingsTable({
        from: r.userTable.id,
        to: r.settingsTable.userId,
      }),
    },
    providerTable: {
      apiKey: r.one.apiKeyTable({
        from: r.providerTable.apiKeyId,
        to: r.apiKeyTable.id,
      }),
      modelTable: r.many.modelTable({
        from: r.providerTable.id,
        to: r.modelTable.providerId,
      }),
    },
  }),
);
