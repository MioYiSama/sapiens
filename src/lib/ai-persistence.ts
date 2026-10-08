import {
  composePersistence,
  defineMessageStore,
  memoryPersistence,
} from "@tanstack/ai-persistence";

import { ensureSession } from "./auth/functions";
import { db } from "./db";
import { conversationTable } from "./db/schema";

export const aiPersistence = composePersistence(memoryPersistence(), {
  overrides: {
    messages: defineMessageStore({
      async loadThread(threadId) {
        const session = await ensureSession();

        const conversation = await db.query.conversationTable.findFirst({
          where: {
            id: threadId,
            userId: session.user.id,
          },
          columns: {
            messages: true,
          },
        });

        return conversation ? conversation.messages : [];
      },
      async saveThread(threadId, messages) {
        const session = await ensureSession();

        await db.insert(conversationTable).values({
          id: threadId,
          userId: session.user.id,
          messages,
        });
      },
    }),
  },
});
