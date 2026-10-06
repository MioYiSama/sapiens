import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, OrbitIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { m } from "@/lib/paraglide/messages";

export const Route = createFileRoute("/")({
  component() {
    return (
      <SidebarProvider>
        <AppSidebar />

        <main>
          <SidebarTrigger />
        </main>
      </SidebarProvider>
    );
  },
});

function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row items-center">
            {open ? (
              <>
                <SidebarMenuButton
                  className="mr-auto w-min"
                  render={(props) => (
                    <Link {...props} to="/">
                      <OrbitIcon className="size-4" />
                      <span>Sapiens</span>
                    </Link>
                  )}
                />

                <Tooltip>
                  <TooltipTrigger
                    render={(props) => (
                      <Button {...props} variant="ghost" onClick={toggleSidebar}>
                        <PanelLeftCloseIcon />
                      </Button>
                    )}
                  />
                  <TooltipContent>
                    <p>{m.hide_sidebar()}</p>
                  </TooltipContent>
                </Tooltip>
              </>
            ) : (
              <SidebarMenuButton
                tooltip={m.show_sidebar()}
                className="group/sbar"
                onClick={toggleSidebar}
              >
                <OrbitIcon className="block group-hover/sbar:hidden" />
                <PanelLeftOpenIcon className="hidden group-hover/sbar:block" />
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={m.conversation()}>
                <MessageCircle />
                <span>{m.conversation()}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip={m.account_settings()}>
              <Avatar>
                <AvatarFallback>MY</AvatarFallback>
              </Avatar>
              <span>MioYi</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
