import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { getSession } from "@/lib/auth/functions";

export const Route = createFileRoute("/_auth")({
  async beforeLoad() {
    const session = await getSession();

    if (session) {
      throw redirect({ to: "/" });
    }
  },
  component() {
    return (
      <div className="flex size-full items-center justify-center">
        <div className="w-xs">
          <Outlet />
        </div>
      </div>
    );
  },
});
