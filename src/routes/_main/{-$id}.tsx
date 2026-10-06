import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusIcon, SendIcon } from "lucide-react";

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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { m } from "@/lib/paraglide/messages";

export const Route = createFileRoute("/_main/{-$id}")({
  component() {
    const { id } = Route.useParams();

    return (
      <main className="flex size-full flex-col items-center p-4">
        <div className="flex size-full max-w-xl flex-col items-center">
          <div className="flex w-full grow flex-col gap-4">
            <Bubble align="start">
              <BubbleContent>
                id is "{id}" ({typeof id})
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
  return (
    <InputGroup>
      <InputGroupTextarea rows={4} />

      <InputGroupAddon align="block-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={(props) => (
              <Tooltip>
                <TooltipTrigger
                  {...props}
                  render={(props) => (
                    <InputGroupButton {...props}>
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

        <Tooltip>
          <TooltipTrigger
            render={(props) => (
              <InputGroupButton
                {...props}
                type="submit"
                variant="default"
                size="icon-sm"
                className="ml-auto"
              >
                <SendIcon />
              </InputGroupButton>
            )}
          />
          <TooltipContent>
            <p>{m.send_message()}</p>
          </TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  );
}
