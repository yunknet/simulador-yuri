import logoMark from "@/assets/logo-mark.png";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface LogoProps {
  tone?: "light" | "dark";
  className?: string;
}

/** Monograma "YS" + nome. `tone="dark"` para fundos escuros. */
export function Logo({ tone = "light", className }: LogoProps) {
  const dark = tone === "dark";
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img src={logoMark} alt="" width={346} height={331} className="h-8 w-auto lg:h-9" />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[17px] font-bold tracking-tight lg:text-lg", dark ? "text-white" : "text-primary")}>
          {siteConfig.name}
        </span>
        <span className={cn("mt-1 text-[10px] font-medium uppercase tracking-[0.16em] lg:text-[11px]", dark ? "text-white/60" : "text-muted-foreground")}>
          {siteConfig.tagline}
        </span>
      </span>
    </span>
  );
}
