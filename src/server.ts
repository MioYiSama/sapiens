import handler from "@tanstack/react-start/server-entry";
import { env } from "cloudflare:workers";

import { paraglideMiddleware } from "./lib/paraglide/server.js";

export default {
  async fetch(req: Request): Promise<Response> {
    const { success } = await env.RATE_LIMITER.limit({
      key: req.headers.get("CF-Connecting-IP") ?? "unknown",
    });

    if (!success) {
      return new Response(null, {
        status: 429,
      });
    }

    return paraglideMiddleware(req, () => handler.fetch(req));
  },
};
