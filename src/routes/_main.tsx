import { createFileRoute, Outlet, redirect, useMatchRoute } from "@tanstack/react-router";
import { PanelLeftOpenIcon } from "lucide-react";

import AppSidebar, { AppSidebarProvider } from "@/components/AppSidebar";
import { GitHubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSession } from "@/lib/auth/functions";
import { m } from "@/lib/paraglide/messages";

export const Route = createFileRoute("/_main")({
  async beforeLoad() {
    const session = await getSession();

    if (!session) {
      throw redirect({ to: "/signin" });
    }

    return { session };
  },
  component() {
    return (
      <AppSidebarProvider>
        <AppSidebar />

        <div className="flex size-full flex-col">
          <Header />
          <Outlet />
        </div>
      </AppSidebarProvider>
    );
  },
});

function Header() {
  const { toggleSidebar } = useSidebar();
  const navigate = Route.useNavigate();
  const matchRoute = useMatchRoute();

  const currentTab = matchRoute({ to: "/graph" }) ? "graph" : "conversation";
  const handleTabChange = (value: string) => {
    navigate({ to: value === "graph" ? "/graph" : "/" });
  };

  return (
    <header className="flex w-full flex-row items-center p-2">
      <Button variant="ghost" className="md:invisible" onClick={toggleSidebar}>
        <PanelLeftOpenIcon />
      </Button>

      <Tabs value={currentTab} onValueChange={handleTabChange} className="mx-auto">
        <TabsList>
          <TabsTrigger value="conversation">{m.chat()}</TabsTrigger>
          <TabsTrigger value="graph">{m.graph()}</TabsTrigger>
        </TabsList>
      </Tabs>

      <Button
        variant="ghost"
        nativeButton={false}
        render={(props) => (
          <a {...props} href="https://github.com/MioYiSama/sapiens" target="_blank">
            <GitHubIcon />
          </a>
        )}
      />
    </header>
  );
}
