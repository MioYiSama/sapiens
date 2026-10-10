import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import {
  BoxIcon,
  CircleUserRoundIcon,
  InfoIcon,
  KeyRoundIcon,
  LucideIcon,
  PanelLeftOpenIcon,
  ServerIcon,
  SparklesIcon,
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
import type { FileRouteTypes } from "@/routeTree.gen";

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

const Navigations = [
  {
    group: m.common(),
    items: [
      {
        label: m.profile(),
        icon: CircleUserRoundIcon,
        to: "/settings",
      },
    ],
  },
  {
    group: m.ai(),
    items: [
      {
        label: m.api_key(),
        icon: KeyRoundIcon,
        to: "/settings/api-key",
      },
      {
        label: m.provider(),
        icon: ServerIcon,
        to: "/settings/provider",
      },
      {
        label: m.model(),
        icon: BoxIcon,
        to: "/settings/model",
      },
      {
        label: m.agent(),
        icon: SparklesIcon,
        to: "/settings/agent",
      },
    ],
  },
  {
    group: m.misc(),
    items: [
      {
        label: m.about(),
        icon: InfoIcon,
        to: "/settings/about",
      },
    ],
  },
] satisfies Array<{
  group: string;
  items: Array<{
    label: string;
    icon: LucideIcon;
    to: FileRouteTypes["to"];
  }>;
}>;

function NavSettings() {
  return Navigations.map((navigation) => (
    <SidebarGroup key={navigation.group}>
      <SidebarGroupLabel>{navigation.group}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navigation.items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                tooltip={item.label}
                render={
                  <Link to={item.to}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}
