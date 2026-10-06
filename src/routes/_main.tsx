import { SiGithub } from "@icons-pack/react-simple-icons";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { PanelLeftOpenIcon } from "lucide-react";

import AppSidebar, { AppSidebarProvider } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { m } from "@/lib/paraglide/messages";

export const Route = createFileRoute("/_main")({
  component() {
    return (
      <AppSidebarProvider>
        <AppSidebar />

        <div className="flex size-full grow flex-col">
          <Header />
          <Outlet />
        </div>
      </AppSidebarProvider>
    );
  },
});

function Header() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex w-full flex-row items-center p-2">
      <Button variant="ghost" className="md:invisible" onClick={toggleSidebar}>
        <PanelLeftOpenIcon />
      </Button>

      <Tabs defaultValue="conversation" className="mx-auto">
        <TabsList>
          <TabsTrigger value="conversation">{m.conversation()}</TabsTrigger>
          <TabsTrigger value="graph">{m.graph()}</TabsTrigger>
        </TabsList>
      </Tabs>

      <Button
        variant="ghost"
        render={(props) => (
          <a {...props} href="https://github.com/mioyisama/sapiens" target="_blank">
            <SiGithub />
          </a>
        )}
      />
    </header>
  );
}
