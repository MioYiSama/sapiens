import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import {
  BoxIcon,
  CircleUserRoundIcon,
  InfoIcon,
  KeyRoundIcon,
  PanelLeftOpenIcon,
  ServerIcon,
} from "lucide-react";

import AppSidebarHeader from "@/components/AppSidebarHeader";
import NavUser from "@/components/NavUser";
import { ResizableSidebar, ResizableSidebarProvider } from "@/components/ResizableSidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { ensureSession } from "@/lib/auth/functions";
import { m } from "@/lib/paraglide/messages";

export const Route = createFileRoute("/settings")({
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
          <NavSettings />
        </SidebarContent>

        <SidebarFooter>
          <NavUser session={session} />
        </SidebarFooter>
      </ResizableSidebar>

      <div className="flex w-full flex-col">
        <Header />
        <ScrollArea className="overflow-auto">
          <Outlet />
        </ScrollArea>
      </div>
    </ResizableSidebarProvider>
  );
}

function Header() {
  const { toggleSidebar } = useSidebar();

  const name = useMatches({
    // @ts-expect-error
    select: (matches) => (matches.at(-1)?.staticData?.name ?? "设置") as string,
  });

  return (
    <div className="grid w-full grid-cols-[1rem_1fr_1rem] items-center p-2">
      <Button variant="ghost" className="md:invisible" onClick={toggleSidebar}>
        <PanelLeftOpenIcon />
      </Button>

      <h1 className="grow text-center font-medium">{name}</h1>
    </div>
  );
}

function NavSettings() {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>{m.common()}</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={m.profile()}
              render={
                <Link to="/settings">
                  <CircleUserRoundIcon />
                  <span>{m.profile()}</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>{m.ai()}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={m.api_key()}
                render={
                  <Link to="/settings/api-key">
                    <KeyRoundIcon />
                    <span>{m.api_key()}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={m.provider()}
                render={
                  <Link to="/settings/provider">
                    <ServerIcon />
                    <span>{m.provider()}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={m.model()}
                render={
                  <Link to="/settings/model">
                    <BoxIcon />
                    <span>{m.model()}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>{m.misc()}</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={m.about()}
              render={
                <Link to="/settings/about">
                  <InfoIcon />
                  <span>{m.about()}</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
