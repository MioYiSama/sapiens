import handler from "@tanstack/react-start/server-entry";
import { FastResponse } from "srvx";

import { paraglideMiddleware } from "./lib/paraglide/server.js";

globalThis.Response = FastResponse;

export default {
  async fetch(req: Request): Promise<Response> {
    return paraglideMiddleware(req, () => handler.fetch(req));
  },
};
