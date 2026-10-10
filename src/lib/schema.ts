import * as z from "zod";

import { m } from "./paraglide/messages";
import { fileToBase64 } from "./utils";

export const ProviderTypes = [
  "chat_completions",
  "responses",
  "messages",
  "generate_content",
  "interactions",
] as const;
export const ProviderTypeSchema = z.enum(ProviderTypes);
export type ProviderType = z.infer<typeof ProviderTypeSchema>;

export const ReasoningEfforts = [
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
] as const;
export const ReasoningEffortSchema = z.enum(ReasoningEfforts);
export type ReasoningEffort = z.infer<typeof ReasoningEffortSchema>;

export const SignInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const SignUpSchema = z.object({
  email: z.email(),
  name: z.string().trim().min(1),
  password: z.string().min(8),
});

export const ApiKeySchema = z.object({
  name: z.string().trim().min(1),
  value: z.string(),
});

export const ProfileSchema = z.object({
  name: z.string().trim().min(1),
  image: z
    .union([z.string(), z.instanceof(File), z.null()])
    .refine((image) => !(image instanceof File) || image.size <= 1024 * 1024, {
      error: m.avatar_size_limit({ size: "1 MB" }),
    })
    .transform((image) => (image instanceof File ? fileToBase64(image) : image)),
});

export const ProviderSchema = z.object({
  name: z.string().trim().min(1),
  type: ProviderTypeSchema,
  apiKeyId: z.uuid().nullable(),
  baseUrl: z.union([
    z.null(),
    z
      .string()
      .trim()
      .pipe(z.union([z.literal(""), z.url()]))
      .transform((value) => (value === "" ? null : value)),
  ]),
});

export const ProviderServerSchema = z.object({
  ...ProviderSchema.shape,
  baseUrl: z.union([z.url(), z.null()]),
});

export const ModelSchema = z.object({
  identifier: z.string().min(1),
  providerId: z.uuid(),
  reasoningEffort: ReasoningEffortSchema,
});
