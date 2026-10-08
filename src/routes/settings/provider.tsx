import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { PlusIcon, TrashIcon, TriangleAlertIcon } from "lucide-react";

import { AnthropicIcon, GoogleIcon, IconComponent, OpenAiIcon } from "@/components/icons";
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
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { addProvider, deleteProvider, listApiKey, listProvider } from "@/lib/db/functions";
import { m } from "@/lib/paraglide/messages";
import { ProviderSchema, ProviderType, ProviderTypes } from "@/lib/schema";
import { showErrorToast } from "@/lib/utils";

export const Route = createFileRoute("/settings/provider")({
  staticData: {
    name: m.provider(),
  },
  async loader() {
    return {
      providers: await listProvider(),
      apiKeyList: await listApiKey(),
    };
  },
  component: RouteComponent,
});

function ProviderIcon({
  type,
  ...props
}: { type: ProviderType } & React.ComponentProps<IconComponent>) {
  switch (type) {
    case "chat_completions":
    case "responses":
      return <OpenAiIcon {...props} />;
    case "messages":
      return <AnthropicIcon {...props} />;
    case "generate_content":
    case "interactions":
      return <GoogleIcon {...props} />;
  }
}

const ProviderTypeLabel = {
  chat_completions: "/chat/completions",
  responses: "/responses",
  messages: "/messages",
  generate_content: "/{model}:streamGenerateContent",
  interactions: "/interactions",
} satisfies Record<ProviderType, string>;

const ProviderTypeSelectItems = ProviderTypes.map((type) => ({
  label: ProviderTypeLabel[type],
  value: type,
}));

function RouteComponent() {
  const { providers } = Route.useLoaderData();
  const router = useRouter();

  return (
    <div className="p-4">
      <div className="mb-4">
        <AddProviderDialog />
      </div>

      <ul className="flex flex-col gap-4">
        {providers.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyDescription>暂无供应商</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          providers.map((provider) => (
            <li key={provider.id}>
              <Item variant="outline">
                <ItemMedia>
                  <ProviderIcon type={provider.type} className="size-6" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{provider.name}</ItemTitle>
                  <ItemDescription>
                    {provider.baseUrl ?? ""}
                    {ProviderTypeLabel[provider.type]}
                  </ItemDescription>
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
                          {m.delete_provider_alert({ name: provider.name })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>{m.cancel()}</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={async () => {
                            await deleteProvider({ data: provider.id });
                            router.invalidate();
                          }}
                        >
                          {m.confirm()}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </ItemActions>
              </Item>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function AddProviderDialog() {
  const handle = DialogPrimitive.createHandle();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      type: "chat_completions" as ProviderType,
      apiKey: null as string | null,
      baseUrl: "",
    },
    validators: [
      {
        triggers: [],
        runOnSubmit: true,
        run: ProviderSchema,
      },
    ],
    async onSubmit({ schemaOutputs: [data] }) {
      try {
        await addProvider({ data });
        handle.close();
        router.invalidate();
        form.reset();
      } catch (error) {
        showErrorToast(error);
      }
    },
  });

  const { apiKeyList } = Route.useLoaderData();

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
          <DialogHeader>{m.add_provider()}</DialogHeader>

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
                  />
                  {field.meta.isInvalid && <FieldError errors={field.errors} />}
                </Field>
              )}
            </form.Field>

            <form.Field name="type">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{m.type()}</FieldLabel>

                  <Select
                    id={field.name}
                    name={field.name}
                    items={ProviderTypeSelectItems}
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.handleChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {ProviderTypeSelectItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  {field.meta.isInvalid && <FieldError errors={field.errors} />}
                </Field>
              )}
            </form.Field>

            <form.Field name="apiKey">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {m.api_key()}
                    {m.optional()}
                  </FieldLabel>

                  <Combobox
                    id={field.name}
                    name={field.name}
                    value={field.value}
                    onValueChange={(value) => field.handleChange(value)}
                    items={apiKeyList}
                    itemToStringLabel={(id) =>
                      apiKeyList.find((item) => item.id === id)?.name ?? id
                    }
                  >
                    <ComboboxInput />

                    <ComboboxContent>
                      <ComboboxList>
                        {(item: (typeof apiKeyList)[number]) => (
                          <ComboboxItem key={item.id} value={item.id}>
                            {item.name}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>

                  {field.meta.isInvalid && <FieldError errors={field.errors} />}
                </Field>
              )}
            </form.Field>

            <form.Field name="baseUrl">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>
                    {m.base_url()}
                    {m.optional()}
                  </FieldLabel>
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
