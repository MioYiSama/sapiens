import * as z from "zod";
import { en, zhCN } from "zod/locales";

import { getLocale } from "./paraglide/runtime";

export { cn } from "cn";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

let configured = false;
export function configureZodLocale() {
  if (configured) return;

  switch (getLocale()) {
    case "en":
      z.config(en());
      break;
    case "zh":
      z.config(zhCN());
      break;
  }

  configured = true;
}
