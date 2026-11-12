import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/format";

interface ValueSliderProps {
  id: string;
  label: string;
  value: number;
  displayValue: number;
  min: number;
  max: number;
  step?: number;
  minLabel: number;
  maxLabel: number;
  onChange: (value: number) => void;
}

/** Slider de valores monetários com rótulo, valor em destaque e limites. */
export function ValueSlider({ id, label, value, displayValue, min, max, step = 1, minLabel, maxLabel, onChange }: ValueSliderProps) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <label id={`${id}-label`} className="text-sm font-medium text-muted-foreground">
          {label}
        </label>
        <output htmlFor={id} aria-live="polite" className="font-display text-2xl font-bold tabular-nums text-primary sm:text-3xl">
          {formatCurrency(displayValue)}
        </output>
      </div>
      <Slider
        id={id}
        aria-labelledby={`${id}-label`}
        aria-valuetext={formatCurrency(displayValue)}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={([next]) => onChange(next)}
      />
      <div className="mt-2.5 flex justify-between text-xs font-medium text-muted-foreground">
        <span>{formatCurrency(minLabel)}</span>
        <span>{formatCurrency(maxLabel)}</span>
      </div>
    </div>
  );
}
