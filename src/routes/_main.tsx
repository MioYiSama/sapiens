import { createFileRoute, Link, Outlet, useMatchRoute } from "@tanstack/react-router";
import { EditIcon, PanelLeftOpenIcon, SettingsIcon } from "lucide-react";

import AppSidebarHeader from "@/components/AppSidebarHeader";
import NavUser from "@/components/NavUser";
import { ResizableSidebar, ResizableSidebarProvider } from "@/components/ResizableSidebar";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader } from "@/components/ui/empty";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ensureSession } from "@/lib/auth/functions";
import { m } from "@/lib/paraglide/messages";

export const Route = createFileRoute("/_main")({
  async beforeLoad() {
    return { session: await ensureSession() };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();

  return (
    <ResizableSidebarProvider>
      <ResizableSidebar>
        <SidebarHeader>
          <AppSidebarHeader />
        </SidebarHeader>

        <SidebarContent>
          <AppSidebarMain />
        </SidebarContent>

        <SidebarFooter>
          <NavUser session={session} />
        </SidebarFooter>
      </ResizableSidebar>

      <div className="flex size-full flex-col">
        <Header />
        <main className="size-full">
          <Outlet />
        </main>
      </div>
    </ResizableSidebarProvider>
  );
}

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
        size="icon"
        nativeButton={false}
        render={
          <Link to="/settings">
            <SettingsIcon />
          </Link>
        }
      />
    </header>
  );
}

function AppSidebarMain() {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>{m.chat()}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={m.new_chat()}
                render={
                  <Link to="/">
                    <EditIcon />
                    <span>{m.new_chat()}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>{m.graph()}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>{/* TODO */}</SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>{m.conversation()}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Empty>
                <EmptyHeader>
                  <EmptyDescription className="truncate">{m.no_conversations()}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
