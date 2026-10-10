import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  BoxIcon,
  EditIcon,
  PlusIcon,
  SquareArrowOutUpRightIcon,
  TrashIcon,
  TriangleAlertIcon,
} from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { addModel, deleteModel, listProviderWithModel } from "@/lib/db/functions";
import { m } from "@/lib/paraglide/messages";
import { ModelSchema, ReasoningEffort, ReasoningEfforts } from "@/lib/schema";
import { showErrorToast } from "@/lib/utils";

export const Route = createFileRoute("/settings/model")({
  staticData: {
    name: m.model(),
  },
  async loader() {
    return {
      providers: await listProviderWithModel(),
    };
  },
  component: RouteComponent,
});

type Model = Awaited<ReturnType<typeof listProviderWithModel>>[number]["models"][number];

function RouteComponent() {
  const { providers } = Route.useLoaderData();

  if (providers.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyDescription>
            {m.no_provider()}
            <br />
            {m.add_provider_fisrt()}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            nativeButton={false}
            render={
              <Link to="/settings/provider">
                <SquareArrowOutUpRightIcon />
                <span>{m.goto_provider_page()}</span>
              </Link>
            }
          />
        </EmptyContent>
      </Empty>
    );
  }

  const models = providers.flatMap((provider) => provider.models);
  if (models.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyDescription>{m.no_model()}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ModelDialog />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <ModelDialog />

      <ul className="grid gap-4 md:grid-cols-2">
        {models.map((model) => (
          <li key={model.id}>
            <ModelItem model={model} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ModelItem({ model }: { model: Model }) {
  const router = useRouter();

  async function onDelete() {
    await deleteModel({ data: model.id });
    await router.invalidate();
  }

  return (
    <Item variant="outline">
      <ItemMedia>
        <BoxIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{model.identifier}</ItemTitle>
        <ItemDescription>
          {m.reasoning_effort_desc({ effort: model.reasoningEffort })}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <ModelDialog model={model} />

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="destructive" size="icon">
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
                {m.delete_model_alert({ name: model.identifier })}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>{m.cancel()}</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={onDelete}>
                {m.confirm()}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ItemActions>
    </Item>
  );
}

const ReasoningEffortMapping = Object.fromEntries(
  ReasoningEfforts.map((effort, index) => [effort, index]),
);

function ModelDialog({ model }: { model?: Model }) {
  const isAdd = model === undefined;
  const handle = DialogPrimitive.createHandle();
  const router = useRouter();

  const { providers } = Route.useLoaderData();
  const items = providers.map((provider) => ({
    label: provider.name,
    value: provider.id,
  }));

  const form = useForm({
    defaultValues: {
      identifier: "",
      providerId: providers[0]!.id,
      reasoningEffort: "high" as ReasoningEffort,
    },
    validators: [
      {
        triggers: [],
        runOnSubmit: true,
        run: ModelSchema,
      },
    ],
    async onSubmit({ schemaOutputs: [data] }) {
      try {
        if (isAdd) {
          await addModel({ data });
        } else {
        }

        handle.close();
        router.invalidate();
      } catch (error) {
        showErrorToast(error);
      }
    },
  });

  return (
    <Dialog handle={handle}>
      <DialogTrigger
        render={
          isAdd ? (
            <Button>
              <PlusIcon />
              <span>{m.add()}</span>
            </Button>
          ) : (
            <Button variant="outline" size="icon">
              <EditIcon />
            </Button>
          )
        }
      />

      <DialogContent className="max-md:max-w-none">
        <form
          className="contents"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader>{isAdd ? m.add_model() : m.edit_model()}</DialogHeader>

          <FieldGroup>
            <form.Field name="providerId">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{m.provider()}</FieldLabel>
                  <Select
                    items={items}
                    value={field.value}
                    onValueChange={(value) => field.handleChange(value!)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {items.map((item) => (
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

            <form.Field name="identifier">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{m.identifier()}</FieldLabel>
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

            <form.Field name="reasoningEffort">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>{m.reasoning_effort()}</FieldLabel>

                  <Slider
                    min={0}
                    max={ReasoningEfforts.length - 1}
                    step={1}
                    value={ReasoningEffortMapping[field.value]}
                    onValueChange={(value) => field.handleChange(ReasoningEfforts[value as number])}
                  />
                  <div className="relative select-none">
                    {ReasoningEfforts.map((effort, index) => (
                      <span
                        key={effort}
                        className="text-muted-foreground absolute -translate-x-1/2 text-xs"
                        style={{ left: `${(index / (ReasoningEfforts.length - 1)) * 100}%` }}
                      >
                        {effort}
                      </span>
                    ))}
                  </div>

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
                  {isSubmitting ? <Spinner /> : isAdd ? m.add() : m.save()}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
