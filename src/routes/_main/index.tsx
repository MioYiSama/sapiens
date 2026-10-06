import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex size-full flex-col items-center justify-center-safe">Hello "/_main/"!</div>
  );
}
