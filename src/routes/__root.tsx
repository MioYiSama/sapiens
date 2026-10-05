import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import css from "@/index.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Sapiens" },
    ],
    links: [{ rel: "stylesheet", href: css }],
  }),
  component() {
    return (
      <html>
        <head>
          <HeadContent />
        </head>
        <body>
          <Outlet />
          <Scripts />
        </body>
      </html>
    );
  },
});
