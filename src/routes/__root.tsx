import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

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
      <html lang={getLocale()}>
        <head>
          <HeadContent />
        </head>
        <body>
          <TooltipProvider>
            <Outlet />
          </TooltipProvider>
          <Scripts />
        </body>
      </html>
    );
  },
  notFoundComponent() {
    return <p>Not Found</p>;
  },
});
