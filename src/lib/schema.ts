import * as z from "zod";

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

export const ProviderSchema = z.object({
  name: z.string().trim().min(1),
  type: ProviderTypeSchema,
  apiKey: z.string().nullable(),
  baseUrl: z
    .string()
    .trim()
    .pipe(z.union([z.literal(""), z.url()]))
    .transform((value) => (value === "" ? null : value)),
});

export const ProviderServerSchema = ProviderSchema.extend({
  baseUrl: z.union([z.url(), z.null()]),
});
