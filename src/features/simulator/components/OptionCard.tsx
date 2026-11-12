import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OptionCardProps {
  selected: boolean;
  onSelect: () => void;
  icon: LucideIcon;
  title: string;
  description?: string;
  layout?: "tile" | "row";
}

/** Opção selecionável com semântica de radio (acessível por teclado e leitor de tela). */
export function OptionCard({ selected, onSelect, icon: Icon, title, description, layout = "row" }: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group relative flex w-full gap-3 rounded-xl border-2 text-left transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        layout === "tile" ? "flex-col items-start p-3.5 sm:p-4" : "items-start p-4",
        selected
          ? "border-primary bg-secondary shadow-sm"
          : "border-border bg-white hover:border-primary/30 hover:bg-secondary/50",
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg transition-colors",
          layout === "tile" ? "h-9 w-9" : "h-10 w-10",
          selected ? "bg-primary text-white" : "bg-secondary text-primary/70 group-hover:text-primary",
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className={cn("block font-semibold leading-tight", layout === "tile" ? "text-sm sm:text-[15px]" : "text-base", selected ? "text-primary" : "text-foreground")}>
          {title}
        </span>
        {description && (
          <span className={cn("mt-1 block leading-snug text-muted-foreground", layout === "tile" ? "text-xs" : "text-sm")}>{description}</span>
        )}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute right-3 top-3 h-4 w-4 rounded-full border-2 transition-colors",
          selected ? "border-primary bg-primary shadow-[inset_0_0_0_2px_white]" : "border-input",
        )}
      />
    </button>
  );
}
