import { useEffect, useRef } from "react";
import { ArrowDown, MousePointerClick } from "lucide-react";
import { consortiumTypes } from "../simulator.config";
import type { SimulatorState } from "../useSimulator";
import { OptionCard } from "./OptionCard";
import { ValueSlider } from "./ValueSlider";

/**
 * Leva o bloco do valor para o meio da tela (com o botão "Próximo" logo abaixo),
 * só se ele não estiver totalmente visível.
 */
function revealCreditBox(element: HTMLElement | null) {
  if (!element) return;
  const { top, bottom } = element.getBoundingClientRect();
  const footerSpace = 110; // botão "Próximo" abaixo do bloco
  if (top >= 80 && bottom + footerSpace <= window.innerHeight) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
}

export function StepType({ sim }: { sim: SimulatorState }) {
  const creditRef = useRef<HTMLDivElement>(null);
  const userSelected = useRef(false);

  // Sempre que o visitante escolhe um tipo, mostra onde definir o valor.
  useEffect(() => {
    if (!userSelected.current || !sim.type) return;
    const frame = requestAnimationFrame(() => revealCreditBox(creditRef.current));
    return () => cancelAnimationFrame(frame);
  }, [sim.type]);

  const handleSelect = (typeId: string) => {
    userSelected.current = true;
    sim.selectType(typeId);
  };

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-1 font-display text-xl font-bold text-foreground sm:text-2xl">Escolha o tipo de consórcio</legend>
        <p className="mb-4 text-sm text-muted-foreground">Toque na opção que você quer conquistar.</p>
        <div role="radiogroup" aria-label="Tipo de consórcio" className="grid grid-cols-2 gap-2 sm:gap-3">
          {consortiumTypes.map((option) => (
            <OptionCard
              key={option.id}
              layout="tile"
              selected={sim.type?.id === option.id}
              onSelect={() => handleSelect(option.id)}
              icon={option.icon}
              title={option.label}
              description={option.hint}
            />
          ))}
        </div>
      </fieldset>

      <div ref={creditRef} className="scroll-mt-24">
        {sim.type ? (
          <div
            key={sim.type.id}
            className="rounded-2xl border-2 border-accent/60 bg-accent/[0.07] p-4 shadow-sm duration-500 animate-in fade-in zoom-in-95 sm:p-5"
          >
            <p className="mb-3 flex items-center gap-1.5 text-sm font-bold text-accent-strong">
              <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden /> Agora escolha o valor do crédito
            </p>
            <ValueSlider
              id="credit"
              label={`Crédito para ${sim.type.label.toLowerCase()}`}
              value={sim.credit}
              displayValue={sim.credit}
              min={sim.type.min}
              max={sim.type.max}
              step={sim.type.step}
              minLabel={sim.type.min}
              maxLabel={sim.type.max}
              onChange={sim.setCredit}
            />
            <p className="mt-3 text-xs text-muted-foreground">Arraste a bolinha para ajustar o valor.</p>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-border p-4 text-sm text-muted-foreground">
            <MousePointerClick className="h-5 w-5 shrink-0 text-primary/50" aria-hidden />
            Escolha um tipo acima para definir o valor do crédito.
          </div>
        )}
      </div>
    </div>
  );
}
