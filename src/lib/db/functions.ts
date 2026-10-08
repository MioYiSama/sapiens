import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import * as z from "zod";

import { db } from ".";
import { ensureSession } from "../auth/functions";
import { ApiKeySchema } from "../schema";
import { apiKeyTable } from "./schema";

export const listApiKey = createServerFn({ method: "GET" }).handler(async () => {
  const session = await ensureSession();

  const apiKeyList = await db.query.apiKeyTable.findMany({
    where: {
      userId: session.user.id,
    },
    columns: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  return apiKeyList;
});

export const addApiKey = createServerFn({ method: "POST" })
  .validator(ApiKeySchema)
  .handler(async ({ data }) => {
    const session = await ensureSession();

    await db.insert(apiKeyTable).values({
      userId: session.user.id,
      ...data,
    });
  });

export const deleteApiKey = createServerFn({ method: "POST" })
  .validator(z.uuid())
  .handler(async ({ data }) => {
    const session = await ensureSession();

    await db
      .delete(apiKeyTable)
      .where(and(eq(apiKeyTable.id, data), eq(apiKeyTable.userId, session.user.id)));
  });
