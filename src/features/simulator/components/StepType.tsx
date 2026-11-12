import { consortiumTypes } from "../simulator.config";
import type { SimulatorState } from "../useSimulator";
import { OptionCard } from "./OptionCard";
import { ValueSlider } from "./ValueSlider";

export function StepType({ sim }: { sim: SimulatorState }) {
  return (
    <div className="space-y-7">
      <fieldset>
        <legend className="mb-4 font-display text-xl font-bold text-foreground sm:text-2xl">Escolha o tipo de consórcio</legend>
        <div role="radiogroup" aria-label="Tipo de consórcio" className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {consortiumTypes.map((option) => (
            <OptionCard
              key={option.id}
              layout="tile"
              selected={sim.type.id === option.id}
              onSelect={() => sim.selectType(option.id)}
              icon={option.icon}
              title={option.label}
              description={option.hint}
            />
          ))}
        </div>
      </fieldset>

      <ValueSlider
        id="credit"
        label="Valor do crédito"
        value={sim.credit}
        displayValue={sim.credit}
        min={sim.type.min}
        max={sim.type.max}
        step={sim.type.step}
        minLabel={sim.type.min}
        maxLabel={sim.type.max}
        onChange={sim.setCredit}
      />
    </div>
  );
}
