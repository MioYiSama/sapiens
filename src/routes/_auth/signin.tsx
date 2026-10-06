import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { m } from "@/lib/paraglide/messages";

export const Route = createFileRoute("/_auth/signin")({
  component() {
    const navigate = Route.useNavigate();

    const form = useForm({
      defaultValues: {
        email: "mioyisama@gmail.com",
        password: "12345678",
      },
      validators: [
        {
          triggers: [],
          runOnSubmit: true,
          run: z.object({
            email: z.email(),
            password: z.string().min(8),
          }),
        },
      ],
      async onSubmit({ schemaOutputs: [value] }) {
        await authClient.signIn.email(value, {
          onSuccess() {
            navigate({ to: "/" });
          },
        });
      },
    });

    return (
      <div className="flex size-full items-center justify-center p-6">
        <Card className="w-xs">
          <CardHeader>
            <CardTitle>{m.sign_in()}</CardTitle>
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
                      <FieldLabel>{m.email()}</FieldLabel>
                      <Input
                        type="email"
                        value={field.value}
                        onInput={(e) => field.handleChange(e.currentTarget.value)}
                      />
                      {field.errors.length > 0 && (
                        <FieldDescription>
                          {field.errors.map((error) => error.message).join("\n")}
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                </form.Field>

                <form.Field name="password">
                  {(field) => (
                    <Field>
                      <FieldLabel>{m.password()}</FieldLabel>
                      <Input
                        type="password"
                        value={field.value}
                        onInput={(e) => field.handleChange(e.currentTarget.value)}
                      />
                      {field.errors.length > 0 && (
                        <FieldDescription>
                          {field.errors.map((error) => error.message).join("\n")}
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                </form.Field>

                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <FieldGroup>
                      <Field>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? <Spinner /> : m.sign_in()}
                        </Button>
                        <Button
                          disabled={isSubmitting}
                          variant="ghost"
                          render={(props) => (
                            <Link {...props} to="/signup">
                              {m.sign_up()}
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
      </div>
    );
  },
});
