import { Link } from "@tanstack/react-router";
import { OrbitIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

import { m } from "@/lib/paraglide/messages";

import { Button } from "./ui/button";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function AppSidebarHeader() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex flex-row items-center">
        {open ? (
          <>
            <SidebarMenuButton
              className="mr-auto w-min font-medium"
              render={
                <Link to="/">
                  <OrbitIcon className="size-4" />
                  <span>Sapiens</span>
                </Link>
              }
            />

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" onClick={toggleSidebar}>
                    <PanelLeftCloseIcon />
                  </Button>
                }
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
  );
}
