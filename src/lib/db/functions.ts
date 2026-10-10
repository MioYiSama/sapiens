import { notFound } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import * as z from "zod";

import { db } from ".";
import { ensureSession } from "../auth/functions";
import { ApiKeySchema, ModelSchema, ProviderServerSchema } from "../schema";
import { apiKeyTable, modelTable, providerTable } from "./schema";

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
      orderBy: {
        id: "asc",
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

export const listProvider = createServerFn({ method: "GET" })
  .middleware([userIdMiddleware])
  .handler(async ({ context: { userId } }) => {
    return await db.query.providerTable.findMany({
      where: { userId },
      columns: {
        userId: false,
      },
      orderBy: {
        id: "asc",
      },
    });
  });

export const addProvider = createServerFn({ method: "POST" })
  .middleware([userIdMiddleware])
  .validator(ProviderServerSchema)
  .handler(async ({ data, context: { userId } }) => {
    await db.insert(providerTable).values({ userId, ...data });
  });

export const deleteProvider = createServerFn({ method: "POST" })
  .middleware([userIdMiddleware])
  .validator(z.uuid())
  .handler(async ({ data, context: { userId } }) => {
    await db
      .delete(providerTable)
      .where(and(eq(providerTable.id, data), eq(providerTable.userId, userId)));
  });

export const updateProvider = createServerFn({ method: "POST" })
  .middleware([userIdMiddleware])
  .validator(
    ProviderServerSchema.extend({
      id: z.uuid(),
    }),
  )
  .handler(async ({ data: { id, ...data }, context: { userId } }) => {
    await db
      .update(providerTable)
      .set(data)
      .where(and(eq(providerTable.id, id), eq(providerTable.userId, userId)));
  });

export const listProviderWithModel = createServerFn({ method: "GET" })
  .middleware([userIdMiddleware])
  .handler(async ({ context: { userId } }) => {
    return await db.query.providerTable.findMany({
      where: { userId },
      with: {
        models: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  });

export const addModel = createServerFn({ method: "POST" })
  .middleware([userIdMiddleware])
  .validator(ModelSchema)
  .handler(async ({ data, context: { userId } }) => {
    const provider = await db.query.providerTable.findFirst({
      where: { id: data.providerId, userId },
    });

    if (provider === undefined) {
      throw notFound();
    }

    await db.insert(modelTable).values({ ...data });
  });

export const deleteModel = createServerFn({ method: "POST" })
  .middleware([userIdMiddleware])
  .validator(z.uuid())
  .handler(async ({ data, context: { userId } }) => {
    const model = await db.query.modelTable.findFirst({
      where: { id: data },
    });

    if (model === undefined) return;

    const provider = await db.query.providerTable.findFirst({
      where: { id: model.providerId, userId },
    });

    if (provider === undefined) {
      throw notFound();
    }

    await db.delete(modelTable).where(eq(modelTable.id, data));
  });
