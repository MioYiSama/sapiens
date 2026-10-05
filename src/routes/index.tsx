import { createFileRoute } from "@tanstack/react-router";

import { m } from "@/lib/paraglide/messages";

export const Route = createFileRoute("/")({
  component() {
    return <div>{m.example_message({ username: "admin" })}</div>;
  },
});
