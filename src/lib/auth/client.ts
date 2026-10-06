import { createAuthClient } from "better-auth/react";

import { toast } from "@/components/ui/toast";

import { m } from "../paraglide/messages";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL,
  fetchOptions: {
    onError({ error }) {
      toast.add({
        type: "error",
        title: m.auth_error(),
        description: error.message,
        priority: "high",
      });
    },
  },
});
