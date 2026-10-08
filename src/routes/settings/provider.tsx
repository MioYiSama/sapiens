import { createFileRoute } from "@tanstack/react-router";

import { m } from "@/lib/paraglide/messages";

export const Route = createFileRoute("/settings/provider")({
  staticData: {
    name: m.provider(),
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/settings/provider"!</div>;
}
