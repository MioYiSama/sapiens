import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { auth } from "./server";

export const getSession = createServerFn({ method: "GET" }).handler(async () => {
  return await auth.api.getSession({
    headers: getRequestHeaders(),
  });
});

export const ensureSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSession();

  if (session === null) {
    throw redirect({ to: "/signin" });
  }

  return session;
});

export const ensureNoSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getSession();

  if (session !== null) {
    throw redirect({ to: "/" });
  }
});
