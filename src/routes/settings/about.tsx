import { createFileRoute } from "@tanstack/react-router";
import { FolderGit2Icon, OrbitIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Item } from "@/components/ui/item";
import { m } from "@/lib/paraglide/messages";

export const Route = createFileRoute("/settings/about")({
  staticData: {
    name: m.about(),
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex w-fit flex-col gap-4 p-4">
      <div className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1">
        <OrbitIcon className="row-span-2 size-12" />
        <p className="text-lg font-medium">Sapiens</p>
        <Badge>v{__VERSION__}</Badge>
      </div>

      <Item
        variant="outline"
        render={
          <a href={__REPOSITORY_URL__} target="_blank">
            <FolderGit2Icon />
            <span>{m.repository()}</span>
          </a>
        }
      />
    </div>
  );
}
