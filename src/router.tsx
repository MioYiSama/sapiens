import { createRouter } from "@tanstack/react-router";

import { deLocalizeUrl, localizeUrl } from "./lib/paraglide/runtime";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
  });
}
