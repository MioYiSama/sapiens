import { createFileRoute } from "@tanstack/react-router";

import { authClient } from "@/auth/client";
import { getCategoryList } from "@/lib/query";

export const Route = createFileRoute("/")({
  async loader() {
    return await getCategoryList();
  },
  component() {
    const data = Route.useLoaderData();
    const session = authClient.useSession();

    return (
      <div>
        <p>{JSON.stringify(data)}</p>
        <p>{JSON.stringify(session.data)}</p>
        <p>{import.meta.env.VITE_BETTER_AUTH_URL}</p>
      </div>
    );
  },
});
