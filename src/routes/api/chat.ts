import {
  chat,
  chatParamsFromRequest,
  memoryStream,
  resumeServerSentEventsResponse,
  toServerSentEventsResponse,
} from "@tanstack/ai";
import { openaiText } from "@tanstack/ai-openai";
import { reconstructChat, withPersistence } from "@tanstack/ai-persistence";
import { createFileRoute } from "@tanstack/react-router";

import { aiPersistence } from "@/lib/db/ai-persistence";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async (request) => {
        const params = await chatParamsFromRequest(request.request);

        const stream = chat({
          adapter: openaiText("gpt-5.6"),
          messages: params.messages,
          threadId: params.threadId,
          runId: params.runId,
          resume: params.resume,
          middleware: [withPersistence(aiPersistence)],
        });

        return toServerSentEventsResponse(stream, {
          durability: { adapter: memoryStream(request.request) },
        });
      },
      GET: async (request) => {
        const durability = memoryStream(request.request);

        if (durability.resumeFrom() !== null) {
          return resumeServerSentEventsResponse({
            adapter: durability,
          });
        }

        return reconstructChat(aiPersistence, request.request, {});
      },
    },
  },
});
