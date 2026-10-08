import { cn } from "cn";
import { create } from "zustand/react";
import { useShallow } from "zustand/react/shallow";

import { clamp } from "@/lib/utils";

import { Sidebar, SidebarProvider, SidebarRail, useSidebar } from "./ui/sidebar";

type ResizableSidebarState = {
  width: number;
  setWidth(value: number): void;
  dragging: boolean;
  setDragging(value: boolean): void;
  transitioning: boolean;
  triggerTransition(duration?: number): void;
};

const useResizableSidebarStore = create<ResizableSidebarState>()((set) => {
  let transitionTimer: ReturnType<typeof setTimeout> | null = null;

  return {
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
  };
});

export function ResizableSidebarProvider({
  style,
  className,
  ...props
}: React.ComponentProps<typeof SidebarProvider>) {
  const { width, disableTransition } = useResizableSidebarStore(
    useShallow((state) => ({
      width: state.width,
      disableTransition: state.dragging && !state.transitioning,
    })),
  );

  return (
    <SidebarProvider
      {...props}
      style={
        {
          "--sidebar-width": `${width}px`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "size-full **:duration-150",
        disableTransition && "**:transition-none",
        className,
      )}
    />
  );
}

export function ResizableSidebar({ children, ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {children}

      <ResizableSidebarRail />
    </Sidebar>
  );
}

function ResizableSidebarRail() {
  const { setWidth, dragging, setDragging, transitioning, triggerTransition } =
    useResizableSidebarStore();
  const { open, toggleSidebar } = useSidebar();

  function finalize() {
    setDragging(false);
  }

  return (
    <SidebarRail
      className="touch-none select-none max-md:hidden"
      onClick={undefined}
      aria-label={undefined}
      title={undefined}
      onPointerUp={finalize}
      onPointerCancel={finalize}
      onLostPointerCapture={finalize}
      onPointerDown={(e) => {
        if (!e.isPrimary || e.button !== 0 || dragging) return;

        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
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
