import { createFileRoute } from "@tanstack/react-router";

import { m } from "@/lib/paraglide/messages";

export const Route = createFileRoute("/settings/model")({
  staticData: {
    name: m.model(),
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/settings/model"!</div>;
}
