import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/agent")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/settings/agent"!</div>;
}
