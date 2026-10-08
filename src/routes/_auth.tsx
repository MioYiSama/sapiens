import { createFileRoute, Outlet } from "@tanstack/react-router";

import { ensureNoSession } from "@/lib/auth/functions";

export const Route = createFileRoute("/_auth")({
  async beforeLoad() {
    await ensureNoSession();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex size-full items-center justify-center">
      <div className="w-xs">
        <Outlet />
      </div>
    </div>
  );
}
