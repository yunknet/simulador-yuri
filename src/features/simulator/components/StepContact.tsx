import { formatCurrency } from "@/lib/format";
import type { SimulatorState } from "../useSimulator";

export function StepContact({ sim }: { sim: SimulatorState }) {
  const summary = [
    { label: "Consórcio", value: sim.type?.label ?? "" },
    { label: "Crédito", value: formatCurrency(sim.credit) },
    { label: "Objetivo", value: sim.objective },
    ...(sim.isImmediateBid ? [{ label: "Lance", value: formatCurrency(sim.bid) }] : []),
  ];

  return (
    <div>
      <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">Para onde envio sua simulação?</h3>
      <p className="mb-5 mt-1 text-sm font-medium text-muted-foreground">
        Preencha rapidinho para eu ou minha equipe te enviar os valores no WhatsApp.
      </p>

      <dl className="mb-6 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-secondary/70 p-4 text-sm">
        {summary.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd className="truncate font-semibold text-primary">{item.value}</dd>
          </div>
        ))}
      </dl>

      <label htmlFor="sim-name" className="mb-1.5 block text-sm font-semibold text-foreground">
        Seu nome
      </label>
      <input
        id="sim-name"
        type="text"
        name="name"
        required
        autoComplete="name"
        autoCapitalize="words"
        enterKeyHint="send"
        spellCheck={false}
        placeholder="Ex: João da Silva"
        value={sim.name}
        onChange={(event) => sim.setName(event.target.value)}
        className="h-12 w-full rounded-xl border border-input bg-white px-4 text-base text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}
