import { createFileRoute } from "@tanstack/react-router";

import { Slider } from "@/components/ui/slider";
import { ReasoningEfforts } from "@/lib/schema";

export const Route = createFileRoute("/_main/graph")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-md px-5">
      <Slider min={0} max={ReasoningEfforts.length - 1} step={1} />
      <div className="relative h-8 select-none" aria-hidden>
        {ReasoningEfforts.map((effort, index) => (
          <span
            key={effort}
            className="absolute -translate-x-1/2 text-sm"
            style={{ left: `${(index / (ReasoningEfforts.length - 1)) * 100}%` }}
          >
            {effort}
          </span>
        ))}
      </div>
    </div>
  );
}
