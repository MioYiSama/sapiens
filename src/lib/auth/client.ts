import { createAuthClient } from "better-auth/react";

import { toast } from "@/components/ui/toast";

import { m } from "../paraglide/messages";

export const authClient = createAuthClient({
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
