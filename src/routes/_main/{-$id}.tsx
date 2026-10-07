import { fetchServerSentEvents, useChat } from "@tanstack/ai-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { createFileRoute, Link } from "@tanstack/react-router";
import { cn } from "cn";
import { PlusIcon, SendIcon } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import * as z from "zod";

import { AnthropicIcon, GoogleIcon, OpenAiIcon } from "@/components/icons";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { toast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { m } from "@/lib/paraglide/messages";

const ParamsSchema = z.object({
  id: z.uuid().optional(),
});

export const Route = createFileRoute("/_main/{-$id}")({
  params: {
    parse(params) {
      const { success, data } = ParamsSchema.safeParse(params);
      return success ? data : false;
    },
  },
  loader() {
    return { uuid: crypto.randomUUID() };
  },
  component() {
    const { uuid } = Route.useLoaderData();

    const { id } = Route.useParams();

    if (id === undefined) {
      return (
        <main className="flex size-full flex-col items-center p-4">
          <div className="flex size-full max-w-xl flex-col items-center justify-center gap-6">
            <h1 className="text-xl">{m.welcome()}</h1>
            <Link to="/{-$id}" params={{ id: uuid }}>
              {uuid}
            </Link>
            <ChatInput />
          </div>
        </main>
      );
    }

    return (
      <main className="flex size-full flex-col items-center p-4">
        <div className="flex size-full max-w-xl flex-col items-center">
          <div className="flex w-full grow flex-col gap-4">
            <Bubble align="start">
              <BubbleContent>
                id is "{id}" ({typeof id})
                <AnthropicIcon />
                <GoogleIcon />
                <OpenAiIcon />
              </BubbleContent>
            </Bubble>

            <Bubble variant="secondary" align="end">
              <BubbleContent>
                <Link to="/{-$id}" params={{ id: "1111-1111" }}>
                  go to http://localhost:5173/zh/1111-1111
                </Link>
              </BubbleContent>
            </Bubble>

            <Bubble variant="secondary" align="end">
              <BubbleContent>
                I checked the registry output and removed the stale route.
              </BubbleContent>
            </Bubble>
          </div>

          <ChatInput />
        </div>
      </main>
    );
  },
});

function ChatInput() {
  useHotkey("Mod+Enter", () => {
    alert(1);
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [multiline, setMultiline] = useState(false);
  const navigate = Route.useNavigate();

  const { id } = Route.useParams();

  const { messages, sendMessage } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
    threadId: id,
    onError(error) {
      toast.add({
        type: "error",
        title: "Error",
        description: error.message,
      });
    },
  });

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const group = textarea.parentElement!;
    // Capture inline spacing before the addons move, including padding and margins.
    const inlineReservedWidth = group.clientWidth - textarea.getBoundingClientRect().width;
    const probe = textarea.cloneNode() as HTMLTextAreaElement;
    probe.removeAttribute("data-slot");
    probe.setAttribute("aria-hidden", "true");
    probe.tabIndex = -1;
    Object.assign(probe.style, {
      position: "absolute",
      visibility: "hidden",
      pointerEvents: "none",
      height: "0",
      minHeight: "0",
      overflow: "hidden",
      fieldSizing: "fixed",
    });
    group.appendChild(probe);

    let singleLineHeight = 0;

    // Always measure at the inline width, so moving buttons cannot undo wrapping.
    const measure = () => {
      probe.value = textarea.value;
      setMultiline(probe.scrollHeight > singleLineHeight + 1);
    };

    // Typography can change at responsive breakpoints; refresh it with the width.
    const measureLayout = () => {
      probe.style.width = `${Math.max(0, group.clientWidth - inlineReservedWidth)}px`;
      const style = getComputedStyle(probe);
      singleLineHeight =
        parseFloat(style.lineHeight) +
        parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom);
      measure();
    };

    const observer = new ResizeObserver(measureLayout);
    observer.observe(group);
    textarea.addEventListener("input", measure);
    measureLayout();

    return () => {
      observer.disconnect();
      textarea.removeEventListener("input", measure);
      probe.remove();
    };
  }, []);

  const sendButton = (
    <Tooltip>
      <TooltipTrigger
        render={(props) => (
          <InputGroupButton
            {...props}
            type="submit"
            variant="default"
            size="icon-sm"
            className={cn("rounded-full", multiline && "ml-auto")}
            onClick={async () => {
              await sendMessage(textareaRef.current!.value);
              textareaRef.current!.value = "";
            }}
          >
            <SendIcon />
          </InputGroupButton>
        )}
      />
      <TooltipContent>
        <p>{m.send_message()}</p>
      </TooltipContent>
    </Tooltip>
  );

  const attachmentButton = (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props) => (
          <Tooltip>
            <TooltipTrigger
              {...props}
              render={(props) => (
                <InputGroupButton {...props} size="icon-sm" className="rounded-full">
                  <PlusIcon />
                </InputGroupButton>
              )}
            />
            <TooltipContent>
              <p>{m.add_attachment()}</p>
            </TooltipContent>
          </Tooltip>
        )}
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>TODO</DropdownMenuItem>
          <DropdownMenuItem>TODO</DropdownMenuItem>
          <DropdownMenuItem>TODO</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <InputGroup className={cn("rounded-[2rem]", multiline ? "py-1" : "px-1")}>
      <InputGroupTextarea
        ref={textareaRef}
        rows={1}
        className={cn("min-h-0 min-w-0 max-h-64 scrollbar-none", multiline && "px-4 pt-3")}
      />

      {multiline ? (
        <InputGroupAddon align="block-end">
          {attachmentButton}
          {sendButton}
        </InputGroupAddon>
      ) : (
        <>
          <InputGroupAddon align="inline-start">{attachmentButton}</InputGroupAddon>
          <InputGroupAddon align="inline-end">{sendButton}</InputGroupAddon>
        </>
      )}
    </InputGroup>
  );
}
