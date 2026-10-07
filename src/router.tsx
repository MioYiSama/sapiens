import { createRouter } from "@tanstack/react-router";

import { deLocalizeUrl, localizeUrl } from "./lib/paraglide/runtime";
import { configureZodLocale } from "./lib/utils";
import { routeTree } from "./routeTree.gen";

configureZodLocale();

export function getRouter() {
  return createRouter({
    routeTree,
    rewrite: {
      input: ({ url }) => deLocalizeUrl(url),
      output: ({ url }) => localizeUrl(url),
    },
  });
}
