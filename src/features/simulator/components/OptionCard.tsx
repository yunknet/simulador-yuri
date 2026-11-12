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
        // Celular: ícone e nome lado a lado (card baixo); a partir do sm, card em coluna com descrição.
        layout === "tile" ? "min-h-[3.75rem] items-center gap-2 p-2.5 sm:flex-col sm:items-start sm:gap-3 sm:p-4 sm:pr-7" : "items-start p-4",
        selected
          ? "border-primary bg-secondary shadow-sm"
          : "border-border bg-white hover:border-primary/30 hover:bg-secondary/50",
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg transition-colors",
          layout === "tile" ? "h-8 w-8 sm:h-9 sm:w-9" : "h-10 w-10",
          selected ? "bg-primary text-white" : "bg-secondary text-primary/70 group-hover:text-primary",
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className={cn("block font-semibold leading-tight", layout === "tile" ? "text-[13px] sm:text-[15px]" : "text-base", selected ? "text-primary" : "text-foreground")}>
          {title}
        </span>
        {description && (
          <span className={cn("mt-1 leading-snug text-muted-foreground", layout === "tile" ? "hidden text-xs sm:block" : "block text-sm")}>{description}</span>
        )}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute right-3 top-3 h-4 w-4 rounded-full border-2 transition-colors",
          // No celular a seleção já fica clara pela borda e pelo ícone preenchido.
          layout === "tile" && "hidden sm:block",
          selected ? "border-primary bg-primary shadow-[inset_0_0_0_2px_white]" : "border-input",
        )}
      />
    </button>
  );
}
