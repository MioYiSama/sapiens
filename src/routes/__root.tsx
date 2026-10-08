import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/toast";
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
  shellComponent: ShellComponent,
  component: RouteComponent,
  notFoundComponent: NotFoundComponent,
});

function ShellComponent({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} className="size-full overflow-hidden" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="size-full overflow-hidden">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RouteComponent() {
  return (
    <>
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>

      <Toaster />
    </>
  );
}

function NotFoundComponent() {
  return <p>Not Found</p>;
}
