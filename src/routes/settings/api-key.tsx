import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { KeyRoundIcon, PlusIcon, TrashIcon, TriangleAlertIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader } from "@/components/ui/empty";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { addApiKey, deleteApiKey, listApiKey } from "@/lib/db/functions";
import { m } from "@/lib/paraglide/messages";
import { ApiKeySchema } from "@/lib/schema";
import { showErrorToast } from "@/lib/utils";

export const Route = createFileRoute("/settings/api-key")({
  staticData: {
    name: m.api_key(),
  },
  async loader() {
    return {
      apiKeyList: await listApiKey(),
    };
  },
  component: RouteComponent,
});

type ApiKey = Awaited<ReturnType<typeof listApiKey>>[number];

function RouteComponent() {
  const { apiKeyList } = Route.useLoaderData();

  if (apiKeyList.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyDescription>{m.no_api_key()}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <AddApiKeyDialog />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <AddApiKeyDialog />

      <ul className="grid gap-4 md:grid-cols-2">
        {apiKeyList.map((apiKey) => (
          <li key={apiKey.id}>
            <ApiKeyItem apiKey={apiKey} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApiKeyItem({ apiKey }: { apiKey: ApiKey }) {
  const router = useRouter();

  async function onDelete() {
    try {
      await deleteApiKey({ data: apiKey.id });
      await router.invalidate();
    } catch (error) {
      showErrorToast(error);
    }
  }

  return (
    <Item variant="outline">
      <ItemMedia>
        <KeyRoundIcon />
      </ItemMedia>

      <ItemContent>
        <ItemTitle>{apiKey.name}</ItemTitle>
        <ItemDescription>{m.format_datetime({ date: apiKey.createdAt })}</ItemDescription>
      </ItemContent>

      <ItemActions>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="destructive">
                <TrashIcon />
              </Button>
            }
          />

          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive">
                <TriangleAlertIcon />
              </AlertDialogMedia>
              <AlertDialogTitle>{m.warning()}</AlertDialogTitle>
              <AlertDialogDescription>
                {m.delete_api_key_alert({ name: apiKey.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogAction variant="destructive" onClick={onDelete}>
                {m.confirm()}
              </AlertDialogAction>
              <AlertDialogCancel>{m.cancel()}</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ItemActions>
    </Item>
  );
}

function AddApiKeyDialog() {
  const handle = DialogPrimitive.createHandle();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      value: "",
    },
    validators: [
      {
        triggers: [],
        runOnSubmit: true,
        run: ApiKeySchema,
      },
    ],
    async onSubmit({ schemaOutputs: [value] }) {
      try {
        await addApiKey({ data: value });
        handle.close();
        form.reset();
        await router.invalidate();
      } catch (error) {
        showErrorToast(error);
      }
    },
  });

  return (
    <Dialog handle={handle}>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon />
            <span>{m.add()}</span>
          </Button>
        }
      />

      <DialogContent>
        <form
          className="contents"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>{m.add_api_key()}</DialogTitle>
          </DialogHeader>

          <FieldGroup>
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
                    aria-invalid={field.meta.isInvalid}
                  />
                  {field.meta.isInvalid && <FieldError errors={field.errors} />}
                </Field>
              )}
            </form.Field>

            <form.Field name="value">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{m.value()}</FieldLabel>
                  <Input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={field.meta.isInvalid}
                  />
                  {field.meta.isInvalid && <FieldError errors={field.errors} />}
                </Field>
              )}
            </form.Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose>{m.cancel()}</DialogClose>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : m.add()}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
