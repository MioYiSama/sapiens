import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import * as z from "zod";

import { db } from ".";
import { ensureSession } from "../auth/functions";
import { ApiKeySchema, ProviderSchema, ProviderServerSchema } from "../schema";
import { apiKeyTable, providerTable } from "./schema";

const userIdMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
  return await next({
    context: {
      userId: (await ensureSession()).user.id,
    },
  });
});

export const listApiKey = createServerFn({ method: "GET" })
  .middleware([userIdMiddleware])
  .handler(async ({ context: { userId } }) => {
    return await db.query.apiKeyTable.findMany({
      where: { userId },
      columns: {
        userId: false,
        value: false,
      },
    });
  });

export const addApiKey = createServerFn({ method: "POST" })
  .middleware([userIdMiddleware])
  .validator(ApiKeySchema)
  .handler(async ({ data, context: { userId } }) => {
    await db.insert(apiKeyTable).values({
      userId,
      ...data,
    });
  });

export const deleteApiKey = createServerFn({ method: "POST" })
  .middleware([userIdMiddleware])
  .validator(z.uuid())
  .handler(async ({ data, context: { userId } }) => {
    await db
      .delete(apiKeyTable)
      .where(and(eq(apiKeyTable.id, data), eq(apiKeyTable.userId, userId)));
  });

export const listProvider = createServerFn({ method: "POST" })
  .middleware([userIdMiddleware])
  .handler(async ({ context: { userId } }) => {
    return await db.query.providerTable.findMany({
      where: { userId },
      columns: {
        userId: false,
      },
    });
  });

export const addProvider = createServerFn({ method: "POST" })
  .middleware([userIdMiddleware])
  .validator(ProviderServerSchema)
  .handler(async ({ data, context: { userId } }) => {
    await db.insert(providerTable).values({
      userId,
      name: data.name,
      type: data.type,
      apiKeyId: data.apiKey,
      baseUrl: data.baseUrl,
    });
  });

export const deleteProvider = createServerFn({ method: "POST" })
  .middleware([userIdMiddleware])
  .validator(z.uuid())
  .handler(async ({ data, context: { userId } }) => {
    await db
      .delete(providerTable)
      .where(and(eq(providerTable.id, data), eq(providerTable.userId, userId)));
  });
