import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import NotFound from "@/components/NotFound";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getLocale } from "@/lib/paraglide/runtime";

import css from "@/index.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sapiens" },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg" },
      { rel: "stylesheet", href: css },
    ],
  }),
  component() {
    return (
      <html lang={getLocale()} className="size-full">
        <head>
          <HeadContent />
        </head>
        <body className="size-full">
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>

          <Scripts />
        </body>
      </html>
    );
  },
  notFoundComponent: NotFound,
});
