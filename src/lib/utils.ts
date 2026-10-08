import * as z from "zod";
import { en, zhCN } from "zod/locales";

import { toast } from "@/components/ui/toast";

import { m } from "./paraglide/messages";
import { getLocale } from "./paraglide/runtime";

export { cn } from "cn";

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function configureZodLocale() {
  switch (getLocale()) {
    case "en":
      z.config(en());
      break;
    case "zh":
      z.config(zhCN());
      break;
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}

export function formatError(error: unknown) {
  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error && "message" in error) {
    return String(error.message);
  }

  return String(error);
}

export function showErrorToast(error: unknown) {
  toast.add({
    type: "error",
    priority: "high",
    title: m.error_occur(),
    description: formatError(error),
  });
}
