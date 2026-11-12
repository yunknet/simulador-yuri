import { formatCurrency } from "@/lib/format";
import { IMMEDIATE_BID_ID, objectives } from "../simulator.config";
import type { SimulatorState } from "../useSimulator";
import { OptionCard } from "./OptionCard";
import { ValueSlider } from "./ValueSlider";

export function StepObjective({ sim }: { sim: SimulatorState }) {
  return (
    <fieldset>
      <legend className="font-display text-xl font-bold text-foreground sm:text-2xl">Qual é o seu objetivo?</legend>
      <p className="mb-5 mt-1 text-sm font-medium text-muted-foreground">
        <span className="text-primary">{sim.type.label}</span> · {formatCurrency(sim.credit)}
      </p>

      <div role="radiogroup" aria-label="Objetivo" className="space-y-3">
        {objectives.map((option) => (
          <div key={option.id}>
            <OptionCard
              selected={sim.objective === option.id}
              onSelect={() => sim.setObjective(option.id)}
              icon={option.icon}
              title={option.title}
              description={option.description}
            />

            {option.id === IMMEDIATE_BID_ID && sim.isImmediateBid && (
              <div className="mt-2 rounded-xl border border-primary/15 bg-secondary/70 p-4 duration-300 animate-in fade-in slide-in-from-top-1">
                <ValueSlider
                  id="bid"
                  label="Quanto de lance você tem em mãos?"
                  value={sim.bidIndex}
                  displayValue={sim.bid}
                  min={0}
                  max={sim.bidValues.length - 1}
                  minLabel={0}
                  maxLabel={sim.credit}
                  onChange={sim.setBidIndex}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}
