import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { m } from "@/lib/paraglide/messages";

export const Route = createFileRoute("/_auth/signup")({
  component() {
    const navigate = Route.useNavigate();

    const form = useForm({
      defaultValues: {
        email: "mioyisama@gmail.com",
        name: "MioYi",
        password: "12345678",
      },
      validators: [
        {
          triggers: [],
          runOnSubmit: true,
          run: z.object({
            email: z.email(),
            name: z.string().trim().min(1),
            password: z.string().min(8),
          }),
        },
      ],
      async onSubmit({ schemaOutputs: [value] }) {
        await authClient.signUp.email(value, {
          onSuccess() {
            navigate({ to: "/" });
          },
        });
      },
    });

    return (
      <Card>
        <CardHeader>
          <CardTitle>{m.sign_up()}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="email">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>{m.email()}</FieldLabel>
                    <Input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.meta.isInvalid && <FieldError errors={field.errors} />}
                  </Field>
                )}
              </form.Field>

              <form.Field name="name">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>{m.name()}</FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      name={field.name}
                      value={field.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.meta.isInvalid && <FieldError errors={field.errors} />}
                  </Field>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>{m.password()}</FieldLabel>
                    <Input
                      type="password"
                      id={field.name}
                      name={field.name}
                      value={field.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {field.meta.isInvalid && <FieldError errors={field.errors} />}
                  </Field>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <FieldGroup>
                    <Field>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner /> : m.sign_up()}
                      </Button>
                      <Button
                        disabled={isSubmitting}
                        variant="ghost"
                        nativeButton={false}
                        render={(props) => (
                          <Link {...props} to="/signin">
                            {m.sign_in()}
                          </Link>
                        )}
                      />
                    </Field>
                  </FieldGroup>
                )}
              </form.Subscribe>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    );
  },
});
