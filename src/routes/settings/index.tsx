import { useForm, useSelector } from "@tanstack/react-form";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { XIcon } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import * as z from "zod";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { m } from "@/lib/paraglide/messages";
import { fileToBase64 } from "@/lib/utils";

export const Route = createFileRoute("/settings/")({
  staticData: {
    name: m.profile(),
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const router = useRouter();

  const fileInput = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      name: session.user.name,
      image: (session.user.image ?? null) as File | string | null,
    },
    validators: [
      {
        triggers: [],
        runOnSubmit: true,
        run: z.object({
          name: z.string().trim().min(1),
          image: z
            .union([z.string(), z.instanceof(File)])
            .nullable()
            .refine((image) => !(image instanceof File) || image.size <= 1024 * 1024, {
              error: m.avatar_size_limit({ size: "1 MB" }),
            })
            .transform((image) => (image instanceof File ? fileToBase64(image) : image)),
        }),
      },
    ],
    async onSubmit({ schemaOutputs: [value] }) {
      await authClient.updateUser(value);
      router.invalidate();
    },
  });

  const imageState = useSelector(form.atom, (state) => state.values.image);

  const preview = useMemo(
    () => (imageState instanceof File ? URL.createObjectURL(imageState) : imageState),
    [imageState],
  );

  useEffect(() => {
    if (imageState instanceof File) {
      return () => {
        if (preview) URL.revokeObjectURL(preview);
      };
    }
  }, [imageState, preview]);

  return (
    <div className="p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.Field name="name">
            {(field) => (
              <Field orientation="horizontal">
                <FieldLabel htmlFor={field.name} className="flex-none!">
                  {m.name()}
                </FieldLabel>
                <Input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="max-w-64"
                />
                {field.meta.isInvalid && <FieldError errors={field.errors} />}
              </Field>
            )}
          </form.Field>

          <form.Field name="image">
            {(field) => (
              <Field orientation="horizontal">
                <FieldLabel htmlFor={field.name} className="flex-none!">
                  {m.avatar()}
                </FieldLabel>

                <Button
                  variant="ghost"
                  size="icon-lg"
                  onClick={() => fileInput.current?.click()}
                  nativeButton={false}
                  render={
                    <Avatar size="lg">
                      <AvatarImage src={preview ?? undefined} />
                      <AvatarFallback>{session.user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  }
                />

                <Button variant="destructive" onClick={() => field.handleChange(null)}>
                  <XIcon />
                  <span>{m.clear()}</span>
                </Button>

                <Input
                  type="file"
                  ref={fileInput}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.files?.[0] ?? null)}
                  className="hidden"
                />

                {field.meta.isInvalid && <FieldError errors={field.errors} />}
              </Field>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <Field orientation="horizontal">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : m.save()}
                </Button>
              </Field>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>
    </div>
  );
}
