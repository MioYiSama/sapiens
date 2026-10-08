import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronsUpDownIcon, LogOutIcon, SettingsIcon } from "lucide-react";

import { authClient, type Session } from "@/lib/auth/client";
import { m } from "@/lib/paraglide/messages";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export default function NavUser({ session }: { session: Session }) {
  const navigate = useNavigate();

  async function signOut() {
    await authClient.signOut();
    await navigate({ to: "/signin" });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" tooltip={m.account_settings()}>
                <Avatar>
                  <AvatarImage src={session.user.image ?? undefined} />
                  <AvatarFallback>{session.user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>

                <div className="flex min-w-0 flex-col leading-tight">
                  <span className="truncate">{session.user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {session.user.email}
                  </span>
                </div>

                <ChevronsUpDownIcon className="ml-auto" />
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent>
            <DropdownMenuItem
              nativeButton={false}
              render={
                <Link to="/settings">
                  <SettingsIcon />
                  <span>{m.settings()}</span>
                </Link>
              }
            />

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive" onClick={signOut}>
              <LogOutIcon />
              <span>{m.sign_out()}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
