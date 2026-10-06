import { Link } from "@tanstack/react-router";
import { EditIcon, OrbitIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { create } from "zustand/react";

import { m } from "@/lib/paraglide/messages";
import { cn } from "@/lib/utils";
import { clamp } from "@/lib/utils";

import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  useSidebar,
} from "./ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type SidebarState = {
  width: number;
  setWidth(value: number): void;
  dragging: boolean;
  setDragging(value: boolean): void;
  transitioning: boolean;
  triggerTransition(duration?: number): void;
};

let transitionTimer: ReturnType<typeof setTimeout> | null = null;

const useSidebarStore = create<SidebarState>()((set) => ({
  width: 256,
  setWidth(value) {
    set({ width: value });
  },
  dragging: false,
  setDragging(value) {
    set({ dragging: value });
  },
  transitioning: false,
  triggerTransition(duration = 150) {
    if (transitionTimer) clearTimeout(transitionTimer);

    set({ transitioning: true });

    transitionTimer = setTimeout(() => {
      set({ transitioning: false });
    }, duration);
  },
}));

export function AppSidebarProvider({ children }: { children: React.ReactNode }) {
  const { width, dragging, transitioning } = useSidebarStore();

  return (
    <SidebarProvider
      className={cn(
        "size-full **:duration-150",
        dragging && !transitioning && "**:transition-none",
      )}
      style={
        {
          "--sidebar-width": `${width}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </SidebarProvider>
  );
}

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <AppSidebarHeader />
      </SidebarHeader>

      <SidebarContent>
        <AppSidebarMain />
      </SidebarContent>

      <SidebarFooter>
        <AppSidebarFooter />
      </SidebarFooter>

      <AppSidebarRail />
    </Sidebar>
  );
}

function AppSidebarRail() {
  const { setWidth, dragging, setDragging, transitioning, triggerTransition } = useSidebarStore();
  const { open, toggleSidebar } = useSidebar();

  return (
    <SidebarRail
      onClick={undefined}
      onPointerDown={(e) => {
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerUp={(e) => {
        setDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragging) return;

        const width = e.clientX;

        if (open && width < 96) {
          triggerTransition();
          toggleSidebar();
          return;
        }

        if (!open && width > 128) {
          triggerTransition();
          toggleSidebar();
          return;
        }

        if (!transitioning) {
          setWidth(clamp(width, 128, 480));
        }
      }}
    />
  );
}

function AppSidebarHeader() {
  const { open, toggleSidebar } = useSidebar();

  return (
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
  );
}

function AppSidebarMain() {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>{m.conversation()}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <EditIcon />
                <span>TODO</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>{m.graph()}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <EditIcon />
                <span>TODO</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}

function AppSidebarFooter() {
  return (
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
  );
}
