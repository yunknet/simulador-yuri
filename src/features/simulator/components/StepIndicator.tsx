import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { STEPS } from "../simulator.config";

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Etapas da simulação">
      {STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const done = stepNumber < current;
        const active = stepNumber === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2" aria-current={active ? "step" : undefined}>
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                done && "bg-primary text-white",
                active && "bg-accent text-accent-foreground ring-4 ring-accent/20",
                !done && !active && "bg-secondary text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : stepNumber}
            </span>
            <span className={cn("hidden text-xs font-semibold sm:inline", active ? "text-primary" : "text-muted-foreground")}>{label}</span>
            {stepNumber < STEPS.length && <span className={cn("h-0.5 flex-1 rounded-full", done ? "bg-primary" : "bg-border")} aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
