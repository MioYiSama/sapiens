import { createAuthClient } from "better-auth/react";

import { showErrorToast } from "../utils";

export const authClient = createAuthClient({
  fetchOptions: {
    onError({ error }) {
      showErrorToast(error);
    },
  },
});

export type Session = typeof authClient.$Infer.Session;
